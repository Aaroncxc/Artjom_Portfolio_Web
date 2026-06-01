#!/usr/bin/env node
/**
 * Remove Skyhaven source/public files not used by the portfolio.
 * Run: node scripts/cleanup-skyhaven-assets.mjs
 */
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcRoot = path.join(repoRoot, 'assets', 'Skyhaven');
const publicRoot = path.join(repoRoot, 'public', 'projects', 'skyhaven');

/** Codex preview stills (see lib/skyhavenAssets.ts previewAssets). */
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

const KEEP_SOURCE_VIDEOS = new Set([
  'Fullfarming Skyhaven.mp4',
  'IntroScreen_Fighting.webm',
  'Farming.mp4',
  'Skyhaven Widget Highlight.webm',
]);

const KEEP_PUBLIC_FILES = new Set([
  'tile-preview.mp4',
  'hero.webp', // removed from disk; listed so we don't warn if missing
  'walk-surfaces.webp',
]);

let removed = 0;
let bytes = 0;

function removePath(p) {
  if (!existsSync(p)) return;
  const size = statSync(p).isFile() ? statSync(p).size : 0;
  rmSync(p, { recursive: true, force: true });
  removed += 1;
  bytes += size;
  console.log(`[del] ${path.relative(repoRoot, p)}`);
}

// Duplicate export tree
removePath(path.join(srcRoot, 'assets'));

// Unused large / misc sources at assets/Skyhaven root
for (const name of readdirSync(srcRoot)) {
  const full = path.join(srcRoot, name);
  if (!statSync(full).isFile()) continue;
  const lower = name.toLowerCase();
  if (KEEP_SOURCE_VIDEOS.has(name)) continue;
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.svg')) {
    removePath(full);
    continue;
  }
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) {
    removePath(full);
  }
}

// Source model PNGs — keep previews only
const modelsSrc = path.join(srcRoot, 'models-3d');
if (existsSync(modelsSrc)) {
  for (const file of readdirSync(modelsSrc)) {
    if (!file.toLowerCase().endsWith('.png')) continue;
    const id = file.replace(/\.png$/i, '');
    if (!PREVIEW_MODEL_IDS.has(id)) {
      removePath(path.join(modelsSrc, file));
    }
  }
}

// Public unused outputs
if (existsSync(path.join(publicRoot, 'hero.webp'))) removePath(path.join(publicRoot, 'hero.webp'));
if (existsSync(path.join(publicRoot, 'walk-surfaces.webp'))) {
  removePath(path.join(publicRoot, 'walk-surfaces.webp'));
}

const modelsPub = path.join(publicRoot, 'models-3d');
if (existsSync(modelsPub)) {
  for (const file of readdirSync(modelsPub)) {
    if (!file.toLowerCase().endsWith('.webp')) continue;
    const id = file.replace(/\.webp$/i, '');
    if (!PREVIEW_MODEL_IDS.has(id)) {
      removePath(path.join(modelsPub, file));
    }
  }
}

console.log(`\nRemoved ${removed} path(s), ~${(bytes / 1024 / 1024).toFixed(1)} MB freed.`);
