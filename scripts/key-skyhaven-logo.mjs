#!/usr/bin/env node
/**
 * Chroma-key the Skyhaven logo PNG (green screen) → public/projects/skyhaven/logo.webp
 */
import { mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const src = path.join(repoRoot, 'assets', 'Skyhaven', 'Codex-Bild_1._Aug._2026_10_39_31.png');
const destDir = path.join(repoRoot, 'public', 'projects', 'skyhaven');
const dest = path.join(destDir, 'logo.webp');

function isKeyGreen(r, g, b) {
  const excess = g - Math.max(r, b);
  if (g < 55) return false;
  if (excess > 70 && g > 100) return true;
  if (excess > 40 && g > 80 && g > r * 1.35 && g > b * 1.4) return true;
  return false;
}

function isSoftGreen(r, g, b) {
  const excess = g - Math.max(r, b);
  return g > 50 && excess > 28 && g > r && g > b;
}

async function main() {
  mkdirSync(destDir, { recursive: true });
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const n = width * height;
  const bg = new Uint8Array(n);

  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (bg[p]) return;
    const i = p * channels;
    if (!isSoftGreen(data[i], data[i + 1], data[i + 2])) return;
    bg[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  for (let p = 0; p < n; p += 1) {
    const i = p * channels;
    if (isKeyGreen(data[i], data[i + 1], data[i + 2])) {
      bg[p] = 1;
      queue.push(p);
    }
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % width;
    const y = (p / width) | 0;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  const dilated = new Uint8Array(bg);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      if (bg[p]) continue;
      if (
        bg[p - 1] ||
        bg[p + 1] ||
        bg[p - width] ||
        bg[p + width]
      ) {
        dilated[p] = 1;
      }
    }
  }

  const alpha = new Uint8Array(n);
  for (let p = 0; p < n; p += 1) {
    if (dilated[p]) {
      alpha[p] = bg[p] ? 0 : 70;
      continue;
    }
    const i = p * channels;
    if (isSoftGreen(data[i], data[i + 1], data[i + 2])) alpha[p] = 90;
    else alpha[p] = 255;
  }

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      if (alpha[p] === 255) continue;
      let neighbor = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (alpha[(y + dy) * width + (x + dx)] === 255) neighbor += 1;
        }
      }
      if (neighbor && alpha[p] === 0) alpha[p] = Math.min(140, neighbor * 18);
    }
  }

  const out = Buffer.alloc(n * 4);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      const i = p * channels;
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      const a = alpha[p];
      if (a < 255 && g > r && g > b) {
        const spill = Math.min(g - (r + b) / 2, 90) * (1 - a / 255);
        g = Math.max(0, Math.round(g - spill));
      }
      const oi = p * 4;
      out[oi] = r;
      out[oi + 1] = g;
      out[oi + 2] = b;
      out[oi + 3] = a;
      if (a > 20) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 10;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  await sharp(out, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .webp({ quality: 90, effort: 6, alphaQuality: 100 })
    .toFile(dest);

  const meta = await sharp(dest).metadata();
  console.log(
    `logo.webp ${meta.width}×${meta.height} alpha=${meta.hasAlpha} ${((statSync(dest).size / 1024) | 0)} KB`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
