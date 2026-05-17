/**
 * Adds click-to-load 3D overlay to project index.html viewers (same UX as the-house).
 * Usage: node scripts/apply-viewer-lazy-load.js [slug ...]
 */
const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '../public/projects');

const POSTERS = {
  'the-house': './The_House_Thumbnail.png',
  'pult-vacuum': './pult-praesentation-5.webp',
  'rovolto-lost-files': './Thumbnail.png',
  'mask-sculpture': './look-mask-4.webp',
};

const CSS_BLOCK = `
    #lazy-load-overlay {
      position: absolute;
      inset: 0;
      z-index: 30;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(232, 236, 241, 0.98) 100%);
      backdrop-filter: blur(8px);
      text-align: center;
    }
    #lazy-load-overlay.hidden {
      display: none;
    }
    #lazy-load-overlay .poster-wrap {
      width: min(92vw, 520px);
      aspect-ratio: 16 / 10;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(28, 28, 28, 0.12);
      border: 1px solid rgba(28, 28, 28, 0.08);
    }
    #lazy-load-overlay img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    #lazy-load-overlay .lazy-copy {
      max-width: 420px;
      color: rgba(28, 28, 28, 0.65);
      font-size: 14px;
      line-height: 1.5;
    }
    #lazy-load-overlay #lazy-load-btn {
      pointer-events: auto;
      margin-top: 4px;
      padding: 14px 28px;
      border-radius: 999px;
      border: none;
      background: #14B8A6;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(20, 184, 166, 0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    #lazy-load-overlay #lazy-load-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(20, 184, 166, 0.45);
    }
`;

const WIRE_LAZY_FN = `
    function wireLazyModelLoad() {
      const lazyOverlay = document.getElementById('lazy-load-overlay');
      const lazyBtn = document.getElementById('lazy-load-btn');
      if (!lazyOverlay || !lazyBtn) return;
      lazyBtn.addEventListener('click', () => {
        lazyOverlay.classList.add('hidden');
        loadingEl.classList.remove('hidden');
        const result = loadModel();
        if (result && typeof result.then === 'function') {
          result.catch(() => {
            loadingEl.classList.add('hidden');
            lazyOverlay.classList.remove('hidden');
          });
        }
      });
    }
`;

function buildOverlay(poster) {
  return [
    '    <div id="lazy-load-overlay">',
    '      <motion.div class="poster-wrap">',
    `        <img src="${poster}" alt="" width="960" height="600" decoding="async" fetchpriority="high" />`,
    '      </div>',
    '      <p class="lazy-copy">Das interaktive 3D-Modell lädt erst beim Tippen — weniger Daten beim ersten Laden.</p>',
    '      <button type="button" id="lazy-load-btn">3D-Ansicht laden</button>',
    '    </div>',
  ]
    .join('\r\n')
    .replace('<motion.div class="poster-wrap">', '<div class="poster-wrap">');
}

function patchIndex(slug) {
  const indexPath = path.join(PROJECTS_DIR, slug, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.warn('Skip (no index.html):', slug);
    return false;
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('id="lazy-load-overlay"')) {
    console.log('Already patched:', slug);
    return false;
  }

  const poster = POSTERS[slug] || './Thumbnail.png';

  if (!html.includes('#lazy-load-overlay')) {
    if (html.includes('#canvas-container canvas')) {
      html = html.replace(/#canvas-container canvas\s*\{[^}]+\}/, (m) => `${m}${CSS_BLOCK}`);
    } else {
      html = html.replace(
        /(#canvas-container\s*\{[^}]+\})/,
        `$1\n    \n    #canvas-container canvas {\n      display: block;\n    }${CSS_BLOCK}`,
      );
    }
  }

  const canvasLoading =
    /(<div id="canvas-container"><\/div>)\s*\r?\n\s*(<div class="loading" id="loading">)/;
  if (!canvasLoading.test(html)) {
    console.warn('Could not find canvas/loading block:', slug);
    return false;
  }

  html = html.replace(
    canvasLoading,
    `$1\r\n\r\n${buildOverlay(poster)}\r\n\r\n    <div class="loading hidden" id="loading">`,
  );

  if (!html.includes('function wireLazyModelLoad')) {
    html = html.replace(/(\s*)(function init\(\))/, `${WIRE_LAZY_FN}\r\n$1$2`);
  }

  let wired = html.replace(
    /(\s*)loadModel\(\);\s*\r?\n(\s*)(window\.addEventListener\('resize', onResize\);)/,
    `$1wireLazyModelLoad();\r\n$2$3`,
  );
  if (wired === html) {
    wired = html.replace(
      /(\s*\/\/ Load Model\s*\r?\n\s*)loadModel\(\);\s*\r?\n(\s*\/\/ Handle resize\s*\r?\n\s*window\.addEventListener\('resize', onResize\);)/,
      `$1wireLazyModelLoad();\r\n$2`,
    );
  }
  if (wired === html) {
    console.warn('Could not replace loadModel() in init:', slug);
    return false;
  }

  fs.writeFileSync(indexPath, wired);
  console.log('Patched lazy load:', slug);
  return true;
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(POSTERS);
let n = 0;
for (const slug of slugs) {
  if (patchIndex(slug)) n++;
}
console.log(`Done (${n} patched).`);
