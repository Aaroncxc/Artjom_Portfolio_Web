#!/usr/bin/env node
/**
 * Compress Agata Journal loop + product video → public/tools/agata/
 * Usage: node scripts/compress-agata-videos.mjs
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'assets', 'Artjom_AgataJournal');
const outDir = path.join(repoRoot, 'public', 'tools', 'agata');

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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
  await exec(ffmpegPath, [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    '00:00:01',
    '-i',
    src,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    tmp,
  ]);
  await sharp(tmp)
    .rotate()
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(dest);
  rmSync(tmp, { force: true });
  console.log(`[poster] ${path.basename(dest)} ${fmtMB(statSync(dest).size)}`);
}

async function main() {
  const loopSrc = path.join(srcDir, 'Loop.mov');
  const productSrc = path.join(srcDir, 'AgataJounral_ProductVideo.m4v');
  if (!existsSync(loopSrc)) throw new Error(`Missing ${loopSrc}`);
  if (!existsSync(productSrc)) throw new Error(`Missing ${productSrc}`);
  mkdirSync(outDir, { recursive: true });

  await encodeMp4({
    src: loopSrc,
    dest: path.join(outDir, 'tile-preview.mp4'),
    label: 'agata tile loop (muted, long-edge 1080)',
    extraArgs: [
      '-vf',
      'scale=1080:1080:force_original_aspect_ratio=decrease',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '20',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
    ],
  });

  await encodeMp4({
    src: productSrc,
    dest: path.join(outDir, 'product.mp4'),
    label: 'agata product (audio, long-edge 1920, CRF 20)',
    extraArgs: [
      '-vf',
      'scale=-2:1080',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '20',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-c:a',
      'aac',
      '-b:a',
      '160k',
    ],
  });

  await extractPoster(productSrc, path.join(outDir, 'product-poster.webp'));
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
