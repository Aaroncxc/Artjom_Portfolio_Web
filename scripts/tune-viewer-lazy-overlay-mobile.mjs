#!/usr/bin/env node
/**
 * Patch the lazy-load overlay CSS in each project viewer (the-house,
 * pult-vacuum, rovolto-lost-files, mask-sculpture) so it lays out cleanly
 * inside the project modal's iframe at narrow widths (≤ 480px viewer height).
 *
 * Drops the poster on very short viewer panes, tightens padding/gaps, and
 * scales the button + copy down so everything fits without overflow.
 *
 * Idempotent: looks for a marker comment before patching; re-runs are no-ops.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const TARGETS = [
  'public/projects/the-house/index.html',
  'public/projects/pult-vacuum/index.html',
  'public/projects/rovolto-lost-files/index.html',
  'public/projects/mask-sculpture/index.html',
];

const MARKER = '/* lazy-overlay mobile tune v1 */';

const MOBILE_BLOCK = `
    ${MARKER}
    /* Narrow viewer panes (modal on phones) — shrink poster + copy so the
       overlay fits in ~320x180 without overflow. */
    @media (max-height: 360px), (max-width: 480px) {
      #lazy-load-overlay { gap: 10px; padding: 12px; }
      #lazy-load-overlay .poster-wrap { width: min(70%, 220px); border-radius: 12px; }
      #lazy-load-overlay .lazy-copy { font-size: 12px; line-height: 1.35; max-width: 280px; }
      #lazy-load-overlay #lazy-load-btn { padding: 10px 18px; font-size: 13px; }
    }
    /* Extreme case (e.g. landscape phone modal): no room for a poster — hide it. */
    @media (max-height: 220px) {
      #lazy-load-overlay .poster-wrap { display: none; }
      #lazy-load-overlay { gap: 8px; padding: 10px; }
    }
`;

function patchFile(rel) {
  const full = path.join(repoRoot, rel);
  if (!fs.existsSync(full)) {
    console.warn(`[skip] ${rel} not found`);
    return;
  }
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes(MARKER)) {
    console.log(`[ok]   ${rel} already patched`);
    return;
  }
  // Inject right before the closing </style> in the head so the new rules
  // override the base overlay styles.
  const styleClose = html.indexOf('</style>');
  if (styleClose === -1) {
    console.warn(`[skip] ${rel} has no </style> block`);
    return;
  }
  const before = html.slice(0, styleClose);
  const after = html.slice(styleClose);
  fs.writeFileSync(full, before + MOBILE_BLOCK + '\n  ' + after, 'utf8');
  console.log(`[patched] ${rel}`);
}

for (const t of TARGETS) patchFile(t);
