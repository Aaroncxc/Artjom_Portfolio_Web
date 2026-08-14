import type { Project } from '@/lib/types';
import { DADB_COURSE_OVERVIEW_TOOL_URL, SKYHAVEN_RELEASES_URL, SKYHAVEN_SITE_URL } from '@/lib/toolLinks';

/**
 * Tool / game case studies that are not part of `posts.json` (Drive ingest).
 * Served via `/project/[slug]` with the same CaseStudyPage look & feel.
 * Prev/next stays inside this list — never mixed into the main projects grid.
 */
export const TOOL_PROJECTS: Project[] = [
  {
    id: 'course-overview',
    slug: 'course-overview',
    title: 'Course Overview Tool',
    description:
      'A live dashboard for course production KPIs — pipeline status, ownership, and risk signals surfaced for management without chasing spreadsheets.',
    date: '2024-06-01',
    author: 'Artjom N.',
    tools: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Tailwind' },
      { name: 'Cursor' },
      { name: 'Excel sync' },
    ],
    tags: ['Tool', 'Dashboard', 'DADB'],
    type: 'image',
    thumbnail: '/tools/dadb-course-overview/thumbnail.jpg',
    images: [
      '/tools/dadb-course-overview/course-1.jpg',
      '/tools/dadb-course-overview/course-2.jpg',
      '/tools/dadb-course-overview/course-3.jpg',
      '/tools/dadb-course-overview/course-4.jpg',
      '/tools/dadb-course-overview/course-5.jpg',
      '/tools/dadb-course-overview/course-6.jpg',
    ],
    gallery: [
      { type: 'image', src: '/tools/dadb-course-overview/course-1.jpg' },
      { type: 'image', src: '/tools/dadb-course-overview/course-2.jpg' },
      { type: 'image', src: '/tools/dadb-course-overview/course-3.jpg' },
      { type: 'image', src: '/tools/dadb-course-overview/course-4.jpg' },
      { type: 'image', src: '/tools/dadb-course-overview/course-5.jpg' },
      { type: 'image', src: '/tools/dadb-course-overview/course-6.jpg' },
    ],
    order: 1,
    role: 'Product & engineering',
    client: 'DADB · Internal ops',
    timeframe: '2024',
    team: 'Solo build with PM input',
    outcomes: [
      'Synced Excel status sheets twice daily into a live KPI dashboard',
      'Gave PMs, stakeholders, and leadership one source of truth for the content pipeline',
    ],
    explanation:
      'Project managers logged status into Excel sheets; the tool synced them every day at 06:00 and 18:00 so team, stakeholders, shareholders and the CEO could watch the entire content pipeline live.',
    references: [{ url: DADB_COURSE_OVERVIEW_TOOL_URL, label: 'Open live dashboard' }],
    caseSections: [
      {
        heading: 'Brief',
        body: 'Leadership needed **pipeline health without chasing spreadsheets**—courses, modules, workloads, delays, and weekly KPIs in one live view.',
        layout: 'text-left',
      },
      {
        heading: 'Dashboard views',
        body: 'Cursor-assisted Next.js build: status sync, ownership, and risk signals for the full DADB course production pipeline.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/dadb-course-overview/course-1.jpg', title: 'Overview' },
          { kind: 'image', src: '/tools/dadb-course-overview/course-2.jpg', title: 'Pipeline' },
          { kind: 'image', src: '/tools/dadb-course-overview/course-3.jpg', title: 'Modules' },
          { kind: 'image', src: '/tools/dadb-course-overview/course-4.jpg', title: 'Workloads' },
          { kind: 'image', src: '/tools/dadb-course-overview/course-5.jpg', title: 'KPIs' },
          { kind: 'image', src: '/tools/dadb-course-overview/course-6.jpg', title: 'Detail' },
        ],
      },
    ],
  },
  {
    id: 'occupied',
    slug: 'occupied',
    title: 'Occupied VFX',
    description:
      'Browser-based visual effects engine for real-time creative expression — WebGL2, Three.js, and GLSL routing video, audio, webcam, and 3D through modular GPU effects.',
    date: '2024-06-01',
    author: 'Artjom N.',
    tools: [{ name: 'WebGL2' }, { name: 'Three.js' }, { name: 'GLSL' }],
    tags: ['Tool', 'VJing', 'Three.js'],
    type: 'video',
    thumbnail: '/tools/occupied/thumbnail.webp',
    videoUrl: '/tools/occupied/trailer.mp4',
    gallery: [
      { type: 'image', src: '/tools/occupied/workspace.webp' },
      { type: 'image', src: '/tools/occupied/login.webp' },
      { type: 'image', src: '/tools/occupied/screen-2.webp' },
      { type: 'image', src: '/tools/occupied/screen-3.webp' },
      { type: 'image', src: '/tools/occupied/screen-4.webp' },
      { type: 'image', src: '/tools/occupied/screen-5.webp' },
    ],
    order: 2,
    role: 'Product design & shader pipeline',
    client: 'Multikunst',
    timeframe: '2024',
    team: 'Shipped under Multikunst',
    outcomes: [
      'Shipped a real-time VFX instrument in the browser within one month',
      'Reached 40+ users and keeps growing as a live visual tool',
    ],
    explanation:
      'Started as a personal passion project and shipped within one month; a real-time visual instrument for artists, performers, and creative technologists.',
    references: [
      {
        url: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
        label: 'Open Occupied VFX',
      },
    ],
    caseSections: [
      {
        heading: 'Brief',
        body: 'A **browser-based VFX engine**—no heavy install—routing video, audio, webcam, and 3D through modular GPU effects for VJing and live visuals.',
        layout: 'text-left',
      },
      {
        heading: 'Product screens',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/occupied/workspace.webp', title: 'Workspace' },
          { kind: 'image', src: '/tools/occupied/login.webp', title: 'Login' },
          { kind: 'image', src: '/tools/occupied/screen-2.webp', title: 'Effects' },
          { kind: 'image', src: '/tools/occupied/screen-3.webp', title: 'Routing' },
          { kind: 'image', src: '/tools/occupied/screen-4.webp', title: 'Live session' },
          { kind: 'image', src: '/tools/occupied/screen-5.webp', title: 'Output' },
        ],
      },
    ],
  },
  {
    id: 'flasher',
    slug: 'flasher',
    title: 'FlashR',
    description:
      'Swift flashcard app for fast, personal study — AI-assisted card generation, swipe sessions, quizzes, folders, and progress stats in a clean mobile UI.',
    date: '2024-06-01',
    author: 'Artjom N.',
    tools: [{ name: 'Swift' }, { name: 'AI APIs' }, { name: 'Cursor' }],
    tags: ['Tool', 'iOS', 'Learning'],
    type: 'image',
    thumbnail: '/tools/flasher/thumbnail.webp',
    gallery: [
      { type: 'image', src: '/tools/flasher/screen-002.webp' },
      { type: 'image', src: '/tools/flasher/screen-003.webp' },
      { type: 'image', src: '/tools/flasher/screen-004.webp' },
    ],
    order: 3,
    role: 'Solo product & iOS development',
    client: 'Personal',
    timeframe: '2024',
    team: 'Solo',
    outcomes: [
      'Designed and built a native Swift flashcard app end to end',
      'Shipped AI-assisted card generation with swipe study sessions',
    ],
    caseSections: [
      {
        heading: 'Brief',
        body: 'Fast, personal study on iOS—**AI-assisted cards**, swipe sessions, quizzes, and progress without a cluttered study UI.',
        layout: 'text-left',
      },
      {
        heading: 'App screens',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/flasher/screen-002.webp', title: 'Study session' },
          { kind: 'image', src: '/tools/flasher/screen-003.webp', title: 'Cards' },
          { kind: 'image', src: '/tools/flasher/screen-004.webp', title: 'Progress' },
        ],
      },
    ],
  },
  {
    id: 'agata-journal',
    slug: 'agata-journal',
    title: 'Agata Journal',
    description:
      'Private AI journal for iOS — speak a thought, add a note or photo, and Agata turns the day into a readable page with source-aware reflections.',
    date: '2025-06-01',
    author: 'Artjom N.',
    tools: [{ name: 'Swift' }, { name: 'SwiftUI' }, { name: 'OpenRouter' }, { name: 'Supabase' }],
    tags: ['Tool', 'iOS', 'AI'],
    type: 'image',
    thumbnail: '/tools/agata/thumbnail.png',
    gallery: [
      { type: 'image', src: '/tools/agata/screen-home.webp' },
      { type: 'image', src: '/tools/agata/screen-hub.webp' },
      { type: 'image', src: '/tools/agata/screen-journal-01.webp' },
      { type: 'image', src: '/tools/agata/screen-journal-02.webp' },
      { type: 'image', src: '/tools/agata/screen-onboarding.webp' },
      { type: 'image', src: '/tools/agata/screen-beta.webp' },
      { type: 'image', src: '/tools/agata/post-joiniosbeta.png' },
      { type: 'image', src: '/tools/agata/hub-widgets.png' },
    ],
    order: 4,
    role: 'Co-creator · product & visual language',
    client: 'Multikunst',
    timeframe: '2025–2026',
    team: 'Multikunst with Sahachat Sonnenburg',
    outcomes: [
      'Launched a voice-first private journal (Speak. Reflect. Grow.)',
      'Shipped TestFlight beta and public site at agatajournal.com',
    ],
    explanation:
      'Agata is a voice-first private journal: capture a moment by speaking, writing, or dropping in an image, then revisit it as a daily page. Local-first; AI via OpenRouter with your own key.',
    references: [{ url: 'https://www.agatajournal.com/', label: 'agatajournal.com' }],
    caseSections: [
      {
        heading: 'Brief',
        body: 'A **voice-first private journal**—speak, write, or add a photo; Agata turns the day into a readable page with reflections tied to real sources.',
        layout: 'text-left',
      },
      {
        heading: 'Product flow',
        body: 'Home, hub, journal pages, onboarding, and beta invite — native Swift/SwiftUI under Multikunst.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/agata/screen-home.webp', title: 'Home · voice' },
          { kind: 'image', src: '/tools/agata/screen-hub.webp', title: 'Hub' },
          { kind: 'image', src: '/tools/agata/screen-journal-01.webp', title: 'Journal' },
          { kind: 'image', src: '/tools/agata/screen-journal-02.webp', title: 'Entry detail' },
          { kind: 'image', src: '/tools/agata/screen-onboarding.webp', title: 'Onboarding' },
          { kind: 'image', src: '/tools/agata/screen-beta.webp', title: 'Join beta' },
          { kind: 'image', src: '/tools/agata/post-joiniosbeta.png', title: 'iOS beta invite' },
          { kind: 'image', src: '/tools/agata/hub-widgets.png', title: 'Hub widgets' },
        ],
      },
    ],
  },
  {
    id: 'multikunst-automation',
    slug: 'multikunst-automation',
    title: 'Multikunst Automation',
    description:
      'Node-based workflow OS for company automations — connect scripts, web tools, APIs, and LLM steps; inspect runs and extend with new node types.',
    date: '2024-06-01',
    author: 'Artjom N.',
    tools: [{ name: 'React' }, { name: 'Node.js' }, { name: 'LLMs' }, { name: 'Cursor' }],
    tags: ['Tool', 'Dashboard', 'Internal'],
    type: 'image',
    thumbnail: '/tools/multikunst-automation/thumbnail.webp',
    gallery: [
      { type: 'image', src: '/tools/multikunst-automation/screen-001.webp' },
      { type: 'image', src: '/tools/multikunst-automation/screen-002.webp' },
      { type: 'image', src: '/tools/multikunst-automation/screen-003.webp' },
      { type: 'image', src: '/tools/multikunst-automation/screen-004.webp' },
      { type: 'image', src: '/tools/multikunst-automation/screen-005.webp' },
    ],
    order: 5,
    role: 'Design & modular builder',
    client: 'Multikunst',
    timeframe: '2024',
    team: 'Multikunst',
    outcomes: [
      'Built a visual graph editor with execution plumbing for client tooling',
      'Added AI hooks for repeatable automation workflows',
    ],
    caseSections: [
      {
        heading: 'Brief',
        body: 'An internal **workflow OS**—connect scripts, web tools, APIs, and LLM steps; inspect runs and grow the node library over time.',
        layout: 'text-left',
      },
      {
        heading: 'Builder screens',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/multikunst-automation/screen-001.webp', title: 'Graph editor' },
          { kind: 'image', src: '/tools/multikunst-automation/screen-002.webp', title: 'Nodes' },
          { kind: 'image', src: '/tools/multikunst-automation/screen-003.webp', title: 'Run inspect' },
          { kind: 'image', src: '/tools/multikunst-automation/screen-004.webp', title: 'Outputs' },
          { kind: 'image', src: '/tools/multikunst-automation/screen-005.webp', title: 'Extensions' },
        ],
      },
    ],
  },
  {
    id: 'skyhaven',
    slug: 'skyhaven',
    title: 'Skyhaven',
    description:
      'A compact desktop widget game — a floating isometric island at the edge of your screen while you focus: focus sessions, inventory, farming, island building, and a playable mining combat slice. The public site (arena roster, 3D inspector, wiki, downloads) is part of the same project.',
    date: '2025-06-01',
    author: 'Artjom N.',
    tools: [
      { name: 'Tauri' },
      { name: 'React' },
      { name: 'Three.js' },
      { name: 'Next.js' },
      { name: 'Meshy' },
      { name: 'Cursor' },
    ],
    tags: ['Game', '3D', 'Desktop'],
    type: 'video',
    thumbnail: '/projects/skyhaven/posters/fullfarming.webp',
    videoUrl: '/projects/skyhaven/tile-preview.mp4',
    order: 6,
    role: 'Art direction, 3D & code end to end',
    client: 'Personal · side project',
    timeframe: '2025–2026',
    team: 'Solo',
    outcomes: [
      'Shipped a Tauri 2 + React + Three.js desktop widget prototype',
      'Playable focus timer, farming, build mode, and mining combat slice',
      'Designed and shipped the public Skyhaven site — arena roster, 3D inspector, wiki, and launcher downloads',
    ],
    explanation: `Skyhaven is a desktop widget game for Windows and macOS — inspired by the calm of games like Rusty's Retirement, but with clearer action POIs and a stronger sense of place.

Technically it's a Tauri 2 shell around a React 19 UI and a Three.js / React Three Fiber world. Already playable: focus timer, inventory & equipment, farming, toolbox build mode, island switching, and third-person combat on the mining island.

The public website is part of the same build: bilingual landing page, arena roster with an in-browser 3D inspector for real game models, build-mode loop, wiki, FAQ, and Windows / macOS downloads.`,
    references: [
      {
        url: SKYHAVEN_SITE_URL,
        label: 'Open the Skyhaven website',
      },
      {
        url: SKYHAVEN_RELEASES_URL,
        label: 'Try on GitHub Releases',
      },
    ],
    caseSections: [
      {
        heading: 'Brief',
        body: 'A calm **desktop widget game**—focus sessions while your character works on a floating island, without fail-state pressure. The public site is the same project, not a separate case study.',
        layout: 'text-left',
      },
    ],
  },
  {
    id: 'coincraft',
    slug: 'coincraft',
    title: 'CoinCraft',
    description:
      'A colorful match-3 puzzle game with addictive gameplay mechanics. Combine coins, unlock power-ups, and climb the leaderboards.',
    date: '2024-06-01',
    author: 'Artjom N.',
    tools: [{ name: 'Web' }, { name: 'Game' }],
    tags: ['Multikunst', 'game', 'puzzle'],
    type: 'image',
    thumbnail: '/tools/coincraft-thumb.png',
    images: ['/tools/coincraft-thumb.png'],
    gallery: [{ type: 'image', src: '/tools/coincraft-thumb.png' }],
    order: 7,
    role: 'Game production',
    client: 'Multikunst',
    timeframe: '2024',
    team: 'Multikunst',
    outcomes: ['Shipped a playable match-3 puzzle with leaderboards'],
    references: [
      { url: 'https://coincraft-main.vercel.app', label: 'Play CoinCraft' },
    ],
    caseSections: [
      {
        heading: 'Brief & result',
        body: 'A colorful **match-3** under Multikunst—combine coins, unlock power-ups, and climb the leaderboards. Open the live build to play.',
        layout: 'text-left',
      },
    ],
  },
  {
    id: 'ryuk-pp',
    slug: 'ryuk-pp',
    title: 'Ryuk PP',
    description:
      'A pixel-art 2D platformer built with Godot. Run, jump and collect bones while exploring hand-crafted levels.',
    date: '2024-06-01',
    author: 'oxxupe',
    tools: [{ name: 'Godot' }],
    tags: ['game', 'platformer', 'pixel-art', 'godot'],
    type: 'html',
    thumbnail: '/tools/ryuk-pp/thumbnail.png',
    htmlPath: '/tools/ryuk-pp/index.html',
    images: ['/tools/ryuk-pp/thumbnail.png'],
    order: 8,
    role: 'Collaboration · game',
    client: 'oxxupe',
    timeframe: '2024',
    team: 'Collaboration',
    outcomes: ['Shipped a browser-playable Godot platformer slice'],
    caseSections: [
      {
        heading: 'Brief',
        body: 'A **pixel-art platformer**—run, jump, collect bones. Playable in the browser via the embedded Godot build.',
        layout: 'text-left',
      },
      {
        heading: 'Play in browser',
        layout: 'live-embed',
        media: [
          {
            kind: 'html',
            src: '/tools/ryuk-pp/index.html',
            title: 'Ryuk PP',
            caption: 'Use WASD or arrow keys.',
          },
        ],
      },
    ],
  },
];

export function getToolProjectBySlug(slug: string): Project | undefined {
  return TOOL_PROJECTS.find((p) => p.slug === slug);
}

export function getSortedToolProjects(): Project[] {
  return [...TOOL_PROJECTS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Map ToolsGamesGrid tile ids → case-study slugs. */
export const TOOL_GRID_ID_TO_SLUG: Record<string, string> = {
  'dadb-course-overview': 'course-overview',
  occupied: 'occupied',
  coincraft: 'coincraft',
  'ryuk-pp': 'ryuk-pp',
};

export function toolGridIdToCaseSlug(toolId: string): string {
  return TOOL_GRID_ID_TO_SLUG[toolId] ?? toolId;
}
