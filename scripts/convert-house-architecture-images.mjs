/**
 * One-off helper: PNG → WebP (max edge 2560px, ~quality 84).
 * Adjust paths/source files if needed; run with: node scripts/convert-house-architecture-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'assets/Artjom_The_House_only_Assets');
const destDir = path.join(repoRoot, 'public/projects/the-house');

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.png$/i.test(f))
  .sort();

if (!files.length) {
  console.error('No PNG files in', srcDir);
  process.exit(1);
}

for (let i = 0; i < files.length; i++) {
  const basename = `architecture-enhanced-${String(i + 1).padStart(2, '0')}.webp`;
  const dest = path.join(destDir, basename);
  const src = path.join(srcDir, files[i]);

  await sharp(src)
    .rotate()
    .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(dest);

  const { width, height, size } = await sharp(dest).metadata();
  const stat = fs.statSync(dest);
  console.log(`${basename}: ${width}×${height}, ${Math.round(stat.size / 1024)} KB (${src})`);
}
