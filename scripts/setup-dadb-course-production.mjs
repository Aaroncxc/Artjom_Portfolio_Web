/**
 * DADB Course Production — released course trailers → public/projects + posts.json
 * Run: node scripts/setup-dadb-course-production.mjs
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
const srcDir = path.join(repoRoot, 'assets/DADB_CourseProducttion');
const slug = 'dadb-course-production-trailers';
const destDir = path.join(repoRoot, 'public/projects', slug);
const postsPath = path.join(repoRoot, 'public/posts.json');

const VP9_CRF = '34';

const COURSE_TRAILERS = [
  {
    src: '001-5g-communication-technology.mp4',
    dest: '5g-communication-technology.webm',
    poster: '5g-communication-technology.webp',
    title: '5G Communication Technology',
    caption:
      'Final release trailer for the 5G Communication Technology course — produced for DADB’s digital learning platform and partner universities in India.',
  },
  {
    src: '002-e-mobility.mp4',
    dest: 'e-mobility.webm',
    poster: 'e-mobility.webp',
    title: 'E-Mobility',
    caption:
      'Course trailer for E-Mobility — one of the completed DADB productions released during my tenure as Head of Production.',
  },
  {
    src: '003-hydrogen-technology.mp4',
    dest: 'hydrogen-technology.webm',
    poster: 'hydrogen-technology.webp',
    title: 'Hydrogen Technology',
    caption:
      'Final trailer for the Hydrogen Technology course, delivered for platform rollout and university partnerships.',
  },
  {
    src: '004-internet-of-things.mp4',
    dest: 'internet-of-things.webm',
    poster: 'internet-of-things.webp',
    title: 'Internet of Things',
    caption:
      'Release trailer for the Internet of Things course — editorial, 3D, and post-production coordinated through DADB production.',
  },
  {
    src: '005-solar-electricity-systems.mp4',
    dest: 'solar-electricity-systems.webm',
    poster: 'solar-electricity-systems.webp',
    title: 'Solar Electricity Systems',
    caption:
      'Trailer for Solar Electricity Systems — part of the renewable-energy course portfolio shipped to DADB’s learning platform.',
  },
  {
    src: '006-wind-power.mp4',
    dest: 'wind-power.webm',
    poster: 'wind-power.webp',
    title: 'Wind Power',
    caption:
      'Final trailer for the Wind Power course — completed and released alongside other DADB India elective offerings.',
  },
];

const post = {
  id: '26',
  slug,
  title: 'DADB Course Production — Released Course Trailers',
  description:
    'Final release trailers for DADB courses completed and shipped during my time as Head of Production at the German Academy of Digital Education — published on DADB’s own platform and offered as elective modules at partner universities in Hyderabad, Bangalore, and Mumbai.',
  date: '2025-06-01',
  tags: [
    'video',
    'education',
    'project management',
    'Learning Experience',
    'India',
    'course production',
  ],
  type: 'video',
  thumbnail: `/projects/${slug}/thumbnail.webp`,
  images: [`/projects/${slug}/thumbnail.webp`],
  videoUrl: `/projects/${slug}/5g-communication-technology.webm`,
  tools: [
    { name: 'Blender', icon: '/tool-icons/blender.png' },
    { name: 'Unreal Engine', icon: '/tool-icons/unreal-engine.png' },
  ],
  tile3dBadge: true,
  highlights: [
    'Head of Production — course delivery & release',
    'Six completed courses shipped to platform',
    'Elective modules at Indian partner universities',
    'Hyderabad · Bangalore · Mumbai partnerships',
    'Cross-team editorial, 3D & post-production',
  ],
  explanation: `During my tenure as Head of Production at the German Academy of Digital Education (DADB), I led the end-to-end delivery of multiple digital learning courses — from production planning and cross-team coordination through final editorial sign-off and platform release.

This project collects the final release trailers for courses we were able to complete and publish on DADB’s own learning platform. Beyond internal rollout, several of these courses were offered as elective modules at partner universities in India — including institutions in Hyderabad, Bangalore, and Mumbai — extending DADB’s technical education portfolio into international academic partnerships.

My role: Head of Production owning pipeline status, stakeholder alignment, milestone tracking, and handoff to platform release. I coordinated editorial, 3D, animation, post-production, and subject-matter review so each course could move from script and asset production to a polished, learner-ready module with a cinematic trailer for marketing and onboarding.

The trailers shown here represent completed releases across topics including 5G communication technology, e-mobility, hydrogen technology, Internet of Things, solar electricity systems, and wind power — reflecting the breadth of DADB’s renewable-energy and digital-technology curriculum during this production cycle.

Tools & workflow: Blender and Unreal Engine for 3D and cinematic content, production management across internal teams, and close collaboration with editorial and university partners for India elective rollout.

Outcome: six course trailers documenting shipped modules — each marking a course that moved from production through QA to live availability on DADB’s platform and, where applicable, elective enrollment at Indian partner universities.`,
  author: 'AaronCxC',
  gallery: [],
  mediaCaptions: {},
};

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function extractPoster({ src, dest, title, caption }) {
  if (!ffmpegPath) {
    console.error('ffmpeg-static not available');
    process.exit(1);
  }
  const from = path.join(srcDir, src);
  const to = path.join(destDir, dest);
  if (!existsSync(from)) {
    console.warn('[skip] missing video for poster:', src);
    return;
  }
  if (existsSync(to) && statSync(to).size > 4096) {
    console.log(`[skip] poster ${dest} exists`);
    post.gallery.push({
      type: 'image',
      src: `/projects/${slug}/${dest}`,
      title: `${title} — key frame`,
      caption,
    });
    return;
  }
  const tmpPng = path.join(destDir, `.tmp-${dest}.png`);
  await exec(ffmpegPath, [
    '-y',
    '-hide_banner',
    '-ss',
    '2',
    '-i',
    from,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    tmpPng,
  ]);
  await sharp(tmpPng)
    .rotate()
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(to);
  rmSync(tmpPng, { force: true });
  console.log(`[poster] ${dest}`);
  post.gallery.push({
    type: 'image',
    src: `/projects/${slug}/${dest}`,
    title: `${title} — key frame`,
    caption,
  });
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
  const publicSrc = `/projects/${slug}/${dest}`;
  if (existsSync(to) && statSync(to).size > 1024 * 1024) {
    console.log(`[skip] ${dest} already exists (${fmtMB(statSync(to).size)})`);
    if (primary) {
      post.mediaCaptions[publicSrc] = caption;
    } else {
      post.gallery.push({ type: 'video', src: publicSrc, title, caption });
    }
    return;
  }
  if (existsSync(to)) rmSync(to);
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
    `[webm] done ${dest}: ${fmtMB(after)} (${Math.round((after / before) * 100)}%, ${((Date.now() - t0) / 1000).toFixed(1)}s)`,
  );
  if (primary) {
    post.mediaCaptions[publicSrc] = caption;
  } else {
    post.gallery.push({ type: 'video', src: publicSrc, title, caption });
  }
}

async function buildThumbnail() {
  const srcPoster = path.join(destDir, COURSE_TRAILERS[0].poster);
  const thumb = path.join(destDir, 'thumbnail.webp');
  if (!existsSync(srcPoster)) {
    console.warn('[skip] thumbnail — poster missing');
    return;
  }
  await sharp(srcPoster)
    .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(thumb);
  console.log(`[thumb] thumbnail.webp (${fmtMB(statSync(thumb).size)})`);
}

function reorderGallery() {
  const order = [];
  for (const course of COURSE_TRAILERS) {
    order.push(course.poster, course.dest);
  }
  const byFile = Object.fromEntries(post.gallery.map((g) => [g.src.split('/').pop(), g]));
  post.gallery = order.map((f) => byFile[f]).filter(Boolean);
}

function updatePostsJson() {
  const data = JSON.parse(readFileSync(postsPath, 'utf8'));
  if (data.posts.some((p) => p.slug === slug)) {
    data.posts = data.posts.filter((p) => p.slug !== slug);
  }
  data.posts.unshift(post);
  data.lastUpdated = new Date().toISOString();
  writeFileSync(postsPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`\n[posts.json] prepended "${slug}" (id ${post.id})`);
}

async function main() {
  mkdirSync(destDir, { recursive: true });
  post.gallery = [];
  post.mediaCaptions = {};

  for (const course of COURSE_TRAILERS) {
    await extractPoster({
      src: course.src,
      dest: course.poster,
      title: course.title,
      caption: course.caption,
    });
  }

  for (const course of COURSE_TRAILERS) {
    await compressVideo({ ...course, primary: false });
  }
  post.mediaCaptions[post.videoUrl] = COURSE_TRAILERS[0].caption;

  await buildThumbnail();
  reorderGallery();
  updatePostsJson();

  const total = [...COURSE_TRAILERS.map((c) => c.dest), 'thumbnail.webp', ...COURSE_TRAILERS.map((c) => c.poster)]
    .map((f) => path.join(destDir, f))
    .filter(existsSync)
    .reduce((sum, f) => sum + statSync(f).size, 0);
  console.log(`\nDone. ${COURSE_TRAILERS.length} trailers → public/projects/${slug}/ (${fmtMB(total)} total)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
