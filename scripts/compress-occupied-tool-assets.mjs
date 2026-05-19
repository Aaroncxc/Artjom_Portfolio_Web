#!/usr/bin/env node
/**
 * Compress Occupied tool assets from assets/Occupied → public/tools/occupied (webp + mp4).
 * Usage: node scripts/compress-occupied-tool-assets.mjs
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
const srcDir = path.join(repoRoot, 'assets', 'Occupied');
const outDir = path.join(repoRoot, 'public', 'tools', 'occupied');

const IMAGE_MAP = [
  ['Occupied_Thumbnail.png', 'thumbnail.webp'],
  ['Occupied_1.png', 'workspace.webp'],
  ['Occupied_Login.png', 'login.webp'],
  ['Occupied_2.png', 'screen-2.webp'],
  ['Occupied_3.png', 'screen-3.webp'],
  ['Occupied_4.png', 'screen-4.webp'],
  ['Occupied_5.png', 'screen-5.webp'],
];

const VIDEO_MAP = [
  { src: 'Video Project 1.mp4', dest: 'showreel.mp4', withAudio: false },
  { src: 'Video Project 2.mp4', dest: 'tile-preview.mp4', withAudio: false },
  { src: 'Occupied_Trailer_Video.mp4', dest: 'trailer.mp4', withAudio: true },
];

const MAX_EDGE = 1920;
const WEBP_QUALITY = 82;

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function compressImage(srcName, destName) {
  const src = path.join(srcDir, srcName);
  const dest = path.join(outDir, destName);
  if (!existsSync(src)) {
    console.warn(`[skip] missing ${srcName}`);
    return;
  }
  const before = statSync(src).size;
  await sharp(src)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(dest);
  const after = statSync(dest).size;
  const meta = await sharp(dest).metadata();
  console.log(
    `[webp] ${destName}: ${meta.width}×${meta.height}, ${fmtMB(before)} → ${fmtMB(after)}`,
  );
}

async function compressVideo({ src: srcName, dest: destName, withAudio = false }) {
  if (!ffmpegPath) {
    console.error('ffmpeg-static not available');
    process.exit(1);
  }
  const src = path.join(srcDir, srcName);
  const dest = path.join(outDir, destName);
  if (!existsSync(src)) {
    console.warn(`[skip] missing ${srcName}`);
    return;
  }
  const before = statSync(src).size;
  console.log(`\n[mp4] ${srcName} (${fmtMB(before)}) → ${destName}${withAudio ? ' (+audio)' : ''}`);
  const args = [
    '-y',
    '-hide_banner',
    '-i',
    src,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '28',
    '-vf',
    'scale=min(1280\\,iw):-2',
    '-movflags',
    '+faststart',
  ];
  if (withAudio) {
    args.push('-c:a', 'aac', '-b:a', '128k');
  } else {
    args.push('-an');
  }
  args.push(dest);
  await exec(ffmpegPath, args, { maxBuffer: 64 * 1024 * 1024 });
  const after = statSync(dest).size;
  console.log(`[mp4] done: ${fmtMB(after)} (${Math.round((1 - after / before) * 100)}% smaller)`);
}

async function main() {
  if (!existsSync(srcDir)) {
    console.error('Source folder missing:', srcDir);
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });

  const legacy = [
    'thumbnail.png',
    'workspace.png',
    'login.png',
    'screen-2.png',
    'screen-3.png',
    'screen-4.png',
    'screen-5.png',
    'showreel.mp4',
  ];
  for (const f of legacy) {
    const p = path.join(outDir, f);
    if (existsSync(p)) {
      rmSync(p);
      console.log(`[clean] removed ${f}`);
    }
  }

  for (const [src, dest] of IMAGE_MAP) {
    await compressImage(src, dest);
  }
  for (const entry of VIDEO_MAP) {
    await compressVideo(entry);
  }

  console.log('\nAll Occupied tool assets written to public/tools/occupied/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
