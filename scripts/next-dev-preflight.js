/**
 * Avoids flaky Next.js 14 dev on Windows: stale manifests, ENOENT/cache issues,
 * and `Cannot find module './NNN.js'` when `./.next-dev/server` drifts after builds,
 * merges, crashes, or hot-reload interruptions. Symptom: white page / unstyled shell,
 * or HTTP 500 for `/_next/static/css/app/layout.css`.
 *
 * Default: clear `.next-dev` before every `npm run dev` (predev lifecycle).
 * Opt out (faster restarts): set SKIP_NEXT_DEV_CLEAN=1
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const nextDevDir = path.join(root, '.next-dev');

function rmNext() {
  fs.rmSync(nextDevDir, { recursive: true, force: true });
}

try {
  if (process.env.SKIP_NEXT_DEV_CLEAN === '1') process.exit(0);
  if (!fs.existsSync(nextDevDir)) process.exit(0);

  rmNext();
  console.warn('[dev] Cleared .next-dev for a clean dev build (SKIP_NEXT_DEV_CLEAN=1 skips this).');
} catch (e) {
  console.warn('[dev] Could not prepare .next-dev:', e && e.message);
}
