#!/usr/bin/env node
/**
 * Compress VFX Bewerbung assets → public/projects/ninja-mage + skyhaven-vfx
 * Usage: node scripts/compress-vfx-portfolio-assets.mjs
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcDir =
  'D:\\BLEND\\01.ONGOING_PROJECTS\\Original_NinjaFight_Render + AfterEffects + BLEND\\VFX_Bewerbung';
const ninjaOut = path.join(repoRoot, 'public', 'projects', 'ninja-mage');
const vfxOut = path.join(repoRoot, 'public', 'projects', 'skyhaven-vfx');

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function findNinjaSource() {
  const hit = readdirSync(srcDir).find((f) => f.toLowerCase().startsWith('ninja_') && f.toLowerCase().endsWith('.mp4'));
  if (!hit) throw new Error(`No NINJA_*.mp4 in ${srcDir}`);
  return path.join(srcDir, hit);
}

async function toWebp(src, dest, maxEdge = 1920) {
  mkdirSync(path.dirname(dest), { recursive: true });
  const before = statSync(src).size;
  await sharp(src)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(`[webp] ${path.basename(dest)} ${meta.width}×${meta.height} ${fmtMB(before)} → ${fmtMB(statSync(dest).size)}`);
}

async function encodeMp4({ src, dest, extraArgs, label }) {
  if (!ffmpegPath) throw new Error('ffmpeg-static missing');
  mkdirSync(path.dirname(dest), { recursive: true });
  console.log(`\n[mp4] ${label}`);
  const t0 = Date.now();
  await exec(
    ffmpegPath,
    ['-y', '-hide_banner', '-loglevel', 'error', '-i', src, ...extraArgs, dest],
    { maxBuffer: 256 * 1024 * 1024 },
  );
  console.log(`  → ${fmtMB(statSync(dest).size)} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

async function extractPoster(src, dest) {
  const tmp = `${dest}.jpg`;
  mkdirSync(path.dirname(dest), { recursive: true });
  await exec(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '00:00:02', '-i', src, '-frames:v', '1', '-q:v', '2', tmp]);
  await sharp(tmp).rotate().resize(1280, 1920, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(dest);
  rmSync(tmp, { force: true });
  console.log(`[poster] ${path.basename(dest)}`);
}

async function makePlaceholder(dest) {
  mkdirSync(path.dirname(dest), { recursive: true });
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <rect width="1920" height="1080" fill="#0b0d12"/>
    <text x="960" y="500" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" fill="#f5f5f7">Skyhaven VFX Studio</text>
    <text x="960" y="570" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#a1a1a6">demo coming soon — replace studio-demo.mp4</text>
  </svg>`);
  const png = dest.replace(/\.mp4$/, '-slate.png');
  await sharp(svg).png().toFile(png);
  await exec(ffmpegPath, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-loop', '1', '-i', png, '-t', '4',
    '-vf', 'fps=24,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
    '-movflags', '+faststart', '-an', dest,
  ]);
  rmSync(png, { force: true });
  console.log(`[placeholder] ${path.basename(dest)} ${fmtMB(statSync(dest).size)}`);
}

async function main() {
  if (!existsSync(srcDir)) throw new Error(`Missing source dir: ${srcDir}`);
  mkdirSync(ninjaOut, { recursive: true });
  mkdirSync(vfxOut, { recursive: true });

  const ninjaSrc = findNinjaSource();
  console.log('Ninja source:', ninjaSrc, fmtMB(statSync(ninjaSrc).size));

  const scale = 'scale=-2:1920';
  const common = ['-vf', scale, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

  await encodeMp4({
    src: ninjaSrc,
    dest: path.join(ninjaOut, 'hero.mp4'),
    label: 'ninja hero (full, audio, CRF 17, 1920 long-edge)',
    extraArgs: [...common, '-c:a', 'aac', '-b:a', '160k'],
  });
  await encodeMp4({
    src: ninjaSrc,
    dest: path.join(ninjaOut, 'tile-preview.mp4'),
    label: 'ninja tile (first 10s, muted)',
    extraArgs: ['-t', '10', ...common, '-an'],
  });
  await extractPoster(ninjaSrc, path.join(ninjaOut, 'poster.webp'));

  const ninjaStills = [
    ['Environment.png', 'environment.webp'],
    ['Environment1.png', 'environment-1.webp'],
    ['Environment3.png', 'environment-3.webp'],
    ['RenderTransparent.png', 'render-transparent.webp'],
    ['BlenderViewport.png', 'blender-viewport.webp'],
    ['BlenderVIewport1.png', 'blender-viewport-1.webp'],
  ];
  for (const [srcName, destName] of ninjaStills) {
    const src = path.join(srcDir, srcName);
    if (!existsSync(src)) {
      console.warn(`[skip] ${srcName}`);
      continue;
    }
    await toWebp(src, path.join(ninjaOut, destName), 1920);
  }

  const vfxStills = [
    ['VFX_for_Skyhaven_StartScreen.png', 'start-screen.webp'],
    ['VFX_for_Skyhaven_Presets.png', 'presets.webp'],
    ['VFX_for_Skyhaven_Animations.png', 'animations.webp'],
    ['VFX_for_Skyhaven1.png', 'editor.webp'],
  ];
  for (const [srcName, destName] of vfxStills) {
    const src = path.join(srcDir, srcName);
    if (!existsSync(src)) {
      console.warn(`[skip] ${srcName}`);
      continue;
    }
    await toWebp(src, path.join(vfxOut, destName), 1920);
  }

  await makePlaceholder(path.join(vfxOut, 'studio-demo.mp4'));
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
