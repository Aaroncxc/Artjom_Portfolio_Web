#!/usr/bin/env node
/**
 * Compress Skyhaven portfolio assets → public/projects/skyhaven
 * Usage: node scripts/compress-skyhaven-assets.mjs
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcRoot = path.join(repoRoot, 'assets', 'Skyhaven');
const modelsSrc = path.join(srcRoot, 'models-3d');
const outRoot = path.join(repoRoot, 'public', 'projects', 'skyhaven');
const modelsOut = path.join(outRoot, 'models-3d');
const videosOut = path.join(outRoot, 'videos');
const postersOut = path.join(outRoot, 'posters');

/** Skip sources larger than this (e.g. raw 6 GB toolbox export). */
const MAX_SOURCE_MB = 800;

const SKYHAVEN_VIDEO_MAP = [
  {
    src: 'IntroScreen_Electro_reAL.mp4',
    dest: 'tile-preview.mp4',
    poster: 'posters/intro-electro.webp',
    maxHeight: 720,
    crf: 22,
  },
  {
    src: 'IntroScreen_Fighting.webm',
    dest: 'videos/fighting.mp4',
    poster: 'posters/fighting.webp',
    maxHeight: 720,
    crf: 22,
  },
  {
    src: 'Farming.mp4',
    dest: 'videos/farming.mp4',
    poster: 'posters/farming.webp',
    maxHeight: 720,
    crf: 22,
  },
  {
    src: 'Skyhaven Widget Highlight.webm',
    dest: 'videos/widget-highlight.mp4',
    poster: 'posters/widget-highlight.webp',
    maxHeight: 720,
    crf: 24,
  },
];

const MODEL_MAX_EDGE = 384;
const WEBP_QUALITY = 82;

/** Portfolio codex previews only (lib/skyhavenAssets.ts). */
const PREVIEW_MODEL_IDS = new Set([
  'main-char',
  'enemy-robot',
  'taverne',
  'mine',
  'tree',
  'halfGrownCropTile',
  'farm2x2',
  'pathCross',
  'prop-axe',
  'prop-setzling',
  'airship-wing',
  'airShipPort',
]);

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function sampleFlatBackground(data, width, height, channels) {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * channels;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return [r / 4, g / 4, b / 4];
}

function colorDistance(r, g, b, bg) {
  return Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
}

/** Turn uniform gray capture backdrops into alpha for clean cards on white UI. */
async function toWebpWithTransparentBg(src, dest, maxEdge) {
  const before = statSync(src).size;
  const { data, info } = await sharp(src)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bg = sampleFlatBackground(data, width, height, channels);
  const fadeStart = 8;
  const fadeEnd = 30;
  const out = Buffer.alloc(width * height * 4);

  for (let px = 0; px < width * height; px += 1) {
    const ri = px * channels;
    const r = data[ri];
    const g = data[ri + 1];
    const b = data[ri + 2];
    const dist = colorDistance(r, g, b, bg);
    let alpha = 255;
    if (dist <= fadeStart) alpha = 0;
    else if (dist < fadeEnd) alpha = Math.round((255 * (dist - fadeStart)) / (fadeEnd - fadeStart));

    const oi = px * 4;
    out[oi] = r;
    out[oi + 1] = g;
    out[oi + 2] = b;
    out[oi + 3] = alpha;
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ quality: WEBP_QUALITY, effort: 6, alphaQuality: 90 })
    .toFile(dest);

  const after = statSync(dest).size;
  const meta = await sharp(dest).metadata();
  console.log(`[webp] ${path.basename(dest)}: ${meta.width}×${meta.height}, ${fmtMB(before)} → ${fmtMB(after)}`);
}

async function toWebp(src, dest, maxEdge) {
  const before = statSync(src).size;
  await sharp(src)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(dest);
  const after = statSync(dest).size;
  const meta = await sharp(dest).metadata();
  console.log(`[webp] ${path.basename(dest)}: ${meta.width}×${meta.height}, ${fmtMB(before)} → ${fmtMB(after)}`);
}

async function compressVideoEntry({ src: srcName, dest: destRel, poster, maxHeight = 720, crf = 22, optional = false }) {
  if (!ffmpegPath) {
    console.error('ffmpeg-static not available');
    process.exit(1);
  }
  const src = path.join(srcRoot, srcName);
  const dest = path.join(outRoot, destRel);
  if (!existsSync(src)) {
    const msg = `[skip] missing ${srcName}`;
    if (optional) console.warn(msg);
    else console.warn(msg);
    return;
  }
  const before = statSync(src).size;
  if (before > MAX_SOURCE_MB * 1024 * 1024) {
    console.warn(
      `[skip] ${srcName} is ${fmtMB(before)} — compress manually or lower resolution before adding to the repo.`,
    );
    return;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  console.log(`\n[mp4] ${srcName} (${fmtMB(before)}) → ${destRel}`);
  await exec(
    ffmpegPath,
    [
      '-y',
      '-hide_banner',
      '-i',
      src,
      '-vf',
      `scale=-2:${maxHeight}`,
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      String(crf),
      '-movflags',
      '+faststart',
      '-an',
      dest,
    ],
    { maxBuffer: 128 * 1024 * 1024 },
  );
  const after = statSync(dest).size;
  console.log(`  → ${fmtMB(after)}`);

  if (poster) {
    await extractPoster(src, path.join(outRoot, poster));
  }
}

async function extractPoster(srcPath, destWebp) {
  const tmpJpg = `${destWebp}.jpg`;
  mkdirSync(path.dirname(destWebp), { recursive: true });
  await exec(ffmpegPath, [
    '-y',
    '-hide_banner',
    '-ss',
    '00:00:01',
    '-i',
    srcPath,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    tmpJpg,
  ]);
  await sharp(tmpJpg)
    .rotate()
    .resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(destWebp);
  rmSync(tmpJpg, { force: true });
  console.log(`[poster] ${path.basename(destWebp)}`);
}

async function main() {
  mkdirSync(modelsOut, { recursive: true });

  if (existsSync(modelsSrc)) {
    const pngs = readdirSync(modelsSrc)
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .filter((f) => PREVIEW_MODEL_IDS.has(f.replace(/\.png$/i, '')));
    console.log(`\n[models] ${pngs.length} preview PNGs → webp (max ${MODEL_MAX_EDGE}px)`);
    for (const file of pngs.sort()) {
      const base = file.replace(/\.png$/i, '');
      await toWebpWithTransparentBg(
        path.join(modelsSrc, file),
        path.join(modelsOut, `${base}.webp`),
        MODEL_MAX_EDGE,
      );
    }
  }

  mkdirSync(videosOut, { recursive: true });
  mkdirSync(postersOut, { recursive: true });

  for (const entry of SKYHAVEN_VIDEO_MAP) {
    await compressVideoEntry(entry);
  }

  console.log('\nDone → public/projects/skyhaven/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
