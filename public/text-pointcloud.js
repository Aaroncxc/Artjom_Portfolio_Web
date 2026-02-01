// text-pointcloud-module.js
// Usage:
// import "./text-pointcloud-module.js"
// <text-pointcloud style="width:600px;height:320px" preset='{"text":"HELLO"}'></text-pointcloud>

const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const lerp = (a,b,t)=>a+(b-a)*t;

const DEFAULTS = {
  "text": "multikunst",
  "fontSize": 400,
  "lineHeight": 1,
  "letterSpacing": -6,
  "weight": 700,
  "italic": false,
  "spacing": 4,
  "pointSize": 1.2,
  "threshold": 30,
  "color": "#E8EEF7",
  "bg": "transparent",
  "centerMode": "center",
  "radius": 295,
  "strength": 2.2,
  "drag": 1.6,
  "noise": 0.56,
  "returnForce": 0.01,
  "damping": 0.1,
  "pressOnly": false,
  "gravityStrength": 0.5,
  "gravityOnClick": true,
  "showSolidWhenIdle": true,
  "transitionSpeed": 0.08,
  "burstStrength": 8
};

function safeParseJSON(str){
  try{ return JSON.parse(str); }catch{ return null; }
}

class TextPointcloud extends HTMLElement{
  static get observedAttributes(){ return ["preset","text","preset-src"]; }

  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block; position:relative;}
        canvas{position:absolute; inset:0; width:100%; height:100%; display:block;}
      </style>
      <canvas></canvas>
    `;
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d", {alpha:true});
    this.off = document.createElement("canvas");
    this.offCtx = this.off.getContext("2d", {willReadFrequently:true});

    this.state = {
      W:0, H:0, dpr:1,
      points: [],
      lastKey: "",
      mouse: {x:0,y:0,px:0,py:0,vx:0,vy:0,down:false,inside:false},
      pointsOpacity: 0,  // 0 = solid text, 1 = points visible
    };

    this.preset = {...DEFAULTS};

    this._ro = new ResizeObserver(()=>this.resize());
    this._raf = 0;
    this._last = performance.now();
  }

  connectedCallback(){
    // preset via attribute (inline JSON or URL/path to a .json file)
    const presetAttr = (this.getAttribute("preset") || "").trim();
    if(presetAttr){
      if(presetAttr[0] === "{" || presetAttr[0] === "["){
        const p = safeParseJSON(presetAttr);
        if(p) this.setPreset(p);
      }else{
        // treat as URL/path
        this.loadPreset(presetAttr);
      }
    }

    // optional: preset-src explicitly points to a JSON file
    const src = (this.getAttribute("preset-src") || "").trim();
    if(src) this.loadPreset(src);

    const t = this.getAttribute("text");
    if(typeof t === "string" && t.length) this.preset.text = t;

    this._ro.observe(this);
    this._bindMouse();
    this.resize();
    this._tick = (now)=>this.tick(now);
    this._raf = requestAnimationFrame(this._tick);
  }

  disconnectedCallback(){
    this._ro.disconnect();
    cancelAnimationFrame(this._raf);
    this._unbindMouse();
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(oldValue === newValue) return;
    if(name === "text"){
      this.preset.text = newValue || "";
      this.rebuild(true);
    }
    if(name === "preset"){
      const v = (newValue || "").trim();
      if(!v) return;
      if(v[0] === "{" || v[0] === "["){
        const p = safeParseJSON(v);
        if(p) this.setPreset(p);
      }else{
        this.loadPreset(v);
      }
    }
    if(name === "preset-src"){
      const v = (newValue || "").trim();
      if(v) this.loadPreset(v);
    }
  }

  async loadPreset(url){
    try{
      const res = await fetch(url, {cache:"no-store"});
      if(!res.ok) throw new Error(res.status + " " + res.statusText);
      const p = await res.json();
      if(p && typeof p === "object") this.setPreset(p);
    }catch(err){
      // fail silently (common when opening via file:// without a server)
      // console.warn("text-pointcloud preset load failed:", err);
    }
  }

  getPreset(){ return {...this.preset}; }
  setPreset(p){
    if(!p || typeof p !== "object") return;
    this.preset = {...this.preset, ...p};
    this.rebuild(true);
  }

  _bindMouse(){
    // Mouse events
    this._onMove = (e)=>this.updateMouse(e);
    this._onEnter = (e)=>{ this.state.mouse.inside=true; this.updateMouse(e); };
    this._onLeave = ()=>{ this.state.mouse.inside=false; };
    this._onDown = (e)=>{ 
      this.state.mouse.down=true; 
      this.updateMouse(e);
    };
    this._onUp = (e)=>{ 
      this.state.mouse.down=false; 
      if(e) this.updateMouse(e);
    };
    this.canvas.addEventListener("mousemove", this._onMove);
    this.canvas.addEventListener("mouseenter", this._onEnter);
    this.canvas.addEventListener("mouseleave", this._onLeave);
    this.canvas.addEventListener("mousedown", this._onDown);
    window.addEventListener("mouseup", this._onUp);

    // Touch events - translate to mouse-like coordinates
    this._onTouchStart = (e)=>{
      if(e.touches.length > 0){
        this.state.mouse.inside = true;
        this.state.mouse.down = true;
        this.updateTouch(e.touches[0]);
      }
    };
    this._onTouchMove = (e)=>{
      if(e.touches.length > 0){
        this.updateTouch(e.touches[0]);
        // Prevent scroll while interacting
        e.preventDefault();
      }
    };
    this._onTouchEnd = (e)=>{
      this.state.mouse.down = false;
      // Keep inside=true briefly to allow effect to settle
      setTimeout(()=>{
        if(!this.state.mouse.down) this.state.mouse.inside = false;
      }, 100);
    };
    this.canvas.addEventListener("touchstart", this._onTouchStart, {passive: false});
    this.canvas.addEventListener("touchmove", this._onTouchMove, {passive: false});
    this.canvas.addEventListener("touchend", this._onTouchEnd);
    this.canvas.addEventListener("touchcancel", this._onTouchEnd);
  }
  _unbindMouse(){
    this.canvas.removeEventListener("mousemove", this._onMove);
    this.canvas.removeEventListener("mouseenter", this._onEnter);
    this.canvas.removeEventListener("mouseleave", this._onLeave);
    this.canvas.removeEventListener("mousedown", this._onDown);
    window.removeEventListener("mouseup", this._onUp);
    // Touch events
    this.canvas.removeEventListener("touchstart", this._onTouchStart);
    this.canvas.removeEventListener("touchmove", this._onTouchMove);
    this.canvas.removeEventListener("touchend", this._onTouchEnd);
    this.canvas.removeEventListener("touchcancel", this._onTouchEnd);
  }

  makeFontCSS(){
    const italic = this.preset.italic ? "italic " : "";
    const weight = Number(this.preset.weight) || 700;
    const size = Number(this.preset.fontSize) || 140;
    return `${italic}${weight} ${Math.round(size*this.state.dpr)}px Arial, Helvetica, sans-serif`;
  }

  measureLineWidth(line, font, letterSpacing){
    const ctx = this.offCtx;
    ctx.save();
    ctx.font = font;
    const dls = (Number(letterSpacing)||0) * this.state.dpr;
    if(!dls){
      const w = ctx.measureText(line).width;
      ctx.restore();
      return w;
    }
    let w = 0;
    for(const ch of line) w += ctx.measureText(ch).width + dls;
    if(line.length) w -= dls;
    ctx.restore();
    return w;
  }

  drawTextOffscreen(){
    const {W,H} = this.state;
    const ctx = this.offCtx;
    const text = (this.preset.text || "").replace(/\r\n/g,"\n");
    const lines = text.split("\n");
    const font = this.makeFontCSS();
    const lh = Number(this.preset.lineHeight) || 1.0;
    const ls = Number(this.preset.letterSpacing) || 0;

    this.off.width = W;
    this.off.height = H;
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.font = font;

    const linePx = (Number(this.preset.fontSize) * lh) * this.state.dpr;

    let blockW = 0;
    for(const l of lines) blockW = Math.max(blockW, this.measureLineWidth(l, font, ls));
    const blockH = lines.length * linePx;

    let x0 = (W - blockW) * 0.5;
    let y0 = 0;
    const mode = this.preset.centerMode || "center";
    if(mode === "center") y0 = (H - blockH) * 0.5;
    else if(mode === "top") y0 = Math.max(24*this.state.dpr, H*0.12);
    else y0 = Math.min(H - blockH - 24*this.state.dpr, H*0.78 - blockH);

    // Store text position for solid text rendering
    this.state.textLayout = { x0, y0, linePx, lines, font, dls: ls * this.state.dpr };

    const dls = ls * this.state.dpr;
    for(let i=0;i<lines.length;i++){
      const y = y0 + i*linePx;
      const line = lines[i];
      if(!dls){
        ctx.fillText(line, x0, y);
      } else {
        let x = x0;
        ctx.save(); ctx.font = font;
        for(const ch of line){
          ctx.fillText(ch, x, y);
          x += ctx.measureText(ch).width + dls;
        }
        ctx.restore();
      }
    }
  }

  // Draw solid text directly on main canvas
  drawSolidText(opacity = 1){
    if(!this.state.textLayout) return;
    const ctx = this.ctx;
    const {x0, y0, linePx, lines, font, dls} = this.state.textLayout;
    const color = this.preset.color || "#E8EEF7";
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.font = font;
    
    for(let i=0; i<lines.length; i++){
      const y = y0 + i*linePx;
      const line = lines[i];
      if(!dls){
        ctx.fillText(line, x0, y);
      } else {
        let x = x0;
        for(const ch of line){
          ctx.fillText(ch, x, y);
          x += ctx.measureText(ch).width + dls;
        }
      }
    }
    ctx.restore();
  }

  rebuild(force=false){
    const {W,H,dpr} = this.state;
    const p = this.preset;
    const key = JSON.stringify({p, W, H, dpr});
    if(!force && key === this.state.lastKey) return;
    this.state.lastKey = key;

    if(W < 8 || H < 8){ this.state.points = []; return; }

    this.drawTextOffscreen();
    const img = this.offCtx.getImageData(0,0,W,H).data;

    const step = (Number(p.spacing)||7) * dpr;
    const threshold = Number(p.threshold)||30;
    const pts = [];
    const jitter = 0.35 * step;

    for(let y=0; y<H; y+=step){
      for(let x=0; x<W; x+=step){
        const xi = Math.floor(x + (Math.random()*2-1)*jitter);
        const yi = Math.floor(y + (Math.random()*2-1)*jitter);
        if(xi<0||xi>=W||yi<0||yi>=H) continue;
        const a = img[(yi*W + xi)*4 + 3];
        if(a > threshold) pts.push({ox:xi,oy:yi,x:xi,y:yi,vx:0,vy:0});
      }
    }
    this.state.points = pts;
  }

  resize(){
    const r = this.getBoundingClientRect();
    this.state.dpr = clamp(window.devicePixelRatio || 1, 1, 2.5);
    this.state.W = Math.floor(r.width * this.state.dpr);
    this.state.H = Math.floor(r.height * this.state.dpr);
    this.canvas.width = this.state.W;
    this.canvas.height = this.state.H;
    this.rebuild(true);
  }

  updateMouse(e){
    const r = this.canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) * this.state.dpr;
    const my = (e.clientY - r.top) * this.state.dpr;
    const m = this.state.mouse;
    m.inside = (mx>=0 && mx<=this.state.W && my>=0 && my<=this.state.H);
    m.px = m.x; m.py = m.y;
    m.x = mx; m.y = my;
    const vx = (m.x - m.px), vy = (m.y - m.py);
    m.vx = lerp(m.vx, vx, 0.35);
    m.vy = lerp(m.vy, vy, 0.35);
  }

  updateTouch(touch){
    const r = this.canvas.getBoundingClientRect();
    const mx = (touch.clientX - r.left) * this.state.dpr;
    const my = (touch.clientY - r.top) * this.state.dpr;
    const m = this.state.mouse;
    m.inside = (mx>=0 && mx<=this.state.W && my>=0 && my<=this.state.H);
    m.px = m.x; m.py = m.y;
    m.x = mx; m.y = my;
    const vx = (m.x - m.px), vy = (m.y - m.py);
    m.vx = lerp(m.vx, vx, 0.35);
    m.vy = lerp(m.vy, vy, 0.35);
  }

  tick(now){
    const dt = Math.min(0.033, (now-this._last)/1000);
    this._last = now;

    const ctx = this.ctx;
    const {W,H} = this.state;
    const p = this.preset;

    const bg = (p.bg || "transparent").trim();
    if(bg.toLowerCase()==="transparent") ctx.clearRect(0,0,W,H);
    else { ctx.fillStyle = bg; ctx.fillRect(0,0,W,H); }

    if(this.state.points.length === 0){
      this._raf = requestAnimationFrame(this._tick);
      return;
    }

    const m = this.state.mouse;
    
    // Determine interaction mode
    const gravityOnClick = p.gravityOnClick !== false;
    const isHovering = m.inside && !m.down;
    const isClicking = m.inside && m.down;
    
    // Hover repulsion is active when hovering (not clicking)
    const hoverActive = isHovering && !p.pressOnly;
    // Gravity is active when clicking and gravityOnClick is enabled
    const gravityActive = isClicking && gravityOnClick;
    
    // Handle solid text vs points transition
    const showSolidWhenIdle = p.showSolidWhenIdle !== false;
    const transitionSpeed = Number(p.transitionSpeed) || 0.08;
    
    // Target opacity: 1 when mouse is inside (show points), 0 when outside (show solid)
    const targetOpacity = m.inside ? 1 : 0;
    // Smoothly transition
    this.state.pointsOpacity = lerp(this.state.pointsOpacity, targetOpacity, transitionSpeed);
    
    // Clamp to avoid floating point issues
    if(this.state.pointsOpacity < 0.01) this.state.pointsOpacity = 0;
    if(this.state.pointsOpacity > 0.99) this.state.pointsOpacity = 1;

    const radius = (Number(p.radius)||150) * this.state.dpr;
    const strength = Number(p.strength)||2.2;
    const dragInfluence = Number(p.drag)||1.6;
    const turb = Number(p.noise)||0.55;
    const k = Number(p.returnForce)||0.07;
    const damping = Number(p.damping)||0.90;
    const gravity = Number(p.gravityStrength)||0.5;

    const ps = (Number(p.pointSize)||2.2) * this.state.dpr;
    const color = p.color || "#E8EEF7";

    let mvx = m.vx, mvy = m.vy;
    const mvLen = Math.hypot(mvx,mvy) || 1;
    mvx /= mvLen; mvy /= mvLen;

    // Draw solid text when not fully transitioned to points
    if(showSolidWhenIdle && this.state.pointsOpacity < 1){
      this.drawSolidText(1 - this.state.pointsOpacity);
    }

    // Draw points with current opacity
    ctx.fillStyle = color;
    ctx.globalAlpha = this.state.pointsOpacity;

    for(const pt of this.state.points){
      // Return force: only apply when NOT clicking (so points return after release)
      if(!gravityActive){
        pt.vx += (pt.ox - pt.x) * k;
        pt.vy += (pt.oy - pt.y) * k;
      }

      // Hover repulsion effect
      if(hoverActive){
        const dx = pt.x - m.x, dy = pt.y - m.y;
        const dist = Math.hypot(dx,dy);
        if(dist < radius){
          const t = 1 - dist/radius;
          const nx = dx/(dist||1), ny = dy/(dist||1);

          const rep = strength * (t*t) * 60 * dt;
          pt.vx += nx*rep; pt.vy += ny*rep;

          const drag = dragInfluence*(t*t)*42*dt*Math.min(4, mvLen/(6*this.state.dpr));
          pt.vx += mvx*drag; pt.vy += mvy*drag;

          const n = turb*t*18*dt;
          const ang = (pt.ox*0.013 + pt.oy*0.017 + now*0.0017);
          pt.vx += Math.cos(ang)*n; pt.vy += Math.sin(ang)*n;
        }
      }

      // Gravity effect when clicking
      if(gravityActive){
        // On first click frame, give each point a unique burst outward
        if(!pt.falling){
          pt.falling = true;
          // Calculate direction from center of canvas
          const cx = W * 0.5, cy = H * 0.5;
          const dx = pt.x - cx, dy = pt.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const nx = dx / dist, ny = dy / dist;
          // Random burst strength using burstStrength parameter
          const burstBase = Number(p.burstStrength) || 8;
          const burst = (0.5 + Math.random() * 1.5) * burstBase;
          pt.vx += nx * burst;
          pt.vy += ny * burst - (burstBase * 0.25); // slight upward component first
          // Assign unique fall speed multiplier
          pt.fallSpeed = 0.7 + Math.random() * 0.8;
        }
        
        // Apply gravity with individual fall speed
        const fallMultiplier = pt.fallSpeed || 1;
        pt.vy += gravity * fallMultiplier * 60 * dt;
        
        // Add slight horizontal drift for more natural falling
        const drift = (Math.random() - 0.5) * 0.15 * dt * 60;
        pt.vx += drift;
      } else {
        // Reset falling state when not clicking
        pt.falling = false;
      }

      pt.vx *= damping; pt.vy *= damping;
      pt.x += pt.vx; pt.y += pt.vy;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, ps, 0, Math.PI*2);
      ctx.fill();
    }
    
    // Reset global alpha
    ctx.globalAlpha = 1;

    this._raf = requestAnimationFrame(this._tick);
  }
}

customElements.define("text-pointcloud", TextPointcloud);
