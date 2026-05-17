#!/usr/bin/env node
/**
 * Re-encode the three Lexsolar project MP4s under `public/projects/lexsolar-digital-learning-kit/`
 * to WebM (libvpx-vp9 + libopus) so we can keep them under GitHub's 100 MB limit.
 *
 * - Caps resolution at 1920x1080 (downscale 4K source) with Lanczos scaling.
 * - Single-pass VP9 in CRF mode (constant quality) for speed.
 * - Opus audio at 96k (stereo). Streams without audio still encode fine.
 * - Writes .webm next to the .mp4. The .mp4 is removed only after the .webm exists.
 *
 * Usage: `node scripts/convert-lexsolar-videos-to-webm.mjs`
 */

import { execFile } from 'node:child_process';
import { existsSync, statSync, unlinkSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const exec = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');

if (!ffmpegPath) {
  console.error('ffmpeg-static did not provide a binary path. Aborting.');
  process.exit(1);
}

const TARGETS = [
  'public/projects/lexsolar-digital-learning-kit/whole-exercise-gameplay.mp4',
  'public/projects/lexsolar-digital-learning-kit/case-footage.mp4',
  'public/projects/lexsolar-digital-learning-kit/ui-examples.mp4',
];

/** Quality knob — 32-34 is a sensible web sweet spot for VP9 at 1080p. */
const VP9_CRF = '34';

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function convertOne(relativePath) {
  const input = path.join(repoRoot, relativePath);
  const output = input.replace(/\.mp4$/i, '.webm');

  if (!existsSync(input)) {
    console.warn(`[skip] missing source: ${relativePath}`);
    return { input, output, skipped: true };
  }

  if (existsSync(output)) {
    console.warn(`[skip] webm already exists: ${path.relative(repoRoot, output)}`);
    return { input, output, skipped: true };
  }

  const startSize = statSync(input).size;
  console.log(`\n[encode] ${relativePath} (${fmtMB(startSize)}) -> ${path.basename(output)}`);

  const args = [
    '-y',
    '-hide_banner',
    '-i',
    input,
    '-c:v',
    'libvpx-vp9',
    '-crf',
    VP9_CRF,
    '-b:v',
    '0',
    '-row-mt',
    '1',
    '-tile-columns',
    '2',
    '-frame-parallel',
    '1',
    '-threads',
    '0',
    '-deadline',
    'good',
    '-cpu-used',
    '3',
    '-pix_fmt',
    'yuv420p',
    // Cap to 1920x1080 while preserving aspect ratio; round to even pixels.
    '-vf',
    "scale='trunc(min(1920,iw)/2)*2':'trunc(min(1080,ih)/2)*2':flags=lanczos",
    '-c:a',
    'libopus',
    '-b:a',
    '96k',
    '-ar',
    '48000',
    '-ac',
    '2',
    '-movflags',
    '+faststart',
    output,
  ];

  const t0 = Date.now();
  try {
    await exec(ffmpegPath, args, { maxBuffer: 1024 * 1024 * 64 });
  } catch (err) {
    console.error(`[fail] ${relativePath}: ${err.message}`);
    if (existsSync(output)) {
      try {
        unlinkSync(output);
      } catch {
        /* ignore */
      }
    }
    throw err;
  }
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  const endSize = statSync(output).size;
  const ratio = ((endSize / startSize) * 100).toFixed(1);
  console.log(
    `[done]   ${path.basename(output)} -> ${fmtMB(endSize)} (${ratio}% of source, ${elapsed}s)`,
  );

  // Remove the source MP4 only once the WebM exists and is non-empty.
  if (endSize > 0) {
    unlinkSync(input);
    console.log(`[clean]  removed ${path.basename(input)}`);
  }

  return { input, output, skipped: false, startSize, endSize };
}

async function main() {
  console.log(`Using ffmpeg: ${ffmpegPath}`);
  console.log(`VP9 CRF=${VP9_CRF}, audio=libopus@96k, max 1080p`);
  for (const relPath of TARGETS) {
    await convertOne(relPath);
  }
  console.log('\nAll done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
