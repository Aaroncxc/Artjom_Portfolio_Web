// text-pointcloud-module.js
// Multi-layer preset: optional preset.layers[]; legacy preset.text-only still works.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

const DEFAULTS = {
  text: 'Artjom',
  fontSize: 400,
  lineHeight: 1,
  letterSpacing: -6,
  weight: 700,
  italic: false,
  spacing: 4,
  pointSize: 1.2,
  threshold: 30,
  color: '#E8EEF7',
  bg: 'transparent',
  centerMode: 'center',
  radius: 295,
  strength: 2.2,
  drag: 1.6,
  noise: 0.56,
  returnForce: 0.01,
  damping: 0.1,
  pressOnly: false,
  gravityStrength: 0.5,
  gravityOnClick: true,
  showSolidWhenIdle: true,
  transitionSpeed: 0.08,
  solidRevealDelayMs: 420,
  burstStrength: 8,
  holdOpen: false,
  wanderStrength: 0,
  explosionMotionScale: 0.45,
  interactFullCanvas: false,
};

function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function unionBounds(a, b) {
  if (!a) return b;
  if (!b) return a;
  const x1 = Math.min(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const x2 = Math.max(a.x + a.width, b.x + b.width);
  const y2 = Math.max(a.y + a.height, b.y + b.height);
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
    padding: Math.max(a.padding || 0, b.padding || 0),
  };
}

class TextPointcloud extends HTMLElement {
  static get observedAttributes() {
    return [
      'preset',
      'text',
      'preset-src',
      'morph-x',
      'morph-y',
      'hold-open',
      'return-force',
      'wander-strength',
      'point-damping',
      'show-solid-when-idle',
      'explosion-motion-scale',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block; position:relative;}
        canvas{position:absolute; inset:0; width:100%; height:100%; display:block;}
      </style>
      <canvas></canvas>
    `;
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.off = document.createElement('canvas');
    this.offCtx = this.off.getContext('2d', { willReadFrequently: true });

    this.state = {
      W: 0,
      H: 0,
      dpr: 1,
      points: [],
      lastKey: '',
      mouse: {
        x: 0,
        y: 0,
        px: 0,
        py: 0,
        vx: 0,
        vy: 0,
        down: false,
        inside: false,
        overParticleFill: false,
      },
      pointsOpacity: 0,
      touch: { startTime: 0, startX: 0, startY: 0, moved: false, inTextArea: false },
      textBounds: null,
      textLayout: null,
      solidLayouts: [],
      reducesMotion: false,
    };

    this.preset = { ...DEFAULTS };

    this._ro = new ResizeObserver(() => this.resize());
    this._raf = 0;
    this._last = performance.now();
    this._reducedMq =
      typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-reduced-motion: reduce)')
        : null;
  }

  _syncReducedMotion() {
    this.state.reducesMotion = !!(
      this._reducedMq &&
      typeof this._reducedMq.matches === 'boolean' &&
      this._reducedMq.matches
    );
  }

  getNormalizedLayoutsKey() {
    const p = this.preset;
    const nl = this.getNormalizedLayers().map((L) => ({
      t: L.text,
      isP: L.isPrimary,
      rx: L.relX,
      ry: L.relY,
      fs: L.fontScale,
      ls: L.letterSpacing,
      lh: L.lineHeight,
      sm: L.spacingMul,
      op: L.opacity,
      da: L.driftAmp,
      df: L.driftFreq,
      mg: L.morphGain,
      pm: L.pointSizeMul,
      cm: L.centerMode,
    }));
    return {
      layers: nl,
      fallbackText: !p.layers || !p.layers.length ? p.text : null,
      fontSize: p.fontSize,
      letterSpacing: p.letterSpacing,
      lineHeight: p.lineHeight,
      weight: p.weight,
      centerMode: p.centerMode,
      spacing: p.spacing,
      italic: !!p.italic,
      interactFullCanvas: !!p.interactFullCanvas,
      rm: !!this.state.reducesMotion,
    };
  }

  getNormalizedLayers() {
    const p = this.preset;
    const dpr = this.state.dpr || 1;
    const basePad = Math.round((Number(p.fontSize) || 100) * dpr * 0.15);

    if (!Array.isArray(p.layers) || p.layers.length === 0) {
      return [
        {
          text: String(p.text || '').replace(/\r\n/g, '\n'),
          isPrimary: true,
          relX: 0.5,
          relY: 0.5,
          fontScale: 1,
          letterSpacing: Number(p.letterSpacing) || 0,
          lineHeight: Number(p.lineHeight) || 1,
          weight: Number(p.weight) || 700,
          italic: !!p.italic,
          spacingMul: 1,
          opacity: 1,
          driftAmp: 0,
          driftFreq: 0.00035,
          morphGain: 1,
          pointSizeMul: 1,
          centerMode: p.centerMode || 'center',
          boundsPadding: basePad,
        },
      ];
    }

    return p.layers.map((L, i) => {
      const isPrimary = i === 0;
      const lr =
        typeof L.relativePosition === 'object' && L.relativePosition !== null
          ? L.relativePosition
          : null;
      const relXRaw = lr != null ? lr.x : L.relX;
      const relYRaw = lr != null ? lr.y : L.relY;
      let relX = typeof relXRaw === 'number' ? relXRaw : 0.5;
      let relY = typeof relYRaw === 'number' ? relYRaw : 0.5;
      relX = clamp(relX, 0, 1);
      relY = clamp(relY, 0, 1);

      const op = Number(L.opacity);
      const opacity = Number.isFinite(op) ? clamp(op, 0, 1) : isPrimary ? 1 : 0.42;
      const fontScale = Number(L.fontScale);
      const driftAmp = Number(L.driftAmp);
      const driftFreq = Number(L.driftFreq);
      const morphGain = Number(L.morphGain);
      const spacingMul = Number(L.spacingMul);
      const pointSizeMul = Number(L.pointSizeMul);

      return {
        text: String(L.text || '').replace(/\r\n/g, '\n'),
        isPrimary,
        relX,
        relY,
        fontScale:
          Number.isFinite(fontScale) && fontScale > 0 ? fontScale : isPrimary ? 1 : 0.125,
        letterSpacing:
          L.letterSpacing !== undefined ? Number(L.letterSpacing) : Number(p.letterSpacing) || 0,
        lineHeight: L.lineHeight !== undefined ? Number(L.lineHeight) : Number(p.lineHeight) || 1,
        weight: L.weight !== undefined ? Number(L.weight) : Number(p.weight) || 700,
        italic: L.italic !== undefined ? !!L.italic : !!p.italic,
        spacingMul:
          Number.isFinite(spacingMul) && spacingMul > 0 ? spacingMul : isPrimary ? 1 : 2.35,
        opacity,
        driftAmp:
          Number.isFinite(driftAmp) && driftAmp >= 0 ? driftAmp : isPrimary ? 0 : 16,
        driftFreq: Number.isFinite(driftFreq) && driftFreq > 0 ? driftFreq : 0.00038,
        morphGain: Number.isFinite(morphGain) && morphGain > 0 ? morphGain : isPrimary ? 1 : 0.88,
        pointSizeMul:
          Number.isFinite(pointSizeMul) && pointSizeMul > 0
            ? pointSizeMul
            : isPrimary
              ? 1
              : 0.7,
        centerMode: typeof L.centerMode === 'string' ? L.centerMode : p.centerMode || 'center',
        boundsPadding: Math.round(basePad * (isPrimary ? 1 : 0.55)),
      };
    });
  }

  makeFontCSSForLayer(layer) {
    const p = this.preset;
    const italic = layer.italic ? 'italic ' : '';
    const weight = layer.weight || 700;
    const size = Number(p.fontSize) || 140;
    const scaled = Math.max(8, size * (layer.fontScale || 1));
    return `${italic}${weight} ${Math.round(scaled * this.state.dpr)}px Arial, Helvetica, sans-serif`;
  }

  measureLineWidth(line, font, letterSpacingPx) {
    const ctx = this.offCtx;
    ctx.save();
    ctx.font = font;
    const dls = Number(letterSpacingPx) || 0;
    if (!dls) {
      const mw = ctx.measureText(line).width;
      ctx.restore();
      return mw;
    }
    ctx.letterSpacing = `${dls}px`;
    const mw = ctx.measureText(line).width;
    ctx.restore();
    return mw;
  }

  layoutLayer(layerCfg) {
    const { W, H } = this.state;
    const p = this.preset;
    const lines = layerCfg.text.split('\n');
    if (!lines.length || !lines.some((ln) => ln.length)) return null;

    const font = this.makeFontCSSForLayer(layerCfg);
    const lh = Number(layerCfg.lineHeight) || 1.0;
    // Tight preset letterSpacing is for the main headline; small background layers must not
    // inherit the same px value (it can invert glyph placement on some canvas implementations).
    const lsPx = layerCfg.isPrimary
      ? Number(layerCfg.letterSpacing) *
        this.state.dpr *
        (layerCfg.fontScale != null ? layerCfg.fontScale : 1)
      : 0;

    const linePx =
      Number(p.fontSize) * (layerCfg.fontScale || 1) * lh * this.state.dpr;

    let blockW = 0;
    for (const ln of lines) blockW = Math.max(blockW, this.measureLineWidth(ln, font, lsPx));
    const blockH = lines.length * linePx;

    let x0;
    let y0;
    const margin = 8 * this.state.dpr;

    if (layerCfg.isPrimary) {
      x0 = (W - blockW) * 0.5;
      y0 = 0;
      const mode = layerCfg.centerMode || 'center';
      if (mode === 'center') y0 = (H - blockH) * 0.5;
      else if (mode === 'top') y0 = Math.max(24 * this.state.dpr, H * 0.12);
      else y0 = Math.min(H - blockH - 24 * this.state.dpr, H * 0.78 - blockH);

      x0 = clamp(x0, margin, W - blockW - margin);
      y0 = clamp(y0, margin, H - blockH - margin);
    } else {
      x0 = layerCfg.relX * W - blockW * 0.5;
      y0 = layerCfg.relY * H - blockH * 0.5;
      x0 = clamp(x0, margin, Math.max(margin, W - blockW - margin));
      y0 = clamp(y0, margin, Math.max(margin, H - blockH - margin));
    }

    const textBounds = {
      x: x0,
      y: y0,
      width: blockW,
      height: blockH,
      padding: layerCfg.boundsPadding || 0,
    };

    return {
      cfg: layerCfg,
      x0,
      y0,
      linePx,
      lines,
      font,
      dls: lsPx,
      blockW,
      blockH,
      textBounds,
    };
  }

  drawLayoutWhite(layout) {
    if (!layout) return;
    const ctx = this.offCtx;
    const { x0, y0, linePx, lines, font, dls } = layout;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.font = font;

    for (let i = 0; i < lines.length; i++) {
      const y = y0 + i * linePx;
      const line = lines[i];
      if (!dls) {
        ctx.fillText(line, x0, y);
      } else {
        ctx.save();
        ctx.font = font;
        ctx.letterSpacing = `${dls}px`;
        ctx.fillText(line, x0, y);
        ctx.restore();
      }
    }
  }

  drawSolidText(opacity = 1) {
    const layouts = this.state.solidLayouts;
    if (!layouts || !layouts.length) return;
    const ctx = this.ctx;
    const color = this.preset.color || '#E8EEF7';

    for (const L of layouts) {
      const { x0, y0, linePx, lines, font, dls, cfg } = L;
      const layerSolid = opacity * (cfg.opacity != null ? cfg.opacity : 1);
      if (layerSolid <= 0.001) continue;

      ctx.save();
      ctx.globalAlpha = clamp(layerSolid, 0, 1);
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';
      ctx.font = font;

      const fq = cfg.driftFreq || 0.00038;
      const da = cfg.driftAmp ? Number(cfg.driftAmp) : 0;
      let dx = 0;
      let dy = 0;
      if (!cfg.isPrimary && da > 0) {
        const tms = performance.now();
        const amp = da * this.state.dpr * 0.92 * (this.state.reducesMotion ? 0.4 : 1);
        dx = Math.sin(tms * fq) * amp;
        dy = Math.cos(tms * fq * 0.86 + 1.05) * amp;
      }

      ctx.translate(dx, dy);

      for (let i = 0; i < lines.length; i++) {
        const y = y0 + i * linePx;
        const line = lines[i];
        if (!dls) {
          ctx.fillText(line, x0, y);
        } else {
          ctx.save();
          ctx.letterSpacing = `${dls}px`;
          ctx.fillText(line, x0, y);
          ctx.restore();
        }
      }
      ctx.restore();
    }
  }

  connectedCallback() {
    this._syncReducedMotion();
    this._rmChange = () => {
      this._syncReducedMotion();
      this.rebuild(true);
    };
    this._reducedMq?.addEventListener?.('change', this._rmChange);

    const presetAttr = (this.getAttribute('preset') || '').trim();
    if (presetAttr) {
      if (presetAttr[0] === '{' || presetAttr[0] === '[') {
        const pr = safeParseJSON(presetAttr);
        if (pr) this.setPreset(pr);
      } else {
        this.loadPreset(presetAttr);
      }
    }

    const src = (this.getAttribute('preset-src') || '').trim();
    if (src) this.loadPreset(src);

    const t = this.getAttribute('text');
    if (typeof t === 'string' && t.length) this.preset.text = t;

    this._ro.observe(this);
    this._bindMouse();
    this.resize();
    const el = this;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.resize();
      });
    });
    setTimeout(() => {
      el.resize();
    }, 100);
    this._tick = (now) => this.tick(now);
    this._raf = requestAnimationFrame(this._tick);
  }

  disconnectedCallback() {
    this._ro.disconnect();
    cancelAnimationFrame(this._raf);
    this._unbindMouse();
    this._reducedMq?.removeEventListener?.('change', this._rmChange);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'text') {
      this.preset.text = newValue || '';
      this.rebuild(true);
    }
    if (name === 'preset') {
      const v = (newValue || '').trim();
      if (!v) return;
      if (v[0] === '{' || v[0] === '[') {
        const pr = safeParseJSON(v);
        if (pr) this.setPreset(pr);
      } else {
        this.loadPreset(v);
      }
    }
    if (name === 'preset-src') {
      const v = (newValue || '').trim();
      if (v) this.loadPreset(v);
    }
    if (name === 'morph-x') {
      const v = parseFloat(newValue);
      this.preset.morphX = isNaN(v) ? 0 : clamp(v, 0, 1);
    }
    if (name === 'morph-y') {
      const v = parseFloat(newValue);
      this.preset.morphY = isNaN(v) ? 0 : clamp(v, 0, 1);
    }
    if (name === 'hold-open') {
      const v = (newValue || '').trim().toLowerCase();
      this.preset.holdOpen = v !== '' && v !== '0' && v !== 'false';
    }
    if (name === 'return-force') {
      const v = parseFloat(newValue);
      if (!isNaN(v)) this.preset.returnForce = v;
    }
    if (name === 'wander-strength') {
      const v = parseFloat(newValue);
      this.preset.wanderStrength = isNaN(v) ? 0 : Math.max(0, v);
    }
    if (name === 'point-damping') {
      const v = parseFloat(newValue);
      if (!isNaN(v)) this.preset.damping = v;
    }
    if (name === 'explosion-motion-scale') {
      const v = parseFloat(newValue);
      this.preset.explosionMotionScale = isNaN(v) ? 0.45 : clamp(v, 0.05, 1);
    }
    if (name === 'show-solid-when-idle') {
      const v = (newValue || '').trim().toLowerCase();
      this.preset.showSolidWhenIdle = v !== 'false' && v !== '0';
    }
  }

  async loadPreset(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const pr = await res.json();
      if (pr && typeof pr === 'object') this.setPreset(pr);
    } catch (_) {}
  }

  getPreset() {
    return { ...this.preset };
  }

  setPreset(pr) {
    if (!pr || typeof pr !== 'object') return;
    this.preset = { ...this.preset, ...pr };
    this.rebuild(true);
  }

  _bindMouse() {
    const touchActive = () => this.preset.interactFullCanvas === true;

    this._onMove = (e) => this.updateMouse(e);
    this._onEnter = (e) => {
      this.updateMouse(e);
    };
    this._onLeave = () => {
      this.state.mouse.inside = false;
      this.state.mouse.overParticleFill = false;
    };
    this._onDown = (e) => {
      this.state.mouse.down = true;
      this.updateMouse(e);
    };
    this._onUp = (e) => {
      this.state.mouse.down = false;
      if (e) this.updateMouse(e);
    };
    this.canvas.addEventListener('mousemove', this._onMove);
    this.canvas.addEventListener('mouseenter', this._onEnter);
    this.canvas.addEventListener('mouseleave', this._onLeave);
    this.canvas.addEventListener('mousedown', this._onDown);
    window.addEventListener('mouseup', this._onUp);

    this._onTouchStart = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const r = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - r.left) * this.state.dpr;
        const y = (touch.clientY - r.top) * this.state.dpr;

        const inCanvas = x >= 0 && x <= this.state.W && y >= 0 && y <= this.state.H;
        const ok = touchActive() ? inCanvas : inCanvas && this.isInsideTextBounds(x, y);

        this.state.touch.inTextArea = ok;

        if (ok) {
          this.state.mouse.inside = true;
          this.state.mouse.down = false;
          this.updateTouch(touch);
          this.state.touch.startTime = Date.now();
          this.state.touch.startX = this.state.mouse.x;
          this.state.touch.startY = this.state.mouse.y;
          this.state.touch.moved = false;
        } else {
          this.state.mouse.inside = false;
          this.state.mouse.overParticleFill = false;
        }
      }
    };
    this._onTouchMove = (e) => {
      if (e.touches.length > 0) {
        if (!this.state.touch.inTextArea) return;

        const t = e.touches[0];
        const r = this.canvas.getBoundingClientRect();
        const x = (t.clientX - r.left) * this.state.dpr;
        const y = (t.clientY - r.top) * this.state.dpr;
        const dx = x - this.state.touch.startX;
        const dy = y - this.state.touch.startY;
        if (Math.hypot(dx, dy) > 15 * this.state.dpr) this.state.touch.moved = true;
        this.state.mouse.down = false;
        this.updateTouch(t);
        e.preventDefault();
      }
    };
    this._onTouchEnd = () => {
      if (!this.state.touch.inTextArea) {
        this.state.touch.inTextArea = false;
        return;
      }

      const touch = this.state.touch;
      const elapsed = Date.now() - touch.startTime;
      const isTap = !touch.moved && elapsed < 350;
      if (isTap) {
        this.state.mouse.down = true;
        const self = this;
        setTimeout(() => {
          self.state.mouse.down = false;
        }, 80);
      } else {
        this.state.mouse.down = false;
      }
      setTimeout(() => {
        if (!this.state.mouse.down) {
          this.state.mouse.inside = false;
          this.state.mouse.overParticleFill = false;
        }
      }, 120);
      this.state.touch.inTextArea = false;
    };
    this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this._onTouchEnd);
    this.canvas.addEventListener('touchcancel', this._onTouchEnd);
  }

  _unbindMouse() {
    this.canvas.removeEventListener('mousemove', this._onMove);
    this.canvas.removeEventListener('mouseenter', this._onEnter);
    this.canvas.removeEventListener('mouseleave', this._onLeave);
    this.canvas.removeEventListener('mousedown', this._onDown);
    window.removeEventListener('mouseup', this._onUp);
    this.canvas.removeEventListener('touchstart', this._onTouchStart);
    this.canvas.removeEventListener('touchmove', this._onTouchMove);
    this.canvas.removeEventListener('touchend', this._onTouchEnd);
    this.canvas.removeEventListener('touchcancel', this._onTouchEnd);
  }

  rebuild(force = false) {
    const { W, H, dpr } = this.state;
    const p = this.preset;
    const layoutKey = this.getNormalizedLayoutsKey();
    const key = JSON.stringify({ layoutKey, W, H, dpr });

    if (!force && key === this.state.lastKey) return;
    this.state.lastKey = key;

    if (W < 8 || H < 8) {
      this.state.points = [];
      return;
    }

    const layerCfgs = this.getNormalizedLayers();
    const layouts = [];
    let unionTb = null;

    for (const cfg of layerCfgs) {
      const lo = this.layoutLayer(cfg);
      if (lo && lo.lines.some((ln) => ln.length)) layouts.push(lo);
    }

    this.state.solidLayouts = layouts.map((lo) => ({ ...lo }));

    const primary = layouts[0];
    this.state.textLayout = primary ? { ...primary } : null;

    for (const lo of layouts) unionTb = unionBounds(unionTb, lo.textBounds);
    if (unionTb) unionTb.padding = unionTb.padding ?? Math.round((Number(p.fontSize) || 100) * dpr * 0.12);
    this.state.textBounds = unionTb;

    this.off.width = W;
    this.off.height = H;

    const baseStep = (Number(p.spacing) || 7) * dpr;
    const threshold = Number(p.threshold) || 30;
    const pts = [];
    const jitter = 0.35 * baseStep;

    for (let li = 0; li < layouts.length; li++) {
      const layout = layouts[li];
      const cfg = layout.cfg;
      this.offCtx.clearRect(0, 0, W, H);
      this.drawLayoutWhite(layout);

      const img = this.offCtx.getImageData(0, 0, W, H).data;

      let step =
        cfg.spacingMul != null && cfg.spacingMul > 0 ? baseStep * cfg.spacingMul : baseStep;
      if (cfg.isPrimary !== true && step / baseStep < 1.3) step = baseStep * 1.85;

      const driftAmpEffective =
        this.state.reducesMotion && cfg.driftAmp ? cfg.driftAmp * 0.15 : cfg.driftAmp || 0;

      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const xi = Math.floor(x + (Math.random() * 2 - 1) * jitter);
          const yi = Math.floor(y + (Math.random() * 2 - 1) * jitter);
          if (xi < 0 || xi >= W || yi < 0 || yi >= H) continue;
          const a = img[(yi * W + xi) * 4 + 3];
          if (a <= threshold) continue;

          pts.push({
            ox: xi,
            oy: yi,
            x: xi,
            y: yi,
            vx: 0,
            vy: 0,
            driftAmp: driftAmpEffective,
            driftFreq: cfg.driftFreq || 0.00035,
            morphGain: cfg.morphGain != null && cfg.morphGain > 0 ? cfg.morphGain : 1,
            pointOpacity: cfg.opacity != null ? clamp(cfg.opacity, 0, 1) : 1,
            pointSizeMul:
              cfg.pointSizeMul != null && cfg.pointSizeMul > 0 ? cfg.pointSizeMul : 1,
          });
        }
      }
    }

    this.state.points = pts;
  }

  resize() {
    const r = this.getBoundingClientRect();
    const maxDprPreset = Number(this.preset.maxDpr);
    const maxDpr =
      Number.isFinite(maxDprPreset) && maxDprPreset > 0 ? maxDprPreset : 2.5;
    this.state.dpr = clamp(window.devicePixelRatio || 1, 1, maxDpr);
    const w = Math.floor(r.width * this.state.dpr);
    const h = Math.floor(r.height * this.state.dpr);
    if (w < 8 || h < 8) {
      requestAnimationFrame(() => this.resize());
      return;
    }
    if (w !== this.state.W || h !== this.state.H) {
      this.state.W = w;
      this.state.H = h;
      this.canvas.width = this.state.W;
      this.canvas.height = this.state.H;
      this.rebuild(true);
    }
  }

  /** Union of layered text layouts (ignored by interactFullCanvas). */
  isInsideTextUnion(x, y) {
    const tb = this.state.textBounds;
    if (!tb) return true;
    const pad = tb.padding || 0;
    return (
      x >= tb.x - pad &&
      x <= tb.x + tb.width + pad &&
      y >= tb.y - pad &&
      y <= tb.y + tb.height + pad
    );
  }

  isInsideTextBounds(x, y) {
    if (this.preset.interactFullCanvas === true) return true;
    return this.isInsideTextUnion(x, y);
  }

  updateMouse(e) {
    const r = this.canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) * this.state.dpr;
    const my = (e.clientY - r.top) * this.state.dpr;
    const m = this.state.mouse;
    const inCanvas = mx >= 0 && mx <= this.state.W && my >= 0 && my <= this.state.H;
    const fullCanvas = this.preset.interactFullCanvas === true;
    const nextInside = inCanvas && (fullCanvas || this.isInsideTextBounds(mx, my));
    m.inside = nextInside;
    m.overParticleFill = inCanvas && this.isInsideTextUnion(mx, my);
    m.px = m.x;
    m.py = m.y;
    m.x = mx;
    m.y = my;
    const vx = m.x - m.px;
    const vy = m.y - m.py;
    m.vx = lerp(m.vx, vx, 0.35);
    m.vy = lerp(m.vy, vy, 0.35);
  }

  updateTouch(touch) {
    const r = this.canvas.getBoundingClientRect();
    const mx = (touch.clientX - r.left) * this.state.dpr;
    const my = (touch.clientY - r.top) * this.state.dpr;
    const m = this.state.mouse;
    const inCanvas = mx >= 0 && mx <= this.state.W && my >= 0 && my <= this.state.H;
    const fullCanvas = this.preset.interactFullCanvas === true;
    m.inside = inCanvas && (fullCanvas || this.isInsideTextBounds(mx, my));
    m.overParticleFill =
      inCanvas &&
      (this.isInsideTextUnion(mx, my) || (fullCanvas && this.state.touch.inTextArea === true));
    m.px = m.x;
    m.py = m.y;
    m.x = mx;
    m.y = my;
    const vx = m.x - m.px;
    const vy = m.y - m.py;
    m.vx = lerp(m.vx, vx, 0.35);
    m.vy = lerp(m.vy, vy, 0.35);
  }

  tick(now) {
    const dt = Math.min(0.033, (now - this._last) / 1000);
    this._last = now;

    const ctx = this.ctx;
    const { W, H } = this.state;
    const p = this.preset;

    const bg = (p.bg || 'transparent').trim();
    if (bg.toLowerCase() === 'transparent') ctx.clearRect(0, 0, W, H);
    else {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    if (this.state.points.length === 0) {
      this._raf = requestAnimationFrame(this._tick);
      return;
    }

    const m = this.state.mouse;

    const gravityOnClick = p.gravityOnClick !== false;
    const isHovering = m.inside && !m.down;
    const isClicking = m.inside && m.down;

    const hoverActive = isHovering && !p.pressOnly;
    const gravityActive = isClicking && gravityOnClick;

    const showSolidWhenIdle = p.showSolidWhenIdle !== false;
    const transitionSpeed = Number(p.transitionSpeed) || 0.08;

    let rawTargetOpacity = m.overParticleFill ? 1 : 0;
    const morphX = Number(p.morphX) || 0;
    const morphY = Number(p.morphY) || 0;
    const morphFactor = Math.max(morphX, morphY);
    if (morphFactor > 0) rawTargetOpacity = Math.max(rawTargetOpacity, morphFactor);
    if (p.holdOpen === true) rawTargetOpacity = 1;

    const delayRaw = Number(p.solidRevealDelayMs);
    const solidDelayMs = Number.isFinite(delayRaw) ? Math.max(0, delayRaw) : 0;
    let targetOpacity = rawTargetOpacity;
    const morphQuiet = morphFactor < 0.003;
    if (
      solidDelayMs > 0 &&
      morphQuiet &&
      rawTargetOpacity < 1 &&
      this.state.pointsOpacity > 0.12
    ) {
      const nowMs = performance.now();
      if (!this.state._pendingSolidReveal)
        this.state._pendingSolidReveal = { until: nowMs + solidDelayMs };
      if (nowMs < this.state._pendingSolidReveal.until) targetOpacity = 1;
      else this.state._pendingSolidReveal = null;
    } else if (rawTargetOpacity >= 1) {
      this.state._pendingSolidReveal = null;
    }

    this.state.pointsOpacity = lerp(this.state.pointsOpacity, targetOpacity, transitionSpeed);

    if (this.state.pointsOpacity < 0.01) this.state.pointsOpacity = 0;
    if (this.state.pointsOpacity > 0.99) this.state.pointsOpacity = 1;

    const radius = (Number(p.radius) || 150) * this.state.dpr;
    const strength = Number(p.strength) || 2.2;
    const dragInfluence = Number(p.drag) || 1.6;
    const turb = Number(p.noise) || 0.55;
    const kRaw = Number(p.returnForce);
    const k = Number.isFinite(kRaw) ? kRaw : 0.07;
    const damping = Number(p.damping) || 0.9;
    const gravity = Number(p.gravityStrength) || 0.5;

    const explSlowRaw = Number(p.explosionMotionScale);
    const explSlow = Number.isFinite(explSlowRaw) ? clamp(explSlowRaw, 0.05, 1) : 0.45;
    const motionStep = p.holdOpen === true || gravityActive ? explSlow : 1;

    const ps = (Number(p.pointSize) || 2.2) * this.state.dpr;
    const color = p.color || '#E8EEF7';

    let mvx = m.vx;
    let mvy = m.vy;
    const mvLen = Math.hypot(mvx, mvy) || 1;
    mvx /= mvLen;
    mvy /= mvLen;

    if (showSolidWhenIdle && this.state.pointsOpacity < 1) {
      this.drawSolidText(1 - this.state.pointsOpacity);
    }

    const morphAmp = (Number(p.morphAmplitude) || 60) * this.state.dpr;
    const morphFreq = Number(p.morphFreq) || 0.002;

    const poBase = this.state.pointsOpacity;

    const driftRmMul = this.state.reducesMotion ? 0.25 : 1;

    for (const pt of this.state.points) {
      if (!gravityActive) {
        const holdOpen = p.holdOpen === true;
        if (!holdOpen) {
          let tx = pt.ox;
          let ty = pt.oy;
          const da = pt.driftAmp || 0;
          if (da) {
            const fq = pt.driftFreq || 0.00035;
            const ph = now * fq + pt.ox * 0.004 + pt.oy * 0.0025;
            const amp = da * this.state.dpr * 0.92 * driftRmMul;
            tx += Math.sin(ph) * amp;
            ty += Math.cos(ph * 0.88 + 0.9) * amp;
          }
          if (morphX > 0 || morphY > 0) {
            const mg = pt.morphGain != null ? pt.morphGain : 1;
            const tm = now * morphFreq;
            tx += morphX * morphAmp * mg * Math.sin(tm + pt.ox * 0.008 + pt.oy * 0.005);
            ty += morphY * morphAmp * mg * Math.cos(tm + pt.oy * 0.008 + pt.ox * 0.005);
          }
          pt.vx += (tx - pt.x) * k;
          pt.vy += (ty - pt.y) * k;
        } else {
          const wander = Number(p.wanderStrength);
          const wanderAmt = Number.isFinite(wander) ? wander : 0;
          if (wanderAmt > 0) {
            pt.vx += (Math.random() - 0.5) * wanderAmt * dt * motionStep;
            pt.vy += (Math.random() - 0.5) * wanderAmt * dt * motionStep;
          }
        }
      }

      if (hoverActive) {
        const dx = pt.x - m.x;
        const dy = pt.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const factor = 1 - dist / radius;
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);

          const rep = strength * factor * factor * 60 * dt;
          pt.vx += nx * rep;
          pt.vy += ny * rep;

          const drag = dragInfluence * factor * factor * 42 * dt * Math.min(4, mvLen / (6 * this.state.dpr));
          pt.vx += mvx * drag;
          pt.vy += mvy * drag;

          const n = turb * factor * 18 * dt;
          const ang = pt.ox * 0.013 + pt.oy * 0.017 + now * 0.0017;
          pt.vx += Math.cos(ang) * n;
          pt.vy += Math.sin(ang) * n;
        }
      }

      if (gravityActive) {
        if (!pt.falling) {
          pt.falling = true;
          const cx = W * 0.5;
          const cy = H * 0.5;
          const dx = pt.x - cx;
          const dy = pt.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;
          const burstBase = Number(p.burstStrength) || 8;
          const burst = (0.5 + Math.random() * 1.5) * burstBase;
          pt.vx += nx * burst * motionStep;
          pt.vy += (ny * burst - burstBase * 0.25) * motionStep;
          pt.fallSpeed = 0.7 + Math.random() * 0.8;
        }

        const fallMultiplier = pt.fallSpeed || 1;
        pt.vy += gravity * fallMultiplier * 60 * dt * motionStep;

        const driftRand = (Math.random() - 0.5) * 0.15 * dt * 60 * motionStep;
        pt.vx += driftRand;
      } else {
        pt.falling = false;
      }

      pt.vx *= damping;
      pt.vy *= damping;
      pt.x += pt.vx * motionStep;
      pt.y += pt.vy * motionStep;

      if (p.holdOpen === true) {
        const pad = 6 * this.state.dpr;
        if (pt.x < pad) {
          pt.x = pad;
          pt.vx *= -0.55;
        } else if (pt.x > W - pad) {
          pt.x = W - pad;
          pt.vx *= -0.55;
        }
        if (pt.y < pad) {
          pt.y = pad;
          pt.vy *= -0.55;
        } else if (pt.y > H - pad) {
          pt.y = H - pad;
          pt.vy *= -0.55;
        }
      }

      const pmul =
        pt.pointSizeMul != null && pt.pointSizeMul > 0 ? pt.pointSizeMul : 1;
      const pop = pt.pointOpacity != null ? clamp(pt.pointOpacity, 0, 1) : 1;

      ctx.fillStyle = color;
      ctx.globalAlpha = clamp(poBase * pop, 0, 1);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, ps * pmul, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    this._raf = requestAnimationFrame(this._tick);
  }
}

customElements.define('text-pointcloud', TextPointcloud);
