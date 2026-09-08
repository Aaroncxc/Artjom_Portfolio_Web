/**
 * Quick check: intro slides fit in a laptop viewport without document scroll.
 * Uses system Edge/Chrome via Playwright channel.
 *
 *   INTRO_EXPORT_BASE=http://localhost:3456 node scripts/verify-intro-viewport.mjs
 */
import { chromium } from 'playwright';

const base = (process.env.INTRO_EXPORT_BASE || 'http://localhost:3456').replace(
  /\/$/,
  '',
);
const VIEWPORTS = [
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1440x900', width: 1440, height: 900 },
];
const SLIDES = [2, 3, 5]; // Path, Scale, Built

async function launch() {
  for (const ch of ['msedge', 'chrome']) {
    try {
      return await chromium.launch({ headless: true, channel: ch });
    } catch {
      /* next */
    }
  }
  return chromium.launch({ headless: true });
}

async function main() {
  const browser = await launch();
  let failed = 0;
  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });
      for (const slide of SLIDES) {
        const url = `${base}/intro?slide=${slide}`;
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForSelector('[data-intro-shell]', { timeout: 30000 });
        await page.waitForTimeout(400);

        const metrics = await page.evaluate(() => {
          const root = document.documentElement;
          const body = document.body;
          const stage = document.querySelector('[data-intro-stage]');
          const shell = document.querySelector('[data-intro-shell]');
          return {
            docScrollH: Math.max(root.scrollHeight, body.scrollHeight),
            clientH: root.clientHeight,
            stageScrollH: stage?.scrollHeight ?? 0,
            stageClientH: stage?.clientHeight ?? 0,
            shellScrollH: shell?.scrollHeight ?? 0,
            shellClientH: shell?.clientHeight ?? 0,
            bodyOverflowY: getComputedStyle(body).overflowY,
            rootOverflowY: getComputedStyle(root).overflowY,
          };
        });

        // Allow 2px rounding; flag if document or shell content overflows viewport.
        const docOverflow = metrics.docScrollH > metrics.clientH + 2;
        const shellOverflow =
          metrics.shellScrollH > metrics.shellClientH + 4;
        const ok = !docOverflow && !shellOverflow;
        const label = `${vp.name} slide ${slide}`;
        if (ok) {
          console.log(`OK  ${label}`);
        } else {
          failed += 1;
          console.log(`FAIL ${label}`, metrics);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (failed) {
    console.error(`${failed} viewport check(s) failed`);
    process.exit(1);
  }
  console.log('All viewport checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
