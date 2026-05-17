#!/usr/bin/env node
/**
 * Liste Dateien unter public/, die sehr wahrscheinlich NICHT mehr gebraucht werden.
 *
 * Quellen für "genutzt":
 * - Alle Strings in public/posts.json, die mit "/" beginnen (gleiche Site-URLs wie im Browser).
 * - String-Literale in app/, components/, lib/ wie '/about/foo.webp'.
 *
 * Bewusst NICHT gemeldet:
 * - Gesamtes public/boards/** (läuft über fetch(/boards/:slug)).
 * - Projektarbeiten unter public/projects/<slug>/ wenn posts.json dort ein index.html (htmlPath) einbindet
 *   (das iframe kann viele lokale Assets laden, ohne in posts.json zu stehen).
 * - public/tools/ryuk-pp/** (eingebettete WASM/Web-App, viele lokale Zugriffe).
 * - public/posts.json (Konfigurationsquelle für die Site).
 *
 * Limits: keine Garantie; embedded HTML können dynamische Pfadketten haben.
 * Vor dem endgültigen Löschen: Liste prüfen und `git grep <dateiname>` o. Ä.
 *
 * Aufruf: npm run audit:public
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const SRC_DIRS = ['app', 'components', 'lib'];

function normalizeAbs(absPath) {
  return path.normalize(path.resolve(absPath));
}

function walkFilesRecursive(dir, out = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFilesRecursive(p, out);
    else out.push(p);
  }
  return out;
}

function stripOnlyPath(q) {
  const s = String(q).trim();
  return s.split(/[?#]/)[0];
}

/** URL beginnend mit "/" → Absolut unter public/. */
function publicUrlToAbsolute(urlPathNoQuery) {
  const raw = decodeURIComponent(stripOnlyPath(urlPathNoQuery).replace(/^\/+/, ''));
  const withSep = raw.replace(/\//g, path.sep);
  return normalizeAbs(path.join(PUBLIC, withSep));
}

function collectStringsStartingWithSlash(value, bucket) {
  if (typeof value === 'string') {
    const s = value.trim();
    if (s.startsWith('/') && !s.startsWith('//') && !s.includes('*') && !/\$\{/.test(s))
      bucket.add(stripOnlyPath(s));
    return;
  }
  if (Array.isArray(value)) return value.forEach((x) => collectStringsStartingWithSlash(x, bucket));
  if (value && typeof value === 'object')
    Object.values(value).forEach((x) => collectStringsStartingWithSlash(x, bucket));
}

/** Grob Kommentare entfernen — sonst erwischt Regex z.B. `/projects/.../index.html` in Docblocks. */
function stripApproxComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|\s)\/\/[^\n\r]*/gm, '$1 ');
}

/** Literale wie '/tools/foo.png' oder '/about/carousel/foo.jpg'. */
function scanSourceCodeForPublicPaths(bucket) {
  const files = [];
  for (const rel of SRC_DIRS) {
    const dir = path.join(ROOT, rel);
    if (fs.existsSync(dir)) walkFilesRecursive(dir, files);
  }

  const extOk = /\.(tsx?|jsx?|css|html)$/i;
  /** Ab `/` bis Dateiextension (auch mehrteilige Pfade wie `/about/x/y.webp`). */
  const re =
    /['"`]((?:\/|%2F|%2f)[^'"`]{1,500}?\.(?:webp|png|jpg|jpeg|gif|svg|ico|mov|webm|mp4|glb|fbx|html|js|mjs|cjs|wasm|json|css|woff2?|pdf))(?:\?[^'"`]*)?['"`]/gi;
  /** index.html ohne Query. */
  const reLooseHtml = /['"`]((?:\/|%2F|%2f)[a-zA-Z0-9_\-%.]+(?:\/[\w\-%.]*)*\/index\.html)(?:\?[^'"`]*)?['"`]/gi;

  function pushClean(url) {
    const u = decodeURIComponent(String(url)).replace(/^%2F/i, '/').replace(/^%2f/i, '/');
    if (!u.startsWith('/') || u.startsWith('//')) return;
    if (/\$\{|\*/.test(u)) return;
    bucket.add(stripOnlyPath(u));
  }

  for (const f of files) {
    if (!extOk.test(f)) continue;
    const raw = fs.readFileSync(f, 'utf8');
    const text = stripApproxComments(raw);
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(text))) pushClean(m[1]);
    reLooseHtml.lastIndex = 0;
    while ((m = reLooseHtml.exec(text))) pushClean(m[1]);
  }
}

/** Geschützte Verzeichnis-Pfade (ohne trailing separator), keine einzelnen Dateien. */
function buildProtectedDirectories(postsData) {
  const dirs = new Set();

  const boards = normalizeAbs(path.join(PUBLIC, 'boards'));
  if (fs.existsSync(boards) && fs.statSync(boards).isDirectory()) dirs.add(boards);

  const ryuk = normalizeAbs(path.join(PUBLIC, 'tools', 'ryuk-pp'));
  if (fs.existsSync(ryuk) && fs.statSync(ryuk).isDirectory()) dirs.add(ryuk);

  for (const p of postsData.posts ?? []) {
    const hp = typeof p.htmlPath === 'string' ? p.htmlPath.trim() : '';
    if (!hp.startsWith('/') || hp.startsWith('//')) continue;
    const clean = stripOnlyPath(hp);
    const abs = publicUrlToAbsolute(clean);
    const dir =
      fs.existsSync(abs) && fs.statSync(abs).isFile() ? path.dirname(abs) : path.dirname(abs);
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) dirs.add(normalizeAbs(dir));
    } catch {
      /* ignore */
    }
  }

  return [...dirs];
}

/** Ist `fileAbs` gleich einem geschützten Ordner oder liegt darunter? */
function isUnderProtectedTree(fileAbs, protectedDirs) {
  const child = normalizeAbs(fileAbs);
  for (const d of protectedDirs) {
    const rel = path.relative(d, child);
    if (!rel.startsWith('..') && !path.isAbsolute(rel)) return true;
  }
  return false;
}

function sortRel(a, b) {
  return String(a).localeCompare(String(b), 'de');
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort(sortRel);
}

function main() {
  const postsPath = path.join(PUBLIC, 'posts.json');
  const postsRaw = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

  const refUrls = new Set();
  collectStringsStartingWithSlash(postsRaw, refUrls);
  scanSourceCodeForPublicPaths(refUrls);

  const explicitUsed = new Set();
  const refNonFile = [];

  for (const u of refUrls) {
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    try {
      const abs = publicUrlToAbsolute(u);
      if (!fs.existsSync(abs)) {
        refNonFile.push(u);
        continue;
      }
      const st = fs.statSync(abs);
      if (st.isFile()) explicitUsed.add(normalizeAbs(abs));
      else if (st.isDirectory()) refNonFile.push(`${u}  (Pfad zeigt auf Verzeichnis, nicht auf Datei)`);
    } catch {
      refNonFile.push(u);
    }
  }

  const protectedDirs = buildProtectedDirectories(postsRaw);
  explicitUsed.add(normalizeAbs(postsPath));

  const publicFiles = walkFilesRecursive(PUBLIC);

  /** @type {string[]} */
  const orphans = [];

  for (const file of publicFiles) {
    const abs = normalizeAbs(file);
    if (explicitUsed.has(abs)) continue;
    if (isUnderProtectedTree(abs, protectedDirs)) continue;
    orphans.push('/' + path.relative(PUBLIC, file).replace(/\\/g, '/'));
  }

  const sortedOrphans = uniqueSorted(orphans);
  const sortedMissing = uniqueSorted(refNonFile);

  console.log('');
  console.log('=== PUBLIC — vermutlich unbenutzte Dateien (Tot-Kandidaten) ===');
  console.log('');
  console.log(
    `Eindeutige URL-Strings aus posts.json + Code: ${refUrls.size} | aufgelöste Dateien: ${explicitUsed.size}`,
  );
  console.log(`Geschützte Ordner (nicht gegen „Tot“ gewertet): ${protectedDirs.length}`);
  protectedDirs.sort(sortRel).forEach((d) => {
    console.log(`  • ${path.relative(ROOT, d).replace(/\\/g, '/')}/`);
  });
  console.log('');

  if (sortedMissing.length > 0) {
    console.log('Referenziert, aber keine passende Datei unter public/:');
    sortedMissing.forEach((u) => console.log(`  ⚠ ${u}`));
    console.log('');
  }

  if (sortedOrphans.length === 0) {
    console.log('Keine orphan-Kandidaten (unter diesen sehr konservativen Regeln).');
  } else {
    console.log(
      `${sortedOrphans.length} Datei(en) ohne Treffer auf expliziten Pfad-Schutzliste — löschen erst nach Spot-Check:`,
    );
    sortedOrphans.forEach((rel) => console.log(`  ${rel}`));
  }

  console.log('');
  console.log(
    'Hinweis: Für Projekte mit htmlPath gilt der ganze Projektordner als „genutzt“ (iframe). ',
  );
  console.log('Videos/Large assets außerhalb dieses Patterns tauchen hier ggf. als Kandidaten auf.');
  console.log('');
}

main();
