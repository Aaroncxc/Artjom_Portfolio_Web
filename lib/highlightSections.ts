import {
  HIGHLIGHT_PROJECTS,
  ARCHITECTURE_HIGHLIGHT_PROJECTS,
  MULTIKUNST_HIGHLIGHT_PROJECTS,
  SKYHAVEN_HIGHLIGHT_PROJECTS,
  AI_APP_DEV_HIGHLIGHT_PROJECTS,
  type HighlightProject,
} from '@/lib/highlightProjects';

export type HighlightGlowTheme = 'amber' | 'sky' | 'purple' | 'emerald' | 'indigo';

export interface HighlightBentoSectionConfig {
  id: string;
  sectionTitle: string;
  headlineStairs: readonly [string, string, string];
  subtitle: string;
  bodyP1: string;
  bodyP2: string;
  eyebrow?: string;
  projects: HighlightProject[];
  glow: HighlightGlowTheme;
  /** Tailwind classes for the project tile grid (desktop density / column count). */
  gridClass: string;
  /** Per-tile placement within the grid. */
  tileCellClass: (project: HighlightProject) => string;
  backLabel?: string;
  /** Optional compact try-build link shown inline after body copy (keeps layout height flat). */
  tryBuildLink?: { href: string; label: string };
}

const ARCHITECTURE_TILE_CLASS =
  'relative min-h-[176px] col-span-2 sm:min-h-[200px] lg:col-span-1 lg:row-span-2 lg:min-h-0';

export const PRODUCTION_HIGHLIGHT_SECTION: HighlightBentoSectionConfig = {
  id: 'highlights',
  sectionTitle: 'Head of Production at DADB',
  headlineStairs: ['Head of', 'Production', 'at DADB'],
  subtitle: '2021–2025',
  bodyP1:
    'Highlights from leading production at DADB: aligning stakeholders, then guiding 3D, cinematic, XR, and editorial work from brief through release—so narratives stay clear and delivery stays predictable.',
  bodyP2:
    'A core part of the role was guarding on-time releases while several course productions ran in parallel—sequencing priorities, dependencies, and handoffs so timelines stayed credible even when workloads stacked or briefs leaned into XR installs, booth loops, and motion-led modules. Internal tooling for pipeline health and KPIs helped keep that multi-track pressure legible for leadership; a few representative projects below.',
  eyebrow: 'Highlights',
  projects: HIGHLIGHT_PROJECTS,
  glow: 'amber',
  gridClass: 'grid-cols-2 lg:min-h-[560px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-5',
  tileCellClass(project) {
    if (project.span === 'featured') {
      return [
        'relative min-h-[176px]',
        'col-span-2 row-span-1 order-first sm:min-h-[200px]',
        'lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:order-none',
      ].join(' ');
    }
    switch (project.id) {
      case 'lexsolar':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-2 lg:col-start-1 lg:row-start-1 lg:order-none lg:min-h-0';
      case 'kigali':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-3 lg:col-start-2 lg:row-start-1 lg:order-none lg:min-h-0';
      case 'dakar':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-4 lg:col-start-1 lg:row-start-2 lg:order-none lg:min-h-0';
      case 'emobility':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-5 lg:col-start-2 lg:row-start-2 lg:order-none lg:min-h-0';
      default:
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px]';
    }
  },
  backLabel: 'Back to highlights',
};

export const AI_APP_DEV_HIGHLIGHT_SECTION: HighlightBentoSectionConfig = {
  id: 'highlights-ai-apps',
  sectionTitle: 'App Development with AI',
  headlineStairs: ['App Development', 'with AI', ''],
  subtitle: 'DADB production · Personal builds',
  bodyP1:
    'From the start of my production work at DADB, I have pushed AI into how we ship courses — using ElevenLabs, Synthesia, and HeyGen to accelerate voice, presenter, and video pipelines while keeping editorial control in-house.',
  bodyP2:
    'The same mindset runs through private work: Replit for my first project-manager apps, then GPT and Claude in Cursor for dashboards, games, and creative tools. I genuinely enjoy building this way — Skyhaven, Course Overview, FlashR, Multikunst Automation, and Agata Journal below are representative AI-native or AI-accelerated releases.',
  eyebrow: 'AI · Apps',
  projects: AI_APP_DEV_HIGHLIGHT_PROJECTS,
  glow: 'indigo',
  gridClass: 'grid-cols-2 lg:min-h-[560px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-5',
  tileCellClass(project) {
    if (project.span === 'featured') {
      return [
        'relative min-h-[176px]',
        'col-span-2 row-span-1 order-first sm:min-h-[200px]',
        'lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:order-none',
      ].join(' ');
    }
    switch (project.id) {
      case 'course-overview':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-2 lg:col-start-1 lg:row-start-1 lg:order-none lg:min-h-0';
      case 'flasher':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-3 lg:col-start-2 lg:row-start-1 lg:order-none lg:min-h-0';
      case 'multikunst-automation':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-4 lg:col-start-1 lg:row-start-2 lg:order-none lg:min-h-0';
      case 'agata-journal':
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px] order-5 lg:col-start-2 lg:row-start-2 lg:order-none lg:min-h-0';
      default:
        return 'relative min-h-[118px] sm:min-h-[132px] md:min-h-[148px]';
    }
  },
  backLabel: 'Back to AI highlights',
};

export const SKYHAVEN_HIGHLIGHT_SECTION: HighlightBentoSectionConfig = {
  id: 'highlights-skyhaven',
  sectionTitle: 'Skyhaven — Desktop widget game',
  headlineStairs: ['Skyhaven', 'Desktop', 'widget game'],
  subtitle: 'In development',
  bodyP1:
    'Skyhaven is a compact desktop widget game I build alongside client work: a floating isometric island you keep at the edge of your screen while you focus on real tasks. I own art direction, 3D production, and code end to end.',
  bodyP2:
    'The pipeline is deliberately AI-native — sketches and visual rules first, then Meshy for 3D iteration, Cursor for gameplay in React, Three.js, and Tauri 2. Every prop, character, and tile starts from my own look-and-feel before it lands in the engine. The build already covers focus sessions, inventory & equipment, farming, custom island building, profile loadouts, and a playable mining combat slice — with more systems on the way.',
  eyebrow: 'Skyhaven',
  projects: SKYHAVEN_HIGHLIGHT_PROJECTS,
  glow: 'emerald',
  gridClass: 'grid-cols-1 lg:min-h-[280px]',
  tileCellClass: () =>
    'relative min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px]',
  backLabel: 'Back to Skyhaven',
  tryBuildLink: {
    href: 'https://github.com/Aaroncxc/Coincraft_Skyhaven/releases',
    label: 'Try v0.2.0 on GitHub Releases',
  },
};

const MULTIKUNST_TILE_CLASS =
  'relative min-h-[176px] col-span-1 sm:min-h-[200px] lg:min-h-0';

export const MULTIKUNST_HIGHLIGHT_SECTION: HighlightBentoSectionConfig = {
  id: 'highlights-multikunst',
  sectionTitle: 'Multikunst Creative Collective',
  headlineStairs: ['Multikunst', 'Creative', 'Collective'],
  subtitle: 'Since 2023',
  bodyP1:
    'Together with a few friends, I co-founded Multikunst as a creative collective — a shared name for visual experiments, product concepts, and interactive tools we shape as a group rather than solo credits.',
  bodyP2:
    'Since 2023, work under that umbrella spans motion-led product films, 3D object storytelling, and browser-based realtime visuals. Multiply, Multi Watch, and Occupied VFX below are three representative releases from that collective practice.',
  eyebrow: 'Multikunst',
  projects: MULTIKUNST_HIGHLIGHT_PROJECTS,
  glow: 'purple',
  gridClass: 'grid-cols-2 lg:min-h-[420px] lg:grid-cols-3 lg:grid-rows-1 lg:gap-5',
  tileCellClass(project) {
    switch (project.id) {
      case 'multikunst-multiply':
        return `${MULTIKUNST_TILE_CLASS} order-1 lg:col-start-1`;
      case 'multikunst-multiwatch':
        return `${MULTIKUNST_TILE_CLASS} order-2 lg:col-start-2`;
      case 'multikunst-occupied':
        return `${MULTIKUNST_TILE_CLASS} col-span-2 order-3 lg:col-span-1 lg:col-start-3`;
      default:
        return MULTIKUNST_TILE_CLASS;
    }
  },
  backLabel: 'Back to Multikunst highlights',
};

export const ARCHITECTURE_HIGHLIGHT_SECTION: HighlightBentoSectionConfig = {
  id: 'highlights-architecture',
  sectionTitle: 'Architecture & Realtime Pipeline',
  headlineStairs: ['Architecture', '& Realtime', 'Pipeline'],
  subtitle: 'Archicad · Unreal · Twinmotion',
  bodyP1:
    'Trained as an architect, I design spaces in Archicad first—structure, massing, and material logic—then carry them into Unreal Engine as interactive environments people can walk through, not only admire as stills or flythroughs.',
  bodyP2:
    'Twinmotion supports fast cinematic passes along the way; the through-line is the live Archicad ↔ Unreal sync—geometry, light, and navigation kept interactive for stakeholders and learners. The Solar Technician campus and The House show that pipeline at education and residential scale.',
  eyebrow: 'Architecture',
  projects: ARCHITECTURE_HIGHLIGHT_PROJECTS,
  glow: 'sky',
  gridClass: 'grid-cols-2 lg:min-h-[560px] lg:grid-cols-2 lg:grid-rows-2 lg:gap-5',
  tileCellClass: () => ARCHITECTURE_TILE_CLASS,
  backLabel: 'Back to architecture highlights',
};

export const HIGHLIGHT_GLOW_THEMES: Record<
  HighlightGlowTheme,
  { wrapperShadow: string; conicGradient: string; reducedMotionBg: string }
> = {
  amber: {
    wrapperShadow:
      'shadow-[0_0_16px_-16px_rgba(250,204,21,0.22),0_0_0_1px_rgba(250,204,21,0.12)] sm:shadow-[0_0_28px_-12px_rgba(250,204,21,0.28),0_0_0_1px_rgba(250,204,21,0.18)]',
    conicGradient:
      'absolute left-1/2 top-1/2 aspect-square w-auto animate-highlight-bento-glow-spin bg-[conic-gradient(from_0deg,rgba(250,204,21,0)_0deg_282deg,rgba(250,204,21,0.12)_292deg,rgba(254,240,138,0.65)_304deg,rgba(253,224,71,0.88)_312deg,rgba(251,191,36,0.35)_322deg,rgba(250,204,21,0.06)_336deg,rgba(250,204,21,0)_360deg)] min-h-[min(130vw,520px)] h-[185%] sm:min-h-[min(115vw,720px)] sm:h-[220%] md:min-h-[800px]',
    reducedMotionBg:
      'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/[0.06] via-transparent to-amber-200/[0.04] sm:rounded-3xl sm:from-amber-200/[0.07] sm:to-amber-200/[0.05]',
  },
  sky: {
    wrapperShadow:
      'shadow-[0_0_16px_-16px_rgba(125,211,252,0.32),0_0_0_1px_rgba(125,211,252,0.18)] sm:shadow-[0_0_28px_-12px_rgba(56,189,248,0.38),0_0_0_1px_rgba(125,211,252,0.24)]',
    conicGradient:
      'absolute left-1/2 top-1/2 aspect-square w-auto animate-highlight-bento-glow-spin bg-[conic-gradient(from_0deg,rgba(125,211,252,0)_0deg_282deg,rgba(125,211,252,0.16)_292deg,rgba(186,230,253,0.72)_304deg,rgba(56,189,248,0.9)_312deg,rgba(125,211,252,0.42)_322deg,rgba(186,230,253,0.1)_336deg,rgba(125,211,252,0)_360deg)] min-h-[min(130vw,520px)] h-[185%] sm:min-h-[min(115vw,720px)] sm:h-[220%] md:min-h-[800px]',
    reducedMotionBg:
      'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-200/[0.1] via-transparent to-sky-300/[0.07] sm:rounded-3xl sm:from-sky-200/[0.12] sm:to-sky-300/[0.08]',
  },
  purple: {
    wrapperShadow:
      'shadow-[0_0_16px_-16px_rgba(167,139,250,0.34),0_0_0_1px_rgba(167,139,250,0.2)] sm:shadow-[0_0_28px_-12px_rgba(139,92,246,0.42),0_0_0_1px_rgba(167,139,250,0.26)]',
    conicGradient:
      'absolute left-1/2 top-1/2 aspect-square w-auto animate-highlight-bento-glow-spin bg-[conic-gradient(from_0deg,rgba(167,139,250,0)_0deg_282deg,rgba(167,139,250,0.14)_292deg,rgba(196,181,253,0.72)_304deg,rgba(139,92,246,0.92)_312deg,rgba(167,139,250,0.4)_322deg,rgba(196,181,253,0.1)_336deg,rgba(167,139,250,0)_360deg)] min-h-[min(130vw,520px)] h-[185%] sm:min-h-[min(115vw,720px)] sm:h-[220%] md:min-h-[800px]',
    reducedMotionBg:
      'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-200/[0.1] via-transparent to-purple-300/[0.08] sm:rounded-3xl sm:from-violet-200/[0.12] sm:to-purple-300/[0.09]',
  },
  emerald: {
    wrapperShadow:
      'shadow-[0_0_16px_-16px_rgba(52,211,153,0.28),0_0_0_1px_rgba(52,211,153,0.14)] sm:shadow-[0_0_28px_-12px_rgba(16,185,129,0.34),0_0_0_1px_rgba(52,211,153,0.2)]',
    conicGradient:
      'absolute left-1/2 top-1/2 aspect-square w-auto animate-highlight-bento-glow-spin bg-[conic-gradient(from_0deg,rgba(52,211,153,0)_0deg_282deg,rgba(52,211,153,0.12)_292deg,rgba(167,243,208,0.7)_304deg,rgba(16,185,129,0.88)_312deg,rgba(52,211,153,0.38)_322deg,rgba(167,243,208,0.1)_336deg,rgba(52,211,153,0)_360deg)] min-h-[min(130vw,520px)] h-[185%] sm:min-h-[min(115vw,720px)] sm:h-[220%] md:min-h-[800px]',
    reducedMotionBg:
      'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-200/[0.09] via-transparent to-teal-200/[0.07] sm:rounded-3xl sm:from-emerald-200/[0.11] sm:to-teal-200/[0.08]',
  },
  indigo: {
    wrapperShadow:
      'shadow-[0_0_16px_-16px_rgba(99,102,241,0.32),0_0_0_1px_rgba(99,102,241,0.16)] sm:shadow-[0_0_28px_-12px_rgba(79,70,229,0.38),0_0_0_1px_rgba(99,102,241,0.22)]',
    conicGradient:
      'absolute left-1/2 top-1/2 aspect-square w-auto animate-highlight-bento-glow-spin bg-[conic-gradient(from_0deg,rgba(99,102,241,0)_0deg_282deg,rgba(99,102,241,0.14)_292deg,rgba(165,180,252,0.72)_304deg,rgba(79,70,229,0.9)_312deg,rgba(99,102,241,0.4)_322deg,rgba(165,180,252,0.1)_336deg,rgba(99,102,241,0)_360deg)] min-h-[min(130vw,520px)] h-[185%] sm:min-h-[min(115vw,720px)] sm:h-[220%] md:min-h-[800px]',
    reducedMotionBg:
      'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-200/[0.1] via-transparent to-violet-200/[0.08] sm:rounded-3xl sm:from-indigo-200/[0.12] sm:to-violet-200/[0.09]',
  },
};
