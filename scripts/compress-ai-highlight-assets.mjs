#!/usr/bin/env node
/**
 * Compress Flasher + Multikunst Automation assets → public/tools/
 * Usage: node scripts/compress-ai-highlight-assets.mjs
 */
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const MAX_EDGE = 1920;
const WEBP_QUALITY = 82;

const TOOL_PACKS = [
  {
    srcDir: path.join(repoRoot, 'assets', 'Artjom_Flasher'),
    outDir: path.join(repoRoot, 'public', 'tools', 'flasher'),
    images: [
      ['thumbnail.png', 'thumbnail.webp'],
      ['002.png', 'screen-002.webp'],
      ['003.png', 'screen-003.webp'],
      ['004.png', 'screen-004.webp'],
    ],
  },
  {
    srcDir: path.join(repoRoot, 'assets', 'Arjom_MultikunstAutomation'),
    outDir: path.join(repoRoot, 'public', 'tools', 'multikunst-automation'),
    images: [
      ['thumbnail.png', 'thumbnail.webp'],
      ['001.png', 'screen-001.webp'],
      ['002.png', 'screen-002.webp'],
      ['003.png', 'screen-003.webp'],
      ['004.png', 'screen-004.webp'],
      ['005.png', 'screen-005.webp'],
    ],
  },
];

async function toWebp(src, dest) {
  const before = statSync(src).size;
  await sharp(src)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(dest);
  const after = statSync(dest).size;
  const meta = await sharp(dest).metadata();
  console.log(
    `[webp] ${path.basename(dest)}: ${meta.width}×${meta.height}, ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(2)} MB`,
  );
}

async function main() {
  for (const pack of TOOL_PACKS) {
    if (!existsSync(pack.srcDir)) {
      console.warn(`[skip] missing ${pack.srcDir}`);
      continue;
    }
    mkdirSync(pack.outDir, { recursive: true });
    console.log(`\n→ ${path.relative(repoRoot, pack.outDir)}`);
    for (const [srcName, destName] of pack.images) {
      const src = path.join(pack.srcDir, srcName);
      if (!existsSync(src)) {
        console.warn(`[skip] missing ${srcName}`);
        continue;
      }
      await toWebp(src, path.join(pack.outDir, destName));
    }
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
