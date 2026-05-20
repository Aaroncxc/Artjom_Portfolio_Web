/**
 * DADB Solar Technician Digital Campus → public/projects + posts.json
 * Run: node scripts/setup-solar-tech-project.mjs
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'assets/DADB_SolarTechPark');
const slug = 'dadb-solar-technician-digital-campus';
const destDir = path.join(repoRoot, 'public/projects', slug);
const postsPath = path.join(repoRoot, 'public/posts.json');

const VP9_CRF = '34';

const IMAGE_MAP = [
  {
    src: 'SolarTech_Thumbnail.png',
    dest: 'thumbnail.webp',
    title: 'Solar Tech Online Park — campus overview',
    caption: 'Aerial view of the DADB Solar Technician digital campus with lecture rooms, hub, and training areas.',
    skipGallery: true,
  },
  {
    src: 'SolarTechnician_UnrealDemo.png',
    dest: 'campus-hero.webp',
    title: 'Digital campus — hero view',
    caption: 'Overview of the Solar Technician digital campus in Unreal Engine.',
  },
  {
    src: 'SolarTech_Manage_Your_SolarPark_1.png',
    dest: 'solarpark-manage-01.webp',
    title: 'Manage your solarpark — overview',
    caption: 'Gamified solarpark management interface where learners place panels and plan installations.',
  },
  {
    src: 'SolarTech_Manage_Your_SolarPark_2.png',
    dest: 'solarpark-manage-02.webp',
    title: 'Manage your solarpark — detail',
    caption: 'Interactive solarpark scene showing components, safety cues, and layout planning.',
  },
  {
    src: 'Table_SolarTech_1.png',
    dest: 'hub-table-01.webp',
    title: 'Campus hub — table view 1',
    caption: 'Central hub table area for social learning and campus navigation.',
  },
  {
    src: 'Table_SolarTech_2.png',
    dest: 'hub-table-02.webp',
    title: 'Campus hub — table view 2',
    caption: 'Hub environment designed as a meeting point inside the virtual campus.',
  },
  {
    src: 'Table_SolarTech_3.png',
    dest: 'hub-table-03.webp',
    title: 'Campus hub — table view 3',
    caption: 'Material and lighting iteration on the campus hub table scene.',
  },
];

const VIDEO_MAP = [
  {
    src: 'SolarTech_DemoTrailer.mp4',
    dest: 'demo-trailer.webm',
    title: 'Demo trailer',
    caption:
      'Trailer showing the Solar Technician digital campus — lecture rooms, hub, training areas, and gamified solarpark interactions.',
    primary: true,
  },
  {
    src: 'SolarTech_Manage_Your_SolarPark_UnrealEngineDEMO.mp4',
    dest: 'solarpark-demo.webm',
    title: 'Manage your solarpark — gameplay',
    caption:
      'In-game capture of the solarpark management exercise — placing panels, understanding components, and learning installation workflows.',
  },
  {
    src: 'SolarTech_Manage_Your_SolarPark_UnrealEngineDEMO_1.mp4',
    dest: 'solarpark-demo-alt.webm',
    title: 'Manage your solarpark — alternate take',
    caption: 'Additional gameplay footage from the solarpark planning and management module.',
  },
  {
    src: 'Hub_Table - Unreal Editor 2024-08-09 17-16-31_1.mp4',
    dest: 'hub-table-editor.webm',
    title: 'Hub table — Unreal Editor capture',
    caption: 'Unreal Editor session documenting the hub table environment setup.',
  },
  {
    src: 'hub_table_ver02_mat_update.mp4',
    dest: 'hub-table-material-update.webm',
    title: 'Hub table — material update',
    caption: 'Material and surface update pass on the campus hub table scene.',
  },
  {
    src: 'SolarTech_Archicad_Footage_1.mp4',
    dest: 'archicad-footage-01.webm',
    title: 'Archicad — campus planning 1',
    caption: 'Archicad pre-visualisation footage used to plan campus spaces and lecture-room layouts.',
  },
  {
    src: 'SolarTech_Archicad_Footage_2.mp4',
    dest: 'archicad-footage-02.webm',
    title: 'Archicad — campus planning 2',
    caption: 'Further Archicad walkthrough of campus structures before Unreal Engine production.',
  },
];

const post = {
  id: '25',
  slug,
  title: 'DADB Solar Technician Digital Campus',
  description:
    'For the German Academy of Digital Education, an immersive digital campus for the Solar Technician program — lecture rooms, a social hub, training areas, and a gamified solarpark where learners explore photovoltaics, installation, maintenance, and health & safety in a walkable 3D world.',
  date: '2026-06-01',
  tags: [
    'video',
    '3D',
    'education',
    'solar',
    'prototype',
    'project management',
    'Learning Experience',
    'gamification',
  ],
  type: 'video',
  thumbnail: `/projects/${slug}/thumbnail.webp`,
  images: [`/projects/${slug}/thumbnail.webp`],
  videoUrl: `/projects/${slug}/demo-trailer.webm`,
  tools: [
    { name: 'Unreal Engine', icon: '/tool-icons/unreal-engine.png' },
    { name: 'Blender', icon: '/tool-icons/blender.png' },
    { name: 'Archicad', icon: '/tool-icons/archicad.png' },
  ],
  tile3dBadge: true,
  highlights: [
    'Immersive digital campus for Solar Technician training',
    'Gamified solarpark planning & management',
    'Cross-team coordination (editorial, 3D, production, partners)',
    'Hub, lecture rooms & interactive learning stations',
    'Partners: SMA, Offenburg & DADB departments',
  ],
  explanation: `For the German Academy of Digital Education, this project is a digital campus for the Solar Technician program — developed together with editorial, production, the 3D/Unreal team, and external partners including SMA and Offenburg.

Goal: introduce the Solar Technician profession through an immersive learning experience. Students arrive in a virtual campus, discover learning zones step by step, and engage with photovoltaics, solarpark setup, installation, maintenance, health & safety, and technical fundamentals — not only as course content but as a spatial, interactive environment.

My role: project lead coordinating editorial, production, 3D/Unreal, subject experts, and external partners. I owned stakeholder communication, content alignment, progress tracking, and cross-team delivery. I also co-conceived and co-designed the online campus — its structure, hub concept, lecture rooms, training areas, and the gamified "manage your solarpark" idea where learners move through the world and learn via interactive tasks.

Implementation: a 3D campus with lecture rooms, a central hub, technical training zones, solarpark scenes, and interactive elements. Learners navigate the space, spend time on-site, and discover content in a realistic setting. A key module lets users place solar panels, understand components, respect safety rules, and learn what matters for day-to-day work as a Solar Technician.

Tools: Unreal Engine, Blender, 3D production, project management, learning experience design, stakeholder communication.

Outcome: a completed digital campus prototype combining virtual classrooms, campus navigation, technical training content, and gamified solarpark interaction into one immersive learning world. Trailer and in-engine footage show students entering the campus, visiting learning stations, grasping PV basics, and experimenting with solarpark setup and operation.

Especially notable: the blend of digital campus design, learning experience design, vocational training, and gamification — a walkable learning world where technical topics become spatial, interactive, and playful, built across multiple internal teams and external partners.

Timeline: June 2026 — prototype completed.`,
  author: 'AaronCxC',
  gallery: [],
  mediaCaptions: {},
};

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function compressImage({ src, dest, title, caption, skipGallery = false }) {
  const from = path.join(srcDir, src);
  const to = path.join(destDir, dest);
  if (!existsSync(from)) {
    console.warn('[skip] missing image:', src);
    return;
  }
  const before = statSync(from).size;
  await sharp(from)
    .rotate()
    .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(to);
  const after = statSync(to).size;
  console.log(`[webp] ${dest}: ${fmtMB(before)} → ${fmtMB(after)}`);
  if (!skipGallery) {
    post.gallery.push({
      type: 'image',
      src: `/projects/${slug}/${dest}`,
      title,
      caption,
    });
  }
}

async function compressVideo({ src, dest, title, caption, primary = false }) {
  if (!ffmpegPath) {
    console.error('ffmpeg-static not available');
    process.exit(1);
  }
  const from = path.join(srcDir, src);
  const to = path.join(destDir, dest);
  if (!existsSync(from)) {
    console.warn('[skip] missing video:', src);
    return;
  }
  if (existsSync(to) && statSync(to).size > 1024 * 1024) {
    console.log(`[skip] ${dest} already exists (${fmtMB(statSync(to).size)})`);
    const publicSrc = `/projects/${slug}/${dest}`;
    if (primary) {
      post.mediaCaptions[publicSrc] = caption;
    } else {
      post.gallery.push({ type: 'video', src: publicSrc, title, caption });
    }
    return;
  }
  if (existsSync(to)) {
    rmSync(to);
  }
  const before = statSync(from).size;
  console.log(`\n[webm] ${src} (${fmtMB(before)}) → ${dest}`);
  const args = [
    '-y',
    '-hide_banner',
    '-i',
    from,
    '-c:v',
    'libvpx-vp9',
    '-crf',
    VP9_CRF,
    '-b:v',
    '0',
    '-row-mt',
    '1',
    '-tile-columns',
    '1',
    '-frame-parallel',
    '0',
    '-threads',
    '4',
    '-deadline',
    'good',
    '-cpu-used',
    '5',
    '-pix_fmt',
    'yuv420p',
    '-vf',
    "fps=30,scale='trunc(min(1920,iw)/2)*2':'trunc(min(1080,ih)/2)*2':flags=lanczos",
    '-c:a',
    'libopus',
    '-b:a',
    '96k',
    '-ar',
    '48000',
    '-ac',
    '2',
    to,
  ];
  const t0 = Date.now();
  await exec(ffmpegPath, args, { maxBuffer: 1024 * 1024 * 64 });
  const after = statSync(to).size;
  console.log(
    `[webm] done ${dest}: ${fmtMB(after)} (${Math.round((after / before) * 100)}% of source, ${((Date.now() - t0) / 1000).toFixed(1)}s)`,
  );
  const publicSrc = `/projects/${slug}/${dest}`;
  if (primary) {
    post.mediaCaptions[publicSrc] = caption;
  } else {
    post.gallery.push({ type: 'video', src: publicSrc, title, caption });
  }
}

function updatePostsJson() {
  const data = JSON.parse(readFileSync(postsPath, 'utf8'));
  if (data.posts.some((p) => p.slug === slug)) {
    data.posts = data.posts.filter((p) => p.slug !== slug);
    console.log('Replaced existing post:', slug);
  }
  data.posts.unshift(post);
  data.lastUpdated = new Date().toISOString();
  writeFileSync(postsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log('Updated posts.json (prepended', slug, ')');
}

async function main() {
  if (!existsSync(srcDir)) {
    console.error('Source folder missing:', srcDir);
    process.exit(1);
  }
  mkdirSync(destDir, { recursive: true });

  for (const entry of IMAGE_MAP) {
    const to = path.join(destDir, entry.dest);
    if (existsSync(to) && statSync(to).size > 0) {
      console.log(`[skip] ${entry.dest} already exists`);
      post.gallery.push({
        type: 'image',
        src: `/projects/${slug}/${entry.dest}`,
        title: entry.title,
        caption: entry.caption,
      });
      continue;
    }
    await compressImage(entry);
  }
  for (const entry of VIDEO_MAP) {
    await compressVideo(entry);
  }
  updatePostsJson();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
