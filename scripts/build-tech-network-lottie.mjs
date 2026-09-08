/**
 * Custom Atelier-Noire tech-network Lottie (constellation, not SaaS mesh).
 * Paper + champagne metal only — no teal/violet.
 * Regenerates public/bg/tech-network.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1920;
const H = 720;
const FR = 30;
const OP = 300;

/** Paper #F2EDE8, metal #C4A574 — Lottie RGBA 0–1 */
const paper = [0.949, 0.929, 0.91, 1];
const metal = [0.769, 0.647, 0.455, 1];
const paperDim = [0.949, 0.929, 0.91, 1];
const metalDim = [0.722, 0.584, 0.416, 1];

/**
 * Depth layers: back (thin/faint), mid, front (stronger).
 * Nodes as [x, y], edges as [ai, bi] within that layer's node list.
 */
const layersDef = [
  {
    name: 'back',
    opacity: 28,
    stroke: 0.85,
    nodeSize: [5, 5],
    halo: [12, 12],
    nodes: [
      [80, 580],
      [200, 420],
      [340, 610],
      [480, 380],
      [620, 540],
      [760, 300],
      [900, 560],
      [1040, 400],
      [1180, 620],
      [1320, 340],
      [1460, 500],
      [1600, 280],
      [1740, 540],
      [1860, 400],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [6, 7],
      [6, 8],
      [7, 9],
      [8, 10],
      [9, 10],
      [9, 11],
      [10, 12],
      [11, 12],
      [12, 13],
      [5, 9],
    ],
    // faint triangle fills (index triples)
    triangles: [
      [1, 3, 4],
      [7, 9, 10],
    ],
  },
  {
    name: 'mid',
    opacity: 48,
    stroke: 1.15,
    nodeSize: [7, 7],
    halo: [15, 15],
    nodes: [
      [160, 500],
      [300, 340],
      [440, 520],
      [560, 240],
      [700, 440],
      [840, 280],
      [980, 480],
      [1120, 300],
      [1260, 520],
      [1400, 260],
      [1540, 440],
      [1680, 340],
      [380, 180],
      [920, 180],
      [1500, 160],
      [220, 620],
      [1080, 600],
      [1720, 580],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [6, 7],
      [6, 8],
      [7, 9],
      [8, 10],
      [9, 10],
      [10, 11],
      [1, 12],
      [5, 12],
      [5, 13],
      [7, 13],
      [9, 14],
      [11, 14],
      [0, 15],
      [2, 15],
      [6, 16],
      [8, 16],
      [10, 17],
      [11, 17],
      // short branches
      [4, 13],
      [12, 3],
    ],
    triangles: [
      [1, 3, 4],
      [5, 7, 13],
      [6, 8, 16],
    ],
  },
  {
    name: 'front',
    opacity: 72,
    stroke: 1.45,
    nodeSize: [9, 9],
    halo: [18, 18],
    nodes: [
      [240, 460],
      [420, 300],
      [600, 500],
      [780, 220],
      [960, 420],
      [1140, 280],
      [1320, 480],
      [1500, 320],
      [1680, 460],
      [500, 160],
      [1000, 140],
      [1480, 120],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 6],
      [5, 7],
      [6, 8],
      [7, 8],
      [1, 9],
      [3, 9],
      [3, 10],
      [5, 10],
      [5, 11],
      [7, 11],
      // branches
      [0, 2],
      [4, 5],
    ],
    triangles: [
      [1, 3, 4],
      [3, 5, 10],
    ],
  },
];

function kf(from, to, frames) {
  return [
    {
      i: { x: [0.42], y: [1] },
      o: { x: [0.58], y: [0] },
      t: 0,
      s: [from],
    },
    { t: frames, s: [to] },
  ];
}

function transform() {
  return {
    ty: 'tr',
    p: { a: 0, k: [0, 0] },
    a: { a: 0, k: [0, 0] },
    s: { a: 0, k: [100, 100] },
    r: { a: 0, k: 0 },
    o: { a: 0, k: 100 },
  };
}

function layerBase(ind, nm, opacity = 100) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm,
    sr: 1,
    ks: {
      o: { a: 0, k: opacity },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
  };
}

function edgeLayer(ind, a, b, color, delay, strokeW, layerOpacity) {
  const dash = 12 + (ind % 6);
  const gap = 32 + (ind % 8) * 5;
  return {
    ...layerBase(ind, `edge-${ind}`, layerOpacity),
    shapes: [
      {
        ty: 'gr',
        it: [
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                c: false,
                v: [a, b],
                i: [
                  [0, 0],
                  [0, 0],
                ],
                o: [
                  [0, 0],
                  [0, 0],
                ],
              },
            },
          },
          {
            ty: 'st',
            c: { a: 0, k: color },
            o: { a: 0, k: 100 },
            w: { a: 0, k: strokeW },
            lc: 2,
            lj: 2,
            d: [
              { n: 'd', nm: 'dash', v: { a: 0, k: dash } },
              { n: 'g', nm: 'gap', v: { a: 0, k: gap } },
              {
                n: 'o',
                nm: 'offset',
                v: { a: 1, k: kf(delay, delay + 220, OP) },
              },
            ],
          },
          transform(),
        ],
      },
    ],
  };
}

function triangleLayer(ind, pts, color, layerOpacity) {
  return {
    ...layerBase(ind, `tri-${ind}`, Math.round(layerOpacity * 0.22)),
    shapes: [
      {
        ty: 'gr',
        it: [
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                c: true,
                v: pts,
                i: [
                  [0, 0],
                  [0, 0],
                  [0, 0],
                ],
                o: [
                  [0, 0],
                  [0, 0],
                  [0, 0],
                ],
              },
            },
          },
          {
            ty: 'fl',
            c: { a: 0, k: color },
            o: { a: 0, k: 100 },
          },
          transform(),
        ],
      },
    ],
  };
}

function nodeLayer(ind, [x, y], color, pulse, nodeSize, halo, layerOpacity) {
  const p0 = Math.max(22, Math.round(layerOpacity * 0.45));
  const p1 = Math.min(92, Math.round(layerOpacity * 1.05));
  return {
    ...layerBase(ind, `node-${ind}`, 100),
    ks: {
      o: {
        a: 1,
        k: [
          {
            i: { x: [0.42], y: [1] },
            o: { x: [0.58], y: [0] },
            t: pulse,
            s: [p0],
          },
          {
            i: { x: [0.42], y: [1] },
            o: { x: [0.58], y: [0] },
            t: pulse + 85,
            s: [p1],
          },
          {
            i: { x: [0.42], y: [1] },
            o: { x: [0.58], y: [0] },
            t: pulse + 170,
            s: [p0],
          },
          { t: OP, s: [p0] },
        ],
      },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [x, y, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'gr',
        it: [
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: nodeSize } },
          {
            ty: 'fl',
            c: { a: 0, k: color },
            o: { a: 0, k: 100 },
          },
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: halo } },
          {
            ty: 'st',
            c: { a: 0, k: color },
            o: { a: 0, k: 48 },
            w: { a: 0, k: 0.9 },
            lc: 2,
            lj: 2,
          },
          transform(),
        ],
      },
    ],
  };
}

const outLayers = [];
let ind = 1;

for (const depth of layersDef) {
  const isBack = depth.name === 'back';
  const isFront = depth.name === 'front';

  for (const [ti, tri] of depth.triangles.entries()) {
    const pts = tri.map((ni) => depth.nodes[ni]);
    const color = ti % 2 === 0 ? metalDim : paperDim;
    outLayers.push(triangleLayer(ind++, pts, color, depth.opacity));
  }

  for (const [ei, [ai, bi]] of depth.edges.entries()) {
    const useMetal = isBack ? ei % 4 === 0 : ei % 3 === 0;
    const color = useMetal ? (isFront ? metal : metalDim) : isFront ? paper : paperDim;
    outLayers.push(
      edgeLayer(
        ind++,
        depth.nodes[ai],
        depth.nodes[bi],
        color,
        ei * 9 + (isBack ? 0 : isFront ? 40 : 20),
        depth.stroke,
        depth.opacity,
      ),
    );
  }

  for (const [ni, pos] of depth.nodes.entries()) {
    const useMetal = ni % 5 === 0 || (isFront && ni % 3 === 0);
    const color = useMetal ? metal : paper;
    const pulse = (ni * 17 + (isBack ? 0 : isFront ? 55 : 28)) % (OP - 180);
    outLayers.push(
      nodeLayer(ind++, pos, color, pulse, depth.nodeSize, depth.halo, depth.opacity),
    );
  }
}

const lottie = {
  v: '5.7.4',
  fr: FR,
  ip: 0,
  op: OP,
  w: W,
  h: H,
  nm: 'tech-network-atelier',
  ddd: 0,
  assets: [],
  layers: outLayers.reverse(),
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'bg', 'tech-network.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(lottie));
console.log(
  `wrote ${out} (${fs.statSync(out).size} bytes, ${outLayers.length} layers)`,
);
