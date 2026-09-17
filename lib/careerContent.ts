import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/contact';
import {
  DADB_COURSE_OVERVIEW_TOOL_URL,
  SKYHAVEN_RELEASES_URL,
  SKYHAVEN_SITE_URL,
} from '@/lib/toolLinks';

export const CAREER_HERO = {
  eyebrow: 'Production · AI Learning · Realtime',
  title: 'Production & AI Learning Lead',
  lead:
    'I build the production systems that help interdisciplinary teams ship ambitious learning and digital work — from pipeline and staffing to launch. I also prototype the AI tooling myself. Most recently I led ~35 people across four sites and six parallel productions spanning editorial, 2D, 3D, post-production, XR and Unreal.',
  secondary: 'Open to eLearning, creative production, and gaming leadership roles.',
  metrics: [
    { value: '~35', label: 'people' },
    { value: '6', label: 'parallel productions' },
    { value: '4', label: 'sites' },
    { value: '3', label: 'continents' },
  ],
} as const;

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'elearning',
    title: 'eLearning',
    description:
      'Course and learning production end-to-end — AI content pipelines, portfolio and roadmap ownership, team leadership, and platform launch.',
    tags: ['Production', 'AI pipeline', 'Launch'],
  },
  {
    id: 'creative',
    title: 'Creative',
    description:
      'Creative operations and 3D / AR / video production leadership — stakeholder delivery, capacity planning, and quality across disciplines.',
    tags: ['Creative ops', '3D · AR · Video', 'Delivery'],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    description:
      'Realtime and Unreal product builds as systems proof — desktop games, authoring tools, and AI-native pipelines, not hobby marketing.',
    tags: ['Unreal', 'Realtime', 'Product builds'],
  },
];

export interface CareerWorkItem {
  title: string;
  outcome: string;
  tags: string[];
  metric?: string;
  href?: string;
  external?: boolean;
  thumb?: string;
}

export interface CareerWorkGroup {
  id: string;
  title: string;
  summary?: string;
  items: CareerWorkItem[];
}

/** Selected work — ordered for StackFuel / DemoUp positioning. */
export const CAREER_SELECTED_WORK: CareerWorkGroup[] = [
  {
    id: 'dadb',
    title: 'DADB — Head of Production',
    summary:
      'Built the project-management function from the ground up and owned priorities, staffing, capacity, dependencies, risk, quality, and executive reporting across international delivery.',
    items: [
      {
        title: 'Production leadership at scale',
        outcome:
          'Led ~35 people across Germany, India, and Senegal with six parallel productions spanning editorial, 2D, 3D, cinematic, post-production, XR, and Unreal.',
        tags: ['Leadership', 'eLearning', 'International'],
        metric: '35 people · 6 productions · 4 sites',
        href: '/project/dadb-course-production-trailers',
        thumb: '/projects/dadb-course-production-trailers/e-mobility.webp',
      },
      {
        title: 'Course Overview Tool',
        outcome:
          'Live production dashboard syncing Excel status sheets twice daily — one reliable view of pipeline health for teams, PMs, and leadership.',
        tags: ['Dashboard', 'KPI', 'Ops'],
        href: '/project/course-overview',
        thumb: '/tools/dadb-course-overview/thumbnail.jpg',
      },
      {
        title: 'Solar Technician Digital Campus',
        outcome:
          'Immersive walkable campus from Archicad planning through Unreal — lecture rooms, hub, and gamified solarpark for stakeholder walkthroughs.',
        tags: ['Archicad', 'Unreal', 'Learning'],
        href: '/project/dadb-solar-technician-digital-campus',
        thumb: '/projects/dadb-solar-technician-digital-campus/thumbnail.webp',
      },
    ],
  },
  {
    id: 'ai-learning',
    title: 'KI / Learning pipeline',
    summary:
      'Pushed AI into how courses ship — ElevenLabs, Synthesia, and HeyGen for voice, presenter, and video pipelines while keeping editorial control in-house.',
    items: [
      {
        title: 'AI-accelerated course production',
        outcome:
          'Integrated ElevenLabs, Synthesia, and HeyGen into DADB workflows to accelerate voice, presenter, and video pipelines without losing editorial sign-off.',
        tags: ['ElevenLabs', 'Synthesia', 'HeyGen'],
        href: '/project/dadb-course-production-trailers',
        thumb: '/projects/dadb-course-production-trailers/hydrogen-technology.webp',
      },
      {
        title: 'Course Overview Tool',
        outcome:
          'AI-assisted dashboard design and iteration — built with Cursor and Next.js for daily production visibility.',
        tags: ['Cursor', 'Next.js', 'Internal ops'],
        href: DADB_COURSE_OVERVIEW_TOOL_URL,
        external: true,
        thumb: '/tools/dadb-course-overview/course-1.jpg',
      },
      {
        title: 'FlashR',
        outcome:
          'Swift flashcard app with AI-assisted card generation — personal proof of learning-product thinking outside client work.',
        tags: ['Swift', 'AI', 'Learning app'],
        href: '/project/flasher',
        thumb: '/tools/flasher/thumbnail.webp',
      },
    ],
  },
  {
    id: 'craft',
    title: '3D / Realtime craft',
    summary:
      'Blender → Unreal pipeline across DADB course work, trade-fair XR, and architecture-realtime hybrids — Archicad ↔ Unreal sync for late design changes.',
    items: [
      {
        title: 'Lexsolar Digital Learning Kit',
        outcome:
          'Digital twin of physical solar learning cases — Blender assets and Unity prototype aligning SMEs on scalable hands-on labs.',
        tags: ['Blender', 'Unity', 'Prototype'],
        href: '/project/lexsolar-digital-learning-kit',
        thumb: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
      },
      {
        title: 'E-Learning Africa Kigali 2024',
        outcome:
          'AR inverter-installation demo for convention floor — booth narrative, build coordination, and live operator support.',
        tags: ['AR', 'Unreal', 'Trade fair'],
        href: '/project/elearning-africa-kigali-2024',
        thumb: '/projects/elearning-africa-kigali-2024/Kigali_Gameplay_Thumbnail.jpg',
      },
      {
        title: 'E-Learning Africa Dakar 2023',
        outcome:
          'VR pavilion experience with guided training tasks — Mixed Reality Lead aligning Archicad, Blender, and Unreal under fair deadline.',
        tags: ['VR', 'Unreal', 'XR'],
        href: '/project/elearning-africa-dakar-senegal-2023',
        thumb: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07-thumb.jpg',
      },
      {
        title: 'The House',
        outcome:
          'Residential architecture in Archicad refined in Unreal — cinematic staging with live 3D viewer for spatial reads.',
        tags: ['Archicad', 'Unreal', 'Architecture'],
        href: '/project/the-house',
        thumb: '/projects/the-house/The_House_Thumbnail.png',
      },
    ],
  },
  {
    id: 'builds',
    title: 'Build proofs',
    summary:
      'AI-native and AI-accelerated products — games, tools, and creative releases that prove end-to-end delivery beyond client production.',
    items: [
      {
        title: 'Multikunst collective',
        outcome:
          'Creative collective for visual experiments, product concepts, and interactive tools — separate site, linked quietly.',
        tags: ['Collective', 'Creative'],
        href: 'https://multikunst.vercel.app',
        external: true,
        thumb: '/projects/multiply/Thumbnail.png',
      },
      {
        title: 'Skyhaven',
        outcome:
          'Desktop widget game — Tauri 2, React, Three.js, 186 GLB models, focus sessions, arena combat, and island builder.',
        tags: ['Game', 'Tauri', 'Three.js'],
        href: SKYHAVEN_SITE_URL,
        external: true,
        thumb: '/projects/skyhaven/posters/fullfarming.webp',
      },
      {
        title: 'Occupied VFX',
        outcome:
          'Browser-based realtime VFX engine — WebGL2 routing video, audio, and 3D through modular GPU effects for live visuals.',
        tags: ['WebGL', 'Tool', 'VFX'],
        href: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
        external: true,
        thumb: '/tools/occupied/thumbnail.webp',
      },
      {
        title: 'Agata Journal',
        outcome:
          'Voice-first private AI journal for iOS — local-first capture with OpenRouter reflections and TestFlight beta.',
        tags: ['iOS', 'AI', 'Product'],
        href: 'https://www.agatajournal.com/',
        external: true,
        thumb: '/tools/agata/product-poster.webp',
      },
      {
        title: 'Multikunst Automation',
        outcome:
          'Node-based workflow OS — connect scripts, APIs, and LLM steps with visual graph editor and run inspection.',
        tags: ['Automation', 'LLMs', 'Dashboard'],
        href: '/project/multikunst-automation',
        thumb: '/tools/multikunst-automation/thumbnail.webp',
      },
      {
        title: 'Skyhaven VFX Studio',
        outcome:
          'Combat VFX authoring tool bound to the game catalog — combo timeline, presets, and validated JSON export.',
        tags: ['Tauri', 'R3F', 'Tool'],
        href: '/project/skyhaven-vfx',
        thumb: '/projects/skyhaven-vfx/editor.webp',
      },
    ],
  },
];

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
  { label: 'Tracks', href: '#tracks' },
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
