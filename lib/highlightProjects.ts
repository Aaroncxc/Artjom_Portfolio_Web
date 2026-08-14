import { DADB_COURSE_OVERVIEW_TOOL_ID, DADB_COURSE_OVERVIEW_TOOL_URL } from '@/lib/toolLinks';

/** Highlight IDs for the bento rail under About (not tied to posts.json schema). */
export type HighlightProjectId =
  | 'lexsolar'
  | 'kigali'
  | 'course-overview'
  | 'dakar'
  | 'emobility'
  | 'solar-tech-campus'
  | 'the-house-highlight'
  | 'multikunst-multiply'
  | 'multikunst-multiwatch'
  | 'multikunst-occupied'
  | 'skyhaven'
  | 'flasher'
  | 'multikunst-automation'
  | 'agata-journal';

export interface HighlightProject {
  id: HighlightProjectId;
  title: string;
  /** Display year span or single year */
  year: string;
  category: string;
  description: string;
  role: string;
  tools: string[];
  thumb?: string;
  /** Looping preview video on the bento tile (autoplay, muted). */
  tileVideo?: string;
  gallery?: string[];
  projectSlug?: string;
  toolDeeplinkId?: string;
  /** External URL — when set the inline detail CTA opens it directly (target=_blank). */
  toolExternalUrl?: string;
  /** Top-left tile chips (immersion / category badges). Rendered with chip classes from `ProjectsGrid`. */
  tileBadges?: Array<'3D' | 'VR' | 'AR' | 'Learning Experience' | 'Tool' | 'Dashboard' | 'Internal' | 'Game'>;
  /** Custom inline detail UI (e.g. Skyhaven asset codex). */
  detailMode?: 'skyhaven';
  /** Long-form copy for the Description tab (when set, used instead of description + role). */
  explanation?: string;
  /** Featured tile: skip white bottom fade (dark video / poster thumbs). */
  tileHideFeaturedFade?: boolean;
  /** Featured tile: light title on dark media instead of dark text + white wash. */
  tileFeaturedLightTitle?: boolean;
  /** Top-left tile chips — neutral (tool names etc.). */
  tileTags?: string[];
  /** Bottom-right status on the tile thumbnail (live URL vs try/test build). */
  tileAvailability?: 'live' | 'test' | 'demo-live';
  /** Show stair-step title on the tile (for normal-span tiles without featured layout). */
  tileShowTitle?: boolean;
  /** Title scale on the tile — `prominent` matches standard bento cells; `featured` for hero tiles. */
  tileTitleSize?: 'prominent' | 'featured';
  span: 'featured' | 'normal';
}

export const HIGHLIGHT_PROJECTS: HighlightProject[] = [
  {
    id: 'lexsolar',
    title: 'Lexsolar Digital Learning Kit',
    year: '2025',
    category: 'Education · XR prototype',
    description:
      'Digital twin of Lexsolar’s physical solar learning cases — Blender assets, UE workflow hooks, and a browser prototype aligning stakeholders on how hands-on labs could scale digitally.',
    role:
      'Production lead from partner workshops through asset scope, prototyping milestones, and cross-team delivery with editorial and SMEs.',
    tools: ['Blender', 'Unreal Engine'],
    thumb: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
    gallery: [
      '/projects/lexsolar-digital-learning-kit/ingame-01.webp',
      '/projects/lexsolar-digital-learning-kit/ingame-03.webp',
      '/projects/lexsolar-digital-learning-kit/ingame-06.webp',
    ],
    projectSlug: 'lexsolar-digital-learning-kit',
    tileTags: ['Blender', 'Unreal Engine'],
    tileBadges: ['3D', 'Learning Experience'],
    span: 'normal',
  },
  {
    id: 'kigali',
    title: 'E-Learning Africa Kigali 2024',
    year: '2024',
    category: 'Trade fair · AR',
    description:
      'Trade-fair demo translating electrical safety and inverter narratives into spatial AR builds — storyboarding, pacing, and on-site rollout with the exhibiting team.',
    role:
      'Head of Production owning booth narrative, XR build coordination with 3D, and stakeholder timelines across rehearsal to live floor.',
    tools: ['Archicad', 'Blender', 'Unreal Engine'],
    thumb: '/projects/elearning-africa-kigali-2024/Kigali_Gameplay_Thumbnail.jpg',
    gallery: ['/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp', '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp'],
    projectSlug: 'elearning-africa-kigali-2024',
    tileTags: ['Blender', 'Unreal Engine'],
    tileBadges: ['Learning Experience', 'AR', '3D'],
    span: 'normal',
  },
  {
    id: 'course-overview',
    title: 'Course Overview Tool',
    year: '2024',
    category: 'Internal tool · Ops',
    description:
      'A live dashboard for course production KPIs — pipeline status, ownership, and risk signals surfaced for management without chasing spreadsheets. Project managers logged status into Excel sheets; the tool synced them every day at 06:00 and 18:00 so team, stakeholders, shareholders and the CEO could watch the entire content pipeline live.',
    role:
      'Product direction, UX iteration with leadership, and production roll-in so teams could rely on one source of truth during delivery.',
    tools: ['React', 'Next.js', 'Tailwind', 'Cursor', 'Excel sync'],
    thumb: '/tools/dadb-course-overview/thumbnail.jpg',
    gallery: [
      '/tools/dadb-course-overview/course-1.jpg',
      '/tools/dadb-course-overview/course-2.jpg',
      '/tools/dadb-course-overview/course-3.jpg',
      '/tools/dadb-course-overview/course-4.jpg',
      '/tools/dadb-course-overview/course-5.jpg',
      '/tools/dadb-course-overview/course-6.jpg',
    ],
    toolDeeplinkId: DADB_COURSE_OVERVIEW_TOOL_ID,
    toolExternalUrl: DADB_COURSE_OVERVIEW_TOOL_URL,
    tileAvailability: 'live',
    tileShowTitle: true,
    tileTitleSize: 'prominent',
    tileTags: ['Cursor', 'Next.js'],
    tileBadges: ['Tool', 'Dashboard'],
    span: 'featured',
  },
  {
    id: 'dakar',
    title: 'E-Learning Africa Dakar 2023',
    year: '2023',
    category: 'Trade fair · VR',
    description:
      'VR pavilion experience unpacking learning modules in an immersive booth loop — choreography of scenes, onboarding flow, and live operator support.',
    role:
      'Production orchestration across 3D cinematics, Unreal deployment, editorial sign-off, and event-day technical readiness.',
    tools: ['Archicad', 'Blender', 'Unreal Engine'],
    thumb: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07-thumb.jpg',
    gallery: [
      '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp',
      '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Visualisation_1.webp',
    ],
    projectSlug: 'elearning-africa-dakar-senegal-2023',
    tileTags: ['Blender', 'Unreal Engine'],
    tileBadges: ['Learning Experience', 'VR', '3D'],
    span: 'normal',
  },
  {
    id: 'emobility',
    title: 'Rekuperation · E‑Mobility Education',
    year: '2024',
    category: 'Education · Animation',
    description:
      'Cinematic explainer on rekuperation in e‑mobility — translating technical scripts into paced 3D storytelling for learners and faculty review.',
    role:
      'Production planning with subject experts, Blender-to-Unreal handoff rhythms, reviews, and sign-off milestones for course integration.',
    tools: ['Blender', 'Unreal Engine'],
    thumb: '/projects/rekuperation-education/rekuperation-edu-video.webp',
    gallery: [
      '/projects/rekuperation-education/rekuperation-edu-video-1.webp',
      '/projects/rekuperation-education/rekuperation-edu-video-2.webp',
    ],
    projectSlug: 'rekuperation-education',
    tileTags: ['Blender', 'Unreal Engine'],
    tileBadges: ['3D'],
    span: 'normal',
  },
];

export const SKYHAVEN_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  {
    id: 'skyhaven',
    title: 'Skyhaven',
    year: '2025–2026',
    category: 'Game · Desktop widget',
    description:
      'Skyhaven is a compact desktop widget game I build alongside client work: a floating isometric island you keep at the edge of your screen while you focus on real tasks. The build already covers focus sessions, inventory & equipment, farming, custom island building, profile loadouts, and a playable mining combat slice.',
    explanation: `Skyhaven is a desktop widget game for Windows and macOS — inspired by the calm of games like Rusty's Retirement, but with clearer action POIs (mine, farm, shrine, tavern) and a stronger sense of place. You run a focus session (30, 60, or 120 minutes) while your character works on the island; when you're done, you collect rewards, materials, and small surprises — without fail-state pressure or click grinding.

Technically it's a Tauri 2 shell around a React 19 UI and a Three.js / React Three Fiber world: data-driven floating islands, day/night lighting, autonomous movement, NPCs, audio (music, ambience, SFX), and persistent local saves.

Already playable in the prototype: focus timer & status UI, HUD and sidebar, inventory & equipment, profile loadout (character preview + slots), daily quests / planner, farming (till, plant, grow, harvest), toolbox build mode on custom home islands (multi-cell footprints, valid/invalid placement), island switching (home, farming, mining layouts), third-person combat on the mining island (enemy robots, telegraphs, block/dodge, hit feedback), character selection, POI interactions, and internal Tile Lab / walk-surface tooling for production.

UI scaffolding, not full gameplay yet: in-game shop listings and the achievements entry (menus exist; economy/trophy logic is still to come).

I designed and integrated the full stack myself — concept, UI, 3D pipeline, and engineering — using ChatGPT and Cursor as accelerators, with every merge reviewed in Git.`,
    role:
      'Art direction, 3D production, and code end to end — sketches and visual rules first, then Meshy for 3D iteration, Cursor for gameplay in React, Three.js, and Tauri 2. Every prop, character, and tile starts from my own look-and-feel before it lands in the engine.',
    tools: ['Tauri', 'React', 'Three.js', 'Meshy', 'Cursor'],
    thumb: '/projects/skyhaven/posters/fullfarming.webp',
    tileVideo: '/projects/skyhaven/tile-preview.mp4',
    tileTags: ['Tauri', 'React', 'Three.js', 'Meshy', 'Cursor'],
    tileBadges: ['Game', '3D'],
    toolExternalUrl: 'https://github.com/Aaroncxc/Coincraft_Skyhaven/releases',
    tileAvailability: 'demo-live',
    tileHideFeaturedFade: true,
    tileFeaturedLightTitle: true,
    span: 'featured',
    detailMode: 'skyhaven',
  },
];

export const ARCHITECTURE_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  {
    id: 'solar-tech-campus',
    title: 'DADB Solar Technician Digital Campus',
    year: '2025',
    category: 'Education · Digital campus',
    description:
      'Archicad campus planning synced into Unreal — lecture rooms, hub, and a gamified solarpark learners navigate as a walkable training world rather than a static course shell.',
    role:
      'Led cross-team delivery and co-designed the campus structure — from Archicad pre-vis and spatial planning through Unreal production, interactive modules, and stakeholder alignment.',
    tools: ['Archicad', 'Unreal Engine', 'Twinmotion'],
    thumb: '/projects/dadb-solar-technician-digital-campus/thumbnail.webp',
    gallery: [
      '/projects/dadb-solar-technician-digital-campus/campus-hero.webp',
      '/projects/dadb-solar-technician-digital-campus/solarpark-manage-01.webp',
      '/projects/dadb-solar-technician-digital-campus/hub-table-01.webp',
    ],
    projectSlug: 'dadb-solar-technician-digital-campus',
    tileTags: ['Archicad', 'Unreal Engine'],
    tileBadges: ['3D', 'Learning Experience'],
    span: 'normal',
  },
  {
    id: 'the-house-highlight',
    title: 'The House',
    year: '2025',
    category: 'Architecture · Cinematic',
    description:
      'Residential architecture authored in Archicad, refined in Unreal — cinematic interior/exterior staging with a live 3D viewer so space, light, and material reads interactively.',
    role:
      'Architectural design through Archicad modelling, Unreal scene assembly, lighting, and realtime presentation — bridging built-form logic with an explorable digital twin.',
    tools: ['Archicad', 'Unreal Engine', 'Twinmotion'],
    thumb: '/projects/the-house/The_House_Thumbnail.png',
    gallery: [
      '/projects/the-house/architecture-enhanced-01.webp',
      '/projects/the-house/architecture-enhanced-02.webp',
      '/projects/the-house/architecture-enhanced-03.webp',
    ],
    projectSlug: 'the-house',
    tileTags: ['Archicad', 'Unreal Engine'],
    tileBadges: ['3D'],
    span: 'normal',
  },
];

export const MULTIKUNST_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  {
    id: 'multikunst-multiply',
    title: 'Multiply',
    year: '2023',
    category: 'Product · Motion',
    description:
      'Conceptual fragrance campaign — industrial precision meets luxury product design, with custom typography and ball-bearing-inspired packaging brought to life in motion.',
    role:
      'Co-created under the Multikunst collective — concept direction, 3D product staging, and cinematic trailer production with the team.',
    tools: ['Blender', 'After Effects'],
    thumb: '/projects/multiply/Thumbnail.png',
    tileVideo: '/projects/multiply/Trailer.webm',
    projectSlug: 'multiply',
    tileTags: ['Blender', 'Motion'],
    tileBadges: ['3D'],
    span: 'normal',
  },
  {
    id: 'multikunst-multiwatch',
    title: 'Multi Watch',
    year: '2023',
    category: 'Product · 3D film',
    description:
      'Wristwatch product film exploring layered dials, materials, and mechanical detail — a Multikunst visual study in precision product storytelling.',
    role:
      'Collective production — 3D modelling, lighting, and edit for a short launch-style product clip.',
    tools: ['Blender', 'After Effects'],
    thumb: '/projects/multi-watch/Thumbnail.png',
    tileVideo: '/projects/multi-watch/Final%20Multiwatch%20Clip.webm',
    projectSlug: 'multi-watch',
    tileTags: ['Blender', '3D'],
    tileBadges: ['3D'],
    span: 'normal',
  },
  {
    id: 'multikunst-occupied',
    title: 'Occupied VFX',
    year: '2024',
    category: 'Tool · Realtime VFX',
    description:
      'Browser-based visual effects engine for real-time creative expression — WebGL2, Three.js, and GLSL routing video, audio, webcam, and 3D through modular GPU effects for VJing and live visuals.',
    role:
      'Built and shipped under Multikunst — product design, shader pipeline, and UI for a live visual instrument used by performers and creative technologists.',
    tools: ['WebGL2', 'Three.js', 'GLSL'],
    thumb: '/tools/occupied/thumbnail.webp',
    tileVideo: '/tools/occupied/trailer.mp4',
    gallery: [
      '/tools/occupied/workspace.webp',
      '/tools/occupied/login.webp',
      '/tools/occupied/screen-2.webp',
      '/tools/occupied/screen-3.webp',
      '/tools/occupied/screen-4.webp',
    ],
    toolDeeplinkId: 'occupied',
    toolExternalUrl: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
    tileAvailability: 'live',
    tileTags: ['Three.js', 'GLSL'],
    tileBadges: ['Tool', '3D'],
    span: 'normal',
  },
];

export const FLASHER_HIGHLIGHT_PROJECT: HighlightProject = {
  id: 'flasher',
  title: 'FlashR',
  year: '2024',
  category: 'iOS · Learning app',
  description:
    'Swift flashcard app for fast, personal study — AI-assisted card generation, swipe sessions, quizzes, folders, and progress stats in a clean mobile UI.',
  role:
    'Solo product design and iOS development — Swift UI, data model, onboarding, and AI workflows for question/answer/explanation cards.',
  tools: ['Swift', 'AI APIs', 'Cursor'],
  thumb: '/tools/flasher/thumbnail.webp',
  gallery: [
    '/tools/flasher/screen-002.webp',
    '/tools/flasher/screen-003.webp',
    '/tools/flasher/screen-004.webp',
  ],
  tileTags: ['Swift', 'AI'],
  tileBadges: ['Tool'],
  span: 'normal',
};

export const AGATA_JOURNAL_HIGHLIGHT_PROJECT: HighlightProject = {
  id: 'agata-journal',
  title: 'Agata Journal',
  year: '2025–2026',
  category: 'iOS · Voice journal',
  description:
    'Private AI journal for iOS — speak a thought, add a note or photo, and Agata turns the day into a readable page with source-aware reflections and patterns over time.',
  explanation: `Agata is a voice-first private journal: capture a moment by speaking, writing, or dropping in an image, then revisit it as a daily page. Reflections stay linked to the notes, recordings, and photos they came from — so the AI companion can talk about your day without inventing it.

The product is local-first. Audio and original journal text stay on device; you choose whether generated wraps, insights, chat, or a profile image sync through Supabase. AI runs through OpenRouter with your own key, plus a separate native admin app for operations.

Built under Multikunst with Sahachat Sonnenburg. Native Swift/SwiftUI, TestFlight beta, and the public site at agatajournal.com.`,
  role:
    'Co-created under Multikunst with Sahachat Sonnenburg — product, visual language, and launch of a voice-first private journal (Speak. Reflect. Grow.).',
  tools: ['Swift', 'SwiftUI', 'OpenRouter', 'Supabase'],
  thumb: '/tools/agata/thumbnail.webp',
  gallery: [
    '/tools/agata/screen-home.webp',
    '/tools/agata/screen-hub.webp',
    '/tools/agata/screen-journal-01.webp',
    '/tools/agata/screen-journal-02.webp',
    '/tools/agata/screen-onboarding.webp',
    '/tools/agata/screen-beta.webp',
  ],
  toolExternalUrl: 'https://www.agatajournal.com/',
  tileAvailability: 'demo-live',
  tileTags: ['Swift', 'OpenRouter'],
  tileBadges: ['Tool'],
  span: 'normal',
};

export const MULTIKUNST_AUTOMATION_HIGHLIGHT_PROJECT: HighlightProject = {
  id: 'multikunst-automation',
  title: 'Multikunst Automation',
  year: '2024',
  category: 'Workflow · Internal platform',
  description:
    'Node-based workflow OS for company automations — connect scripts, web tools, APIs, and LLM steps; inspect runs, save outputs, and extend with new node types over time.',
  role:
    'Designed and built the modular builder under Multikunst — visual graph editor, execution plumbing, and AI hooks for repeatable client tooling.',
  tools: ['React', 'Node.js', 'LLMs', 'Cursor'],
  thumb: '/tools/multikunst-automation/thumbnail.webp',
  gallery: [
    '/tools/multikunst-automation/screen-001.webp',
    '/tools/multikunst-automation/screen-002.webp',
    '/tools/multikunst-automation/screen-003.webp',
    '/tools/multikunst-automation/screen-004.webp',
    '/tools/multikunst-automation/screen-005.webp',
  ],
  tileTags: ['Cursor', 'LLMs'],
  tileBadges: ['Tool', 'Dashboard'],
  span: 'normal',
};

const courseOverviewForAi = HIGHLIGHT_PROJECTS.find((p) => p.id === 'course-overview')!;

export const AI_APP_DEV_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  SKYHAVEN_HIGHLIGHT_PROJECTS[0],
  {
    ...courseOverviewForAi,
    span: 'normal',
    description:
      'Live course-production dashboard — Excel syncs twice daily into KPI views so PMs, stakeholders, and leadership read pipeline health without chasing spreadsheets. Built with AI-assisted iteration in Cursor.',
    tileTags: ['Cursor', 'GPT', 'Next.js'],
  },
  FLASHER_HIGHLIGHT_PROJECT,
  MULTIKUNST_AUTOMATION_HIGHLIGHT_PROJECT,
  AGATA_JOURNAL_HIGHLIGHT_PROJECT,
];

export const ALL_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  ...HIGHLIGHT_PROJECTS,
  ...SKYHAVEN_HIGHLIGHT_PROJECTS,
  ...ARCHITECTURE_HIGHLIGHT_PROJECTS,
  ...MULTIKUNST_HIGHLIGHT_PROJECTS,
  FLASHER_HIGHLIGHT_PROJECT,
  MULTIKUNST_AUTOMATION_HIGHLIGHT_PROJECT,
  AGATA_JOURNAL_HIGHLIGHT_PROJECT,
];

export function highlightById(id: HighlightProjectId | null): HighlightProject | undefined {
  if (!id) return undefined;
  return ALL_HIGHLIGHT_PROJECTS.find((p) => p.id === id);
}
