/**
 * Export intro slides as LinkedIn document-carousel PNGs (1080×1350).
 *
 * Usage:
 *   1. Start the app: `npm run dev` (default http://localhost:3456) or set INTRO_EXPORT_BASE
 *   2. npm run export:intro
 *   3. Optional: INTRO_EXPORT_LANG=en,de INTRO_EXPORT_BASE=http://localhost:3000 npm run export:intro
 *
 * Output: exports/intro-carousel/{lang}/01.png … 07.png
 *
 * Browser: uses Playwright Chromium if installed; otherwise system Edge/Chrome via channel.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const WIDTH = 1080;
const HEIGHT = 1350;
/** Matches INTRO_CAROUSEL_SLIDES length in lib/introCopy.ts */
const SLIDE_COUNT = 7;

const base = (process.env.INTRO_EXPORT_BASE || 'http://localhost:3456').replace(
  /\/$/,
  '',
);
const langs = (process.env.INTRO_EXPORT_LANG || 'en')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

async function launchBrowser() {
  const channel = process.env.INTRO_EXPORT_CHANNEL; // chrome | msedge | chromium
  if (channel) {
    return chromium.launch({ headless: true, channel });
  }
  try {
    return await chromium.launch({ headless: true });
  } catch {
    // Bundled Chromium missing — fall back to Edge, then Chrome.
    for (const ch of ['msedge', 'chrome']) {
      try {
        console.log(`Bundled Chromium unavailable; trying channel=${ch}`);
        return await chromium.launch({ headless: true, channel: ch });
      } catch {
        /* try next */
      }
    }
    throw new Error(
      'Could not launch a browser. Run `npx playwright install chromium` or set INTRO_EXPORT_CHANNEL=msedge',
    );
  }
}

async function waitForReady(page) {
  await page.waitForSelector('[data-intro-stage]', { timeout: 60000 });
  await page.waitForSelector('[data-intro-shell]', { timeout: 60000 });
  await page.waitForTimeout(600);
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const imgs = [...document.images];
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            }),
      ),
    );
  });
  await page.waitForTimeout(200);
}

async function exportLang(browser, lang) {
  const outDir = path.join(process.cwd(), 'exports', 'intro-carousel', lang);
  await mkdir(outDir, { recursive: true });

  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });

  await page.addInitScript(() => {
    try {
      localStorage.setItem('artjom-theme', 'dark');
    } catch {
      /* ignore */
    }
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  });

  for (let i = 1; i <= SLIDE_COUNT; i++) {
    const qs = new URLSearchParams({
      export: '1',
      slide: String(i),
      ...(lang !== 'en' ? { lang } : {}),
    });
    const url = `${base}/intro?${qs.toString()}`;
    console.log(`Capturing ${lang} slide ${i}/${SLIDE_COUNT} → ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.addStyleTag({
      content: `
        html, body, [data-export="1"] {
          background: #0c0b0a !important;
          color: rgba(255,255,255,0.96) !important;
        }
        .text-mk-text, .intro-ink { color: rgba(255,255,255,0.96) !important; }
        .text-mk-text-secondary, .intro-ink-secondary { color: rgba(255,255,255,0.78) !important; }
        .text-mk-text-muted, .intro-ink-muted { color: rgba(255,255,255,0.55) !important; }
      `,
    });
    await waitForReady(page);

    const buf = await page.screenshot({
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });
    const file = path.join(outDir, `${String(i).padStart(2, '0')}.png`);
    await writeFile(file, buf);
    console.log(`  wrote ${file} (${buf.length} bytes)`);
  }

  await page.close();
}

async function main() {
  console.log(`Base: ${base}`);
  console.log(`Langs: ${langs.join(', ')}`);
  console.log(`Size: ${WIDTH}×${HEIGHT}`);

  const browser = await launchBrowser();
  try {
    for (const lang of langs) {
      await exportLang(browser, lang);
    }
  } finally {
    await browser.close();
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
