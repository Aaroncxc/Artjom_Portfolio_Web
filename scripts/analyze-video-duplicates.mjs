#!/usr/bin/env node
/**
 * One-off helper: sizes for Lexsolar webms, assets videos summary,
 * duplicate detection via size + quick hash (first 5MB + last 64KB).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', '.next-dev', '.next']);

function walk(dir, acc = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, acc);
    } else if (/\.(mp4|webm|mov|m4v)$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

function quickFingerprint(file) {
  const size = fs.statSync(file).size;
  const headLen = Math.min(5 * 1024 * 1024, size);
  const head = Buffer.allocUnsafe(headLen);
  const fd = fs.openSync(file, 'r');
  fs.readSync(fd, head, 0, headLen, 0);
  const tailLen = Math.min(65536, size);
  const tailOff = Math.max(0, size - tailLen);
  const tail = Buffer.allocUnsafe(tailLen);
  fs.readSync(fd, tail, 0, tailLen, tailOff);
  fs.closeSync(fd);
  return crypto
    .createHash('sha256')
    .update(String(size))
    .update(head)
    .update(tail)
    .digest('hex');
}

function rel(p) {
  return path.relative(root, p).split(path.sep).join('/');
}

function publicUrl(file) {
  const pub = path.join(root, 'public');
  if (!file.startsWith(pub)) return null;
  return '/' + path.relative(pub, file).split(path.sep).join('/');
}

const postsPath = path.join(root, 'public/posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

/** Collect string paths ending in video extensions under `/`. */
const referenced = new Set();
function scan(o) {
  if (typeof o === 'string') {
    const m = o.match(/^(\/[^"]+\.(?:mp4|webm|mov|m4v))(?:\?|#|$)/i);
    if (m) referenced.add(m[1]);
    return;
  }
  if (Array.isArray(o)) return o.forEach(scan);
  if (o && typeof o === 'object') Object.values(o).forEach(scan);
}
scan(posts);

const allVideos = walk(root);

console.log('=== Lexsolar (public/projects/lexsolar-digital-learning-kit) ===');
for (const f of allVideos.filter((v) => v.includes('lexsolar-digital-learning-kit'))) {
  const mb = (fs.statSync(f).size / 1024 / 1024).toFixed(2);
  console.log(`${rel(f)} — ${mb} MB`);
}

console.log('\n=== Known duplicates (same quick-hash & same size; assets vs public) ===');
const groups = new Map();
for (const f of allVideos) {
  const size = fs.statSync(f).size;
  const fp = quickFingerprint(f);
  const key = `${size}:${fp}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(f);
}
for (const [, files] of groups) {
  if (files.length < 2) continue;
  const hasAssets = files.some((p) => rel(p).startsWith('assets/'));
  const hasPublic = files.some((p) => rel(p).startsWith('public/'));
  if (!hasAssets || !hasPublic) continue;
  console.log(`--- duplicate group (${files.length} files, ${(fs.statSync(files[0]).size / 1024 / 1024).toFixed(2)} MB each) ---`);
  for (const f of files.sort((a, b) => rel(a).localeCompare(rel(b)))) {
    const url = publicUrl(f);
    const inPosts = url && referenced.has(url);
    console.log(`  ${rel(f)}${url ? ` → ${url}${inPosts ? ' [posts.json]' : ''}` : ''}`);
  }
}

console.log('\n=== Assets-only videos (no identical twin under public/) ===');
for (const f of allVideos) {
  const r = rel(f);
  if (!r.startsWith('assets/')) continue;
  const size = fs.statSync(f).size;
  const fp = quickFingerprint(f);
  const key = `${size}:${fp}`;
  const twins = groups.get(key) ?? [];
  const twinPublic = twins.filter((t) => rel(t).startsWith('public/'));
  if (twinPublic.length > 0) continue;
  console.log(`${r} — ${(size / 1024 / 1024).toFixed(2)} MB`);
}
