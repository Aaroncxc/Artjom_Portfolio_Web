/**
 * Generates offline portfolio PDF from documents/Portfolio_Offline_*.html
 * Compresses images first (~6 MB target for 8-page, ~2 MB for 1-page).
 *
 * Usage:
 *   node scripts/generate-portfolio-pdf.mjs [output.pdf] [--input source.html]
 */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let pdfName = 'Portfolio_Offline_Artjom_Naninjan.pdf';
let htmlName = 'Portfolio_Offline_Artjom_Naninjan.html';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' && args[i + 1]) {
    htmlName = args[++i];
  } else if (!args[i].startsWith('--')) {
    pdfName = args[i];
  }
}

const htmlPath = path.join(repoRoot, 'documents', htmlName);
const pdfPath = path.join(repoRoot, 'documents', pdfName);
const CACHE_DIR = path.join(repoRoot, 'documents', '.portfolio-pdf-cache');

const isOnePage = htmlName.includes('1page');
const TARGET_MB = isOnePage ? 2 : 6;
const HERO_MAX_WIDTH = isOnePage ? 800 : 1700;
const IMAGE_MAX_WIDTH = isOnePage ? 600 : 1500;
const JPEG_QUALITY = isOnePage ? 85 : 90;

if (!fs.existsSync(htmlPath)) {
  console.error('HTML file not found:', htmlPath);
  process.exit(1);
}

function isHeroImage(html, index) {
  const ctx = html.slice(Math.max(0, index - 320), index);
  return (
    ctx.includes('hero-frame') ||
    ctx.includes('cover-photo') ||
    ctx.includes('project-image-cell')
  );
}

async function optimizeImage(absPath, maxWidth) {
  const key = crypto
    .createHash('md5')
    .update(`${absPath}|w${maxWidth}|q${JPEG_QUALITY}`)
    .digest('hex');
  const outPath = path.join(CACHE_DIR, `${key}.jpg`);
  if (fs.existsSync(outPath)) return outPath;

  await sharp(absPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath);

  return outPath;
}

async function buildCompressedHtml() {
  const html = fs.readFileSync(htmlPath, 'utf8');
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const imgRe = /src="\.\.\/public\/([^"]+)"/g;
  let out = '';
  let last = 0;
  let match;
  let count = 0;

  while ((match = imgRe.exec(html)) !== null) {
    out += html.slice(last, match.index);
    const rel = match[1];
    const abs = path.join(repoRoot, 'public', rel.replace(/\//g, path.sep));

    if (!fs.existsSync(abs)) {
      console.warn('Missing image:', abs);
      out += match[0];
      last = match.index + match[0].length;
      continue;
    }

    const maxWidth = isHeroImage(html, match.index) ? HERO_MAX_WIDTH : IMAGE_MAX_WIDTH;
    const optimized = await optimizeImage(abs, maxWidth);
    out += `src="file:///${optimized.replace(/\\/g, '/')}"`;
    last = match.index + match[0].length;
    count += 1;
  }

  out += html.slice(last);
  const renderBase = path.basename(htmlName, '.html');
  const renderHtml = path.join(CACHE_DIR, `${renderBase}_render.html`);
  fs.writeFileSync(renderHtml, out);
  console.log(
    `Optimized ${count} image references (hero ${HERO_MAX_WIDTH}px / gallery ${IMAGE_MAX_WIDTH}px @ q${JPEG_QUALITY})`,
  );
  return renderHtml;
}

async function generatePdf(renderHtml) {
  const script = `
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.emulateMediaType('print');
  await page.goto('file:///' + ${JSON.stringify(renderHtml.replace(/\\/g, '/'))}, {
    waitUntil: 'networkidle0',
  });
  await page.pdf({
    path: ${JSON.stringify(pdfPath)},
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();
  console.log('PDF created:', ${JSON.stringify(pdfPath)});
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
`;

  const tmpScript = path.join(repoRoot, 'documents', '.generate-portfolio-pdf-tmp.cjs');
  fs.writeFileSync(tmpScript, script);

  const install = spawnSync('npm', ['install', '--no-save', 'puppeteer@24'], {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: true,
  });

  if (install.status !== 0) {
    fs.unlinkSync(tmpScript);
    process.exit(install.status ?? 1);
  }

  const run = spawnSync('node', [tmpScript], { cwd: repoRoot, stdio: 'inherit', shell: true });
  fs.unlinkSync(tmpScript);
  return run.status ?? 0;
}

const renderHtml = await buildCompressedHtml();
const status = await generatePdf(renderHtml);

if (status === 0 && fs.existsSync(pdfPath)) {
  const mb = fs.statSync(pdfPath).size / (1024 * 1024);
  console.log(`PDF size: ${mb.toFixed(2)} MB (target ~${TARGET_MB} MB)`);
  if (mb > TARGET_MB * 1.15) {
    console.warn('Still above target — try lowering JPEG_QUALITY or IMAGE_MAX_WIDTH in generate-portfolio-pdf.mjs');
  }
}

process.exit(status);
