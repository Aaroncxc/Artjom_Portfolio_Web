/**
 * One-time setup: Lexsolar Digital Learning Kit → public/projects + posts.json
 * Run: node scripts/setup-lexsolar-project.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'assets/Artjom_LexSolar');
const slug = 'lexsolar-digital-learning-kit';
const destDir = path.join(repoRoot, 'public/projects', slug);
const postsPath = path.join(repoRoot, 'public/posts.json');

const SKIP_MOV =
  'Exercise 9 Behavior of voltage and current in series and parallel connections of solar cells (qualitative).mov';

const VIDEO_MAP = [
  { src: 'whole_exercise01_game_footage.mp4', dest: 'whole-exercise-gameplay.mp4', title: 'Gameplay — full exercise prototype' },
  { src: 'leXsolar_case_footage_01.mp4', dest: 'case-footage.mp4', title: 'Physical learning case — reference footage' },
  { src: 'LeXsolar_UI_examples_updated.mp4', dest: 'ui-examples.mp4', title: 'UI & interaction examples' },
];

const post = {
  id: '24',
  slug,
  title: 'Lexsolar Digital Learning Kit',
  description:
    'Together with Lexsolar, we developed a digital prototype based on their physical solar learning kits. The real kits and components were recreated in Blender and transformed into an interactive browser-based learning experience.',
  date: '2025-05-15',
  tags: ['video', '3D', 'education', 'solar', 'prototype', 'partnership', 'project management'],
  type: 'video',
  thumbnail: `/projects/${slug}/ingame-01.webp`,
  images: [`/projects/${slug}/ingame-01.webp`],
  videoUrl: `/projects/${slug}/whole-exercise-gameplay.webm`,
  tools: [
    { name: 'Blender', icon: '/tool-icons/blender.png' },
    { name: 'Unreal Engine', icon: '/tool-icons/unreal-engine.png' },
  ],
  tile3dBadge: true,
  highlights: [
    'Partner coordination with Lexsolar',
    '1:1 digital recreation of physical kits',
    'Blender asset production',
    'Interactive browser prototype',
    'Solar energy learning experience',
  ],
  explanation: `For the German Academy of Digital Education, we collaborated with Lexsolar to explore how physical solar learning kits could be translated into a digital environment. The original kits — solar modules, measuring devices, cables, plugs, and experiment components — were recreated inhouse as detailed 3D assets in Blender.

Goal: digitally replicate Lexsolar's physical learning case and transfer its experiment logic into an interactive application so learners could use components virtually and understand core solar-energy relationships hands-on.

My role focused on partner communication, strategic preparation, and project coordination. I visited Lexsolar in Dresden several times to understand the product, production environment, and didactic logic behind the kits. Together with Lexsolar, internal departments, experts, and the production team we defined an implementation strategy and kept partner, production, and internal teams aligned through delivery.

The physical cases and components were rebuilt as faithfully as possible in Blender — modules, meters, cabling, power supplies, connectors, experiment boards, and related hardware. From these assets we built a fully playable browser prototype where users explore and try basic solar experiments in a virtual learning space.

Outcome: a completed digital prototype that makes the physical learning system's core experiments tangible online — bridging haptic education hardware and a playable digital learning experience.

Timeline: January–May 2025 — prototype completed.`,
  author: 'AaronCxC',
  gallery: [],
};

async function convertIngameImages() {
  const ingameFiles = fs
    .readdirSync(srcDir)
    .filter((f) => /^DADB_Lexsolar_Ingame_\d+\.jpg$/i.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/(\d+)/)?.[1] ?? 0);
      const nb = Number(b.match(/(\d+)/)?.[1] ?? 0);
      return na - nb;
    });

  for (const file of ingameFiles) {
    const n = file.match(/(\d+)/)?.[1] ?? '0';
    const destName = `ingame-${n.padStart(2, '0')}.webp`;
    const dest = path.join(destDir, destName);
    await sharp(path.join(srcDir, file))
      .rotate()
      .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(dest);
    const stat = fs.statSync(dest);
    console.log(`Image → ${destName} (${Math.round(stat.size / 1024)} KB)`);

    post.gallery.push({
      type: 'image',
      src: `/projects/${slug}/${destName}`,
      title: `In-game prototype — view ${n}`,
      caption: `Screenshot from the interactive Lexsolar browser prototype showing the digital learning kit in use.`,
    });
  }
}

function copyVideos() {
  for (const { src, dest, title } of VIDEO_MAP) {
    const from = path.join(srcDir, src);
    if (!fs.existsSync(from)) {
      console.warn('Missing video:', src);
      continue;
    }
    const to = path.join(destDir, dest);
    console.log(`Copy video ${src} → ${dest} (${Math.round(fs.statSync(from).length / 1024 / 1024)} MB)…`);
    fs.copyFileSync(from, to);
    if (dest !== 'whole-exercise-gameplay.mp4') {
      post.gallery.push({
        type: 'video',
        src: `/projects/${slug}/${dest}`,
        title,
        caption:
          dest === 'case-footage.mp4'
            ? 'Reference footage of the physical Lexsolar learning case used to align the digital recreation.'
            : 'UI and interaction examples from the browser-based solar learning prototype.',
      });
    } else {
      post.mediaCaptions = {
        [`/projects/${slug}/${dest}`]:
          'Full gameplay capture of the browser prototype — virtual solar experiments built from 1:1 Blender recreations of the physical Lexsolar kit.',
      };
    }
  }
}

function copyLogo() {
  const logoSrc = path.join(srcDir, 'logo.svg');
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, path.join(destDir, 'lexsolar-logo.svg'));
    console.log('Copied logo.svg → lexsolar-logo.svg');
  }
}

function updatePostsJson() {
  const data = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  if (data.posts.some((p) => p.slug === slug)) {
    data.posts = data.posts.filter((p) => p.slug !== slug);
    console.log('Replaced existing post:', slug);
  }
  data.posts.unshift(post);
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(postsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log('Updated posts.json (prepended', slug, ')');
}

async function main() {
  if (!fs.existsSync(srcDir)) {
    console.error('Source folder missing:', srcDir);
    process.exit(1);
  }
  fs.mkdirSync(destDir, { recursive: true });

  if (fs.existsSync(path.join(srcDir, SKIP_MOV))) {
    console.log('Skipping oversized .mov (>1.7 GB) — not copied to public/.');
  }

  await convertIngameImages();
  copyVideos();
  copyLogo();
  updatePostsJson();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
