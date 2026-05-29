/**
 * Generates a PDF from a resume HTML file.
 * Usage:
 *   node scripts/generate-resume-pdf.mjs
 *   node scripts/generate-resume-pdf.mjs documents/Resume_Artjom_Naninjan_EN.html documents/Resume_Artjom_Naninjan_EN.pdf
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const htmlArg = process.argv[2];
const pdfArg = process.argv[3];
const htmlPath = htmlArg
  ? path.resolve(repoRoot, htmlArg)
  : path.join(repoRoot, 'documents', 'Lebenslauf_Artjom_Naninjan.html');
const pdfPath = pdfArg
  ? path.resolve(repoRoot, pdfArg)
  : path.join(repoRoot, 'documents', 'Lebenslauf_Artjom_Naninjan.pdf');

if (!fs.existsSync(htmlPath)) {
  console.error('HTML file not found:', htmlPath);
  process.exit(1);
}

const script = `
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.emulateMediaType('print');
  await page.goto('file:///' + ${JSON.stringify(htmlPath.replace(/\\/g, '/'))}, {
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

const tmpScript = path.join(repoRoot, 'documents', '.generate-resume-pdf-tmp.cjs');
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
process.exit(run.status ?? 0);
