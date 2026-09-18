import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/contact';
import {
  DADB_COURSE_OVERVIEW_TOOL_URL,
  SKYHAVEN_RELEASES_URL,
  SKYHAVEN_SITE_URL,
} from '@/lib/toolLinks';

export type CareerTrackId = 'elearning' | 'creative' | 'gaming';
export type CareerTrackFilter = 'all' | CareerTrackId;

export const CAREER_TRACK_IDS: CareerTrackId[] = ['elearning', 'creative', 'gaming'];

export function parseTrackParam(value: string | null): CareerTrackFilter {
  if (value === 'elearning' || value === 'creative' || value === 'gaming') return value;
  return 'all';
}

export const CAREER_HERO = {
  eyebrow: 'Production · AI Learning · Realtime',
  title: 'Production & AI Learning Lead',
  lead:
    'I build production systems for interdisciplinary teams — pipeline, staffing, launch — and prototype the AI tooling myself. Recently ~35 people, four sites, six parallel productions.',
  secondary: 'Open to eLearning, creative production, and gaming leadership roles.',
  metrics: [
    { value: '~35', label: 'people' },
    { value: '6', label: 'parallel productions' },
    { value: '4', label: 'sites' },
    { value: '3', label: 'continents' },
  ],
} as const;

export interface CareerStarterPath {
  id: CareerTrackId;
  title: string;
  description: string;
  mailtoSubject: string;
}

export const CAREER_STARTER_PATHS: CareerStarterPath[] = [
  {
    id: 'elearning',
    title: 'Learning / AI Portfolio Lead',
    description:
      'Course production E2E, AI content pipelines, portfolio roadmap, team leadership, and platform launch.',
    mailtoSubject: 'StackFuel / AI Learning — Artjom',
  },
  {
    id: 'creative',
    title: 'Video / Creative Production PM',
    description:
      'Creative ops across editorial, 2D, 3D, post, and XR — stakeholder delivery, capacity, and KPI reporting.',
    mailtoSubject: 'Production PM — Artjom',
  },
  {
    id: 'gaming',
    title: 'Realtime / Gaming systems',
    description:
      'Unreal and product builds as systems proof — games, authoring tools, and AI-native pipelines.',
    mailtoSubject: 'Realtime / Gaming — Artjom',
  },
];

export interface CareerLiveDemo {
  label: string;
  href: string;
  external?: boolean;
  tag?: string;
}

export const CAREER_LIVE_DEMOS: CareerLiveDemo[] = [
  {
    label: 'Course Overview',
    href: DADB_COURSE_OVERVIEW_TOOL_URL,
    external: true,
    tag: 'Live dashboard',
  },
  {
    label: 'Occupied VFX',
    href: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
    external: true,
    tag: 'Try in browser',
  },
  {
    label: 'Skyhaven',
    href: SKYHAVEN_SITE_URL,
    external: true,
    tag: 'Site · Demo',
  },
  {
    label: 'Releases',
    href: SKYHAVEN_RELEASES_URL,
    external: true,
    tag: 'GitHub',
  },
  {
    label: 'Agata Journal',
    href: 'https://www.agatajournal.com/',
    external: true,
    tag: 'Product site',
  },
];

export const CAREER_FEATURED_CASE = {
  id: 'dadb-ops',
  eyebrow: 'Featured · DADB production ops',
  title: 'Weekly KPI reporting & Course Overview Tool',
  outcome:
    'As Head of Production I built weekly reporting so CEO and management see chapters, modules, minutes, and blockers across Editorial, 2D, 3D, and Unreal — Excel data synced twice daily into an AI-assisted Course Overview dashboard.',
  metrics: ['Weekly CEO reports', 'Excel → automated KPIs', '4 departments coordinated'],
  href: '/project/course-overview',
  liveHref: DADB_COURSE_OVERVIEW_TOOL_URL,
  images: [
    {
      src: '/career/dadb-ops/course-overview-snapshot.png',
      alt: 'Course Overview Tool — live pipeline snapshot for DADB courses',
      caption: 'Course Overview Tool — live pipeline snapshot',
    },
    {
      src: '/career/dadb-ops/kpi-report.jpg',
      alt: 'Weekly Highlights KPI report for Editorial, Production, Interactives',
      caption: 'Weekly Highlights — management KPI deck',
    },
  ],
  tags: ['KPI reporting', 'Course Overview', 'Editorial · 2D · 3D · Unreal'],
} as const;

export interface CareerWorkItem {
  id: string;
  title: string;
  outcome: string;
  tags: string[];
  metric?: string;
  href?: string;
  external?: boolean;
  thumb?: string;
  /** Larger hero image when set; falls back to thumb */
  image?: string;
  tracks: CareerTrackId[];
  /** Full-width card in the work grid */
  span?: 'normal' | 'wide';
}

export interface CareerWorkGroup {
  id: string;
  title: string;
  summary?: string;
  tracks: CareerTrackId[];
  items: CareerWorkItem[];
}

/** Selected work — ordered for StackFuel / DemoUp positioning. */
export const CAREER_SELECTED_WORK: CareerWorkGroup[] = [
  {
    id: 'dadb',
    title: 'DADB — Head of Production',
    summary:
      'Built the project-management function from the ground up — priorities, staffing, capacity, dependencies, risk, quality, and executive reporting across international delivery.',
    tracks: ['elearning', 'creative'],
    items: [
      {
        id: 'dadb-leadership',
        title: 'Production leadership at scale',
        outcome:
          'Led ~35 people across Germany, India, and Senegal with six parallel productions spanning editorial, 2D, 3D, cinematic, post-production, XR, and Unreal.',
        tags: ['Leadership', 'eLearning', 'International'],
        metric: '35 people · 6 productions · 4 sites',
        href: '/project/dadb-course-production-trailers',
        thumb: '/projects/dadb-course-production-trailers/e-mobility.webp',
        image: '/projects/dadb-course-production-trailers/hydrogen-technology.webp',
        tracks: ['elearning', 'creative'],
        span: 'wide',
      },
      {
        id: 'dadb-campus',
        title: 'Solar Technician Digital Campus',
        outcome:
          'Immersive walkable campus from Archicad through Unreal — lecture rooms, hub, and gamified solarpark for stakeholder walkthroughs.',
        tags: ['Archicad', 'Unreal', 'Learning'],
        href: '/project/dadb-solar-technician-digital-campus',
        thumb: '/projects/dadb-solar-technician-digital-campus/thumbnail.webp',
        image: '/projects/dadb-solar-technician-digital-campus/campus-hero.webp',
        tracks: ['elearning', 'creative'],
      },
      {
        id: 'dadb-trailers',
        title: 'Course release trailers',
        outcome:
          'Final release trailers for 5G, e-mobility, hydrogen, IoT, solar, and wind — Blender → Unreal pipeline with parallel-track sign-off.',
        tags: ['Blender', 'Unreal', 'Release'],
        href: '/project/dadb-course-production-trailers',
        thumb: '/projects/dadb-course-production-trailers/solar-electricity-systems.webp',
        tracks: ['elearning', 'creative'],
      },
    ],
  },
  {
    id: 'ai-learning',
    title: 'KI / Learning pipeline',
    summary:
      'ElevenLabs, Synthesia, and HeyGen in DADB workflows — voice, presenter, and video pipelines with editorial control in-house.',
    tracks: ['elearning'],
    items: [
      {
        id: 'ai-course-pipeline',
        title: 'AI-accelerated course production',
        outcome:
          'Integrated ElevenLabs, Synthesia, and HeyGen to accelerate voice, presenter, and video pipelines without losing editorial sign-off.',
        tags: ['ElevenLabs', 'Synthesia', 'HeyGen'],
        href: '/project/dadb-course-production-trailers',
        thumb: '/projects/dadb-course-production-trailers/internet-of-things.webp',
        image: '/projects/dadb-course-production-trailers/wind-power.webp',
        tracks: ['elearning'],
        span: 'wide',
      },
      {
        id: 'ai-flasher',
        title: 'FlashR',
        outcome:
          'Swift flashcard app with AI-assisted card generation — learning-product thinking outside client work.',
        tags: ['Swift', 'AI', 'Learning app'],
        href: '/project/flasher',
        thumb: '/tools/flasher/thumbnail.webp',
        tracks: ['elearning'],
      },
    ],
  },
  {
    id: 'craft',
    title: '3D / Realtime craft',
    summary:
      'Blender → Unreal across course work, trade-fair XR, and architecture-realtime — Archicad ↔ Unreal sync for late design changes.',
    tracks: ['creative', 'elearning'],
    items: [
      {
        id: 'craft-kigali',
        title: 'E-Learning Africa Kigali 2024',
        outcome:
          'AR inverter-installation demo for convention floor — booth narrative, build coordination, and live operator support with SMA.',
        tags: ['AR', 'Unreal', 'Trade fair'],
        href: '/project/elearning-africa-kigali-2024',
        thumb: '/projects/elearning-africa-kigali-2024/Kigali_Gameplay_Thumbnail.jpg',
        image: '/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp',
        tracks: ['creative', 'elearning'],
        span: 'wide',
      },
      {
        id: 'craft-lexsolar',
        title: 'Lexsolar Digital Learning Kit',
        outcome:
          'Digital twin of physical solar learning cases — Blender assets and Unity prototype for scalable hands-on labs.',
        tags: ['Blender', 'Unity', 'Prototype'],
        href: '/project/lexsolar-digital-learning-kit',
        thumb: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
        image: '/projects/lexsolar-digital-learning-kit/ingame-01.webp',
        tracks: ['elearning', 'creative'],
      },
      {
        id: 'craft-dakar',
        title: 'E-Learning Africa Dakar 2023',
        outcome:
          'VR pavilion with guided training tasks — Archicad, Blender, and Unreal aligned under trade-fair deadline.',
        tags: ['VR', 'Unreal', 'XR'],
        href: '/project/elearning-africa-dakar-senegal-2023',
        thumb: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07-thumb.jpg',
        image: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp',
        tracks: ['creative', 'elearning'],
      },
      {
        id: 'craft-house',
        title: 'The House',
        outcome:
          'Residential architecture in Archicad refined in Unreal — cinematic staging with live 3D viewer.',
        tags: ['Archicad', 'Unreal', 'Architecture'],
        href: '/project/the-house',
        thumb: '/projects/the-house/The_House_Thumbnail.png',
        image: '/projects/the-house/architecture-enhanced-01.webp',
        tracks: ['creative'],
      },
    ],
  },
  {
    id: 'builds',
    title: 'Build proofs',
    summary:
      'AI-native products — games, tools, and creative releases proving end-to-end delivery beyond client production.',
    tracks: ['gaming', 'creative', 'elearning'],
    items: [
      {
        id: 'build-skyhaven',
        title: 'Skyhaven',
        outcome:
          'Desktop widget game — Tauri 2, React, Three.js, 186 GLB models, focus sessions, arena combat, and island builder. Systems proof, not hobby.',
        tags: ['Game', 'Tauri', 'Three.js'],
        href: SKYHAVEN_SITE_URL,
        external: true,
        thumb: '/projects/skyhaven/posters/fullfarming.webp',
        image: '/projects/skyhaven/posters/fullfarming.webp',
        tracks: ['gaming'],
        span: 'wide',
      },
      {
        id: 'build-occupied',
        title: 'Occupied VFX',
        outcome:
          'Browser-based realtime VFX engine — WebGL2 routing video, audio, and 3D through modular GPU effects.',
        tags: ['WebGL', 'Tool', 'VFX'],
        href: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
        external: true,
        thumb: '/tools/occupied/thumbnail.webp',
        image: '/tools/occupied/workspace.webp',
        tracks: ['creative', 'gaming'],
      },
      {
        id: 'build-vfx-studio',
        title: 'Skyhaven VFX Studio',
        outcome:
          'Combat VFX authoring bound to the game catalog — combo timeline, presets, validated JSON export.',
        tags: ['Tauri', 'R3F', 'Tool'],
        href: '/project/skyhaven-vfx',
        thumb: '/projects/skyhaven-vfx/editor.webp',
        tracks: ['gaming'],
      },
      {
        id: 'build-agata',
        title: 'Agata Journal',
        outcome:
          'Voice-first private AI journal for iOS — local-first capture with OpenRouter reflections, TestFlight beta.',
        tags: ['iOS', 'AI', 'Product'],
        href: 'https://www.agatajournal.com/',
        external: true,
        thumb: '/tools/agata/product-poster.webp',
        tracks: ['elearning', 'creative'],
      },
      {
        id: 'build-automation',
        title: 'Multikunst Automation',
        outcome:
          'Node-based workflow OS — scripts, APIs, and LLM steps with visual graph editor and run inspection.',
        tags: ['Automation', 'LLMs', 'Dashboard'],
        href: '/project/multikunst-automation',
        thumb: '/tools/multikunst-automation/thumbnail.webp',
        tracks: ['elearning', 'creative', 'gaming'],
      },
      {
        id: 'build-multikunst',
        title: 'Multikunst collective',
        outcome: 'Creative collective — visual experiments, product concepts, interactive tools. Separate site.',
        tags: ['Collective', 'Creative'],
        href: 'https://multikunst.vercel.app',
        external: true,
        thumb: '/projects/multiply/Thumbnail.png',
        tracks: ['creative'],
      },
    ],
  },
];

export function filterWorkGroups(
  groups: CareerWorkGroup[],
  track: CareerTrackFilter,
): CareerWorkGroup[] {
  if (track === 'all') return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.tracks.includes(track)),
    }))
    .filter((group) => group.items.length > 0);
}

export interface CareerTimelineEntry {
  role: string;
  org: string;
  period: string;
  location?: string;
  highlight?: boolean;
}

export const CAREER_TIMELINE: CareerTimelineEntry[] = [
  {
    role: 'Creative Director',
    org: 'Multikunst — creative collective',
    period: 'Jan 2026 — present',
    location: 'Berlin',
  },
  {
    role: 'Head of Production',
    org: 'German Academy of Digital Education (DADB)',
    period: 'Jan 2024 — Oct 2025',
    location: 'Berlin · On-site',
    highlight: true,
  },
  {
    role: 'Head of 3D',
    org: 'German Academy of Digital Education (DADB)',
    period: 'Feb 2023 — Jan 2024',
    location: 'Berlin · Hybrid',
  },
  {
    role: 'Mixed Reality Lead',
    org: 'German Academy of Digital Education (DADB)',
    period: 'Jan 2022 — Feb 2023',
    location: 'Berlin',
  },
  {
    role: '3D Environment Artist',
    org: 'German Academy of Digital Education (DADB)',
    period: 'May 2021 — Jan 2022',
    location: 'Berlin',
  },
  {
    role: 'Bachelor of Architecture',
    org: 'Berliner Hochschule für Technik (BHT)',
    period: '2016 — 2020',
    location: 'Berlin',
  },
  {
    role: 'IHK Projektleiter',
    org: 'Certification',
    period: 'Nov 2024',
    highlight: true,
  },
];

export interface CareerStrength {
  name: string;
  highlight?: boolean;
}

export const CAREER_STRENGTHS: CareerStrength[] = [
  { name: 'Team & Delivery Leadership', highlight: true },
  { name: 'Capacity Planning', highlight: true },
  { name: 'Stakeholder & KPI Reporting', highlight: true },
  { name: 'AI-enabled Operations', highlight: true },
  { name: 'Blender' },
  { name: 'Unreal Engine' },
  { name: 'Figma' },
];

export const CAREER_NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Demos', href: '#demos' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export const CAREER_FOOTER = {
  github: 'https://github.com/Aaroncxc',
  multikunst: 'https://multikunst.vercel.app',
  email: CONTACT_EMAIL,
  mailto: CONTACT_MAILTO,
  linkedin: 'https://www.linkedin.com/in/artjom-naninjan-5136b1203',
  skyhavenReleases: SKYHAVEN_RELEASES_URL,
} as const;

/** Top cases for printable one-pager */
export const CAREER_ONE_PAGER_CASES = [
  {
    title: 'DADB Head of Production',
    outcome: '~35 people · 6 parallel productions · 4 sites · weekly CEO KPI reporting',
  },
  {
    title: 'Course Overview Tool',
    outcome: 'Excel → live dashboard · AI-assisted · Editorial / 2D / 3D / Unreal coordination',
  },
  {
    title: 'Skyhaven',
    outcome: 'Tauri desktop game · 186 GLB models · VFX Studio · bilingual public site',
  },
] as const;
