/**
 * Merge two PDFs (e.g. cover letter + portfolio).
 *
 * Usage:
 *   node scripts/merge-pdfs.mjs <first.pdf> <second.pdf> [output.pdf]
 *
 * Example:
 *   node scripts/merge-pdfs.mjs documents/Anschreiben_STRATO_Artjom_Naninjan.pdf documents/Portfolio_Offline_Artjom_Naninjan_Original.pdf documents/Bewerbung_STRATO_mit_Portfolio_Artjom_Naninjan.pdf
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const firstArg = process.argv[2];
const secondArg = process.argv[3];
const outputArg = process.argv[4];

if (!firstArg || !secondArg) {
  console.error(
    'Usage: node scripts/merge-pdfs.mjs <first.pdf> <second.pdf> [output.pdf]',
  );
  process.exit(1);
}

const firstPath = path.resolve(repoRoot, firstArg);
const secondPath = path.resolve(repoRoot, secondArg);
const outputPath = outputArg
  ? path.resolve(repoRoot, outputArg)
  : path.join(
      repoRoot,
      'documents',
      `Merged_${path.basename(firstPath, '.pdf')}_${path.basename(secondPath, '.pdf')}.pdf`,
    );

for (const p of [firstPath, secondPath]) {
  if (!fs.existsSync(p)) {
    console.error('File not found:', p);
    process.exit(1);
  }
}

const script = `
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

(async () => {
  const out = await PDFDocument.create();
  for (const file of [${JSON.stringify(firstPath)}, ${JSON.stringify(secondPath)}]) {
    const bytes = fs.readFileSync(file);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => out.addPage(page));
  }
  const merged = await out.save();
  fs.writeFileSync(${JSON.stringify(outputPath)}, merged);
  const mb = merged.length / (1024 * 1024);
  console.log('Merged PDF created:', ${JSON.stringify(outputPath)});
  console.log('Pages:', out.getPageCount(), '| Size:', mb.toFixed(2), 'MB');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
`;

const tmpScript = path.join(repoRoot, 'documents', '.merge-pdfs-tmp.cjs');
fs.writeFileSync(tmpScript, script);

const install = spawnSync('npm', ['install', '--no-save', 'pdf-lib@1.17.1'], {
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
