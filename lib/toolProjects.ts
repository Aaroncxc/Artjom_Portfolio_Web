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
        heading: 'What it is',
        body: `At DADB, course production ran across many Excel sheets — status, owners, delays, weekly KPIs. Leadership and PMs needed **one live view** of pipeline health without chasing files or pinging people for updates.

The Course Overview Tool is that view: a Next.js dashboard that pulls the sheets twice a day and turns them into overview, pipeline, module, workload, and KPI screens stakeholders can open in a browser.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/dadb-course-overview/course-1.jpg',
            title: 'Overview',
            caption: 'Pipeline health at a glance.',
          },
        ],
      },
      {
        heading: 'Why Excel stayed the source',
        body: `Project managers already lived in Excel. Replacing that habit would have slowed the team. The product decision was to **keep Excel as the authoring surface** and treat the dashboard as the read model for everyone else — team, stakeholders, shareholders, and the CEO.

Sync runs at **06:00 and 18:00**. That cadence was enough for leadership reviews without turning the build into a realtime collaboration product.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/dadb-course-overview/course-2.jpg',
            title: 'Pipeline',
            caption: 'Ownership and status across the content pipeline.',
          },
        ],
      },
      {
        heading: 'How it was built',
        body: `Solo product and engineering with PM input: React, Next.js, Tailwind, and Cursor for fast UI iteration. The hard part was not the charting — it was **mapping messy sheet columns** into stable KPI language so risk and delay signals stayed trustworthy week after week.

Views cover overview, pipeline, modules, workloads, and detail drill-downs so different audiences can land on the same numbers without a new export.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/dadb-course-overview/course-5.jpg',
            title: 'KPIs',
            caption: 'Weekly KPIs for leadership review.',
          },
        ],
      },
      {
        heading: 'More views',
        body: 'Additional dashboard frames from the production release.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/dadb-course-overview/course-4.jpg', title: 'Workloads' },
          { kind: 'image', src: '/tools/dadb-course-overview/course-3.jpg', title: 'Modules' },
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
        heading: 'What it is',
        body: `Occupied VFX is a **browser-based visual effects instrument** — WebGL2, Three.js, and GLSL — for VJing and live creative work. Video, audio, webcam, and 3D assets route through modular GPU effects without installing a heavy desktop suite.

It started as a personal passion project under Multikunst and shipped as a usable product within about a month. The goal was not a film compositor; it was a **live instrument** performers and creative technologists can open in a tab and play.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/occupied/workspace.webp',
            title: 'Workspace',
            caption: 'Main workspace — effects, routing, and preview.',
          },
        ],
      },
      {
        heading: 'Live workspace',
        body: `The loop below is the same preview you see on the portfolio tile — routing sources, stacking effects, and watching the output update live in the browser.`,
        layout: 'full-media',
        media: [
          {
            kind: 'video',
            src: '/tools/occupied/tile-preview.mp4',
            title: 'Occupied VFX · workspace loop',
            autoplay: true,
            loop: true,
            muted: true,
            caption: 'Workspace loop — muted autoplay.',
          },
        ],
      },
      {
        heading: 'Why the browser',
        body: `Install friction kills experimentation at a gig or in a workshop. Putting the engine in the browser meant demos, sessions, and sharing a URL instead of an installer — and it forced the stack to stay honest about performance: everything has to run on the GPU path we actually ship.

Occupied is **not** Skyhaven VFX Studio. Occupied is a Multikunst live-visuals tool. Skyhaven’s studio authors combat VFX for the game catalog. Same word “VFX,” different jobs.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/occupied/login.webp',
            title: 'Login',
            caption: 'Entry into a session.',
          },
        ],
      },
      {
        heading: 'How it was built',
        body: `Product design and shader pipeline were owned end to end: UI for routing sources, a library of modular effects, and GLSL that stays editable enough to grow the set over time. The trailer and workspace stills show the same loop — pick inputs, stack effects, watch the output update live.

The release kept growing past the first month: **40+ users** and ongoing use as a live visual tool rather than a one-off demo.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/occupied/screen-2.webp',
            title: 'Effects',
          },
        ],
      },
      {
        heading: 'Live session',
        body: 'Session and output frames from the shipped Multikunst build — the instrument under a real preview, not a mock.',
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/occupied/screen-4.webp',
            title: 'Live session',
          },
        ],
      },
      {
        heading: 'More screens',
        body: 'Additional UI from the Occupied release.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/occupied/screen-3.webp', title: 'Routing' },
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
        heading: 'What it is',
        body: `FlashR is a **native Swift flashcard app** for fast personal study: AI-assisted card generation, swipe sessions, quizzes, folders, and light progress stats. The brief was simple — study without a cluttered LMS UI, and generate cards when you already know the topic but not the phrasing.

Built solo end to end: product, data model, onboarding, and AI hooks for question / answer / explanation cards.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/flasher/screen-002.webp',
            title: 'Study session',
            fit: 'contain',
            caption: 'Swipe study session.',
          },
        ],
      },
      {
        heading: 'How study works',
        body: `Sessions are swipe-first. Cards live in folders so you can keep subjects separate without nesting hell. Quizzes and progress give a light feedback loop without turning the app into a gradebook.

AI is a **generation aid**, not the product: you still own the deck, edit the wording, and decide what to keep.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/flasher/screen-003.webp',
            title: 'Cards',
            fit: 'contain',
          },
        ],
      },
      {
        heading: 'How it was built',
        body: `Swift UI on iOS, with Cursor and AI APIs for the generation path. The interesting design work was keeping the AI flow **short**: prompt → cards → edit → study — so the app stays a study tool, not a chat experiment with a flashcard skin.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/flasher/screen-004.webp',
            title: 'Progress',
            fit: 'contain',
            caption: 'Progress without a dense dashboard.',
          },
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
    type: 'video',
    thumbnail: '/tools/agata/product-poster.webp',
    videoUrl: '/tools/agata/product.mp4',
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
        heading: 'Product film',
        body: `Agata is a **voice-first private journal** for iPhone — Speak. Reflect. Grow. You capture a moment by speaking, writing, or adding a photo; Agata turns the day into a readable page with reflections that stay tied to real sources.

Built under Multikunst with Sahachat Sonnenburg: native Swift/SwiftUI, local-first capture, OpenRouter for AI with your own key, optional Supabase sync for generated wraps. The film below is the product walkthrough.`,
        layout: 'full-media',
        media: [
          {
            kind: 'video',
            src: '/tools/agata/product.mp4',
            title: 'Agata product film',
            caption: 'Voice journaling, daily wraps, and chat on iPhone.',
          },
        ],
      },
      {
        heading: 'Why voice first',
        body: `Most journals fail at the moment you actually have something to say — usually when your hands are full or you are too tired to type. Agata starts at **Speak**: tap or say “Agata,” leave a thought, and keep the original audio and text on device until you choose what to wrap or discuss with the companion.

That local-first rule is intentional. The AI companion should talk about your day without inventing it — reflections stay linked to notes, recordings, and photos.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/agata/screen-home.webp',
            title: 'Home · Speak',
            fit: 'contain',
            caption: 'Speak your thoughts — tap or say Agata.',
          },
        ],
      },
      {
        heading: 'A hub for the day',
        body: `The hub is the calm return surface: wraps, widgets, and shortcuts so “open Agata” does not feel like opening another feed. Product and visual language were co-owned — the blue wordmark, the orb, and the dark speak UI are the same system as the public beta campaign.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/agata/screen-hub.webp',
            title: 'Hub',
            fit: 'contain',
            caption: 'Hub · daily overview and entry points.',
          },
        ],
      },
      {
        heading: 'Readable pages',
        body: `Spoken moments become a **journal page** you can skim later. Entry detail keeps the thread of the day without burying the original capture — that is the difference between a wrap and a rewrite.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/agata/screen-journal-01.webp',
            title: 'Journal',
            fit: 'contain',
          },
        ],
      },
      {
        heading: 'Onboarding into the habit',
        body: `Onboarding introduces Speak. Reflect. Grow. without a wall of settings — enough to start reflecting on day one. TestFlight beta and agatajournal.com carry the same invite path: open TestFlight → install → start reflecting.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/agata/screen-onboarding.webp',
            title: 'Onboarding',
            fit: 'contain',
          },
        ],
      },
      {
        heading: 'The product in motion',
        body: `A square loop of the interface language — orb, speak state, and calm chrome — the same visual system as the public beta invite. Autoplay, muted, so the case study reads the motion the way the tile does.`,
        layout: 'full-media',
        media: [
          {
            kind: 'video',
            src: '/tools/agata/tile-preview.mp4',
            title: 'Agata UI loop',
            portrait: true,
            fit: 'contain',
            frame: 'paper',
            autoplay: true,
            loop: true,
            muted: true,
            caption: 'Loop · muted UI motion.',
          },
        ],
      },
      {
        heading: 'More screens',
        body: 'Beta invite, hub widgets, and campaign frames from the Multikunst release.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/tools/agata/screen-journal-02.webp', title: 'Entry detail', fit: 'contain' },
          { kind: 'image', src: '/tools/agata/screen-beta.webp', title: 'Join beta', fit: 'contain' },
          { kind: 'image', src: '/tools/agata/post-joiniosbeta.png', title: 'iOS beta invite', fit: 'contain' },
          { kind: 'image', src: '/tools/agata/hub-widgets.png', title: 'Hub widgets', fit: 'contain' },
          { kind: 'image', src: '/tools/agata/thumbnail.png', title: 'Beta campaign', fit: 'contain', frame: 'paper' },
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
        heading: 'What it is',
        body: `Multikunst Automation is an internal **node-based workflow OS** — a visual graph where you connect scripts, web tools, APIs, and LLM steps, then inspect runs and grow the node library over time.

Client work under Multikunst kept repeating the same glue: fetch something, transform it, call an API, hand the result to a human or another tool. The builder exists so those pipelines become **graphs you can reopen**, not one-off scripts that only one person understands.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/multikunst-automation/screen-001.webp',
            title: 'Graph editor',
            caption: 'Visual graph editor for company automations.',
          },
        ],
      },
      {
        heading: 'How a run works',
        body: `You author a graph, execute it, and inspect what each node produced. Outputs can be saved and reused. AI hooks sit as nodes in the same graph — useful for draft or classify steps — without turning the whole OS into a chat UI.

The design priority was **modularity**: new node types should land without rewriting the execution core.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/tools/multikunst-automation/screen-003.webp',
            title: 'Run inspect',
            caption: 'Inspect a run node by node.',
          },
        ],
      },
      {
        heading: 'How it was built',
        body: `Designed and built under Multikunst: React front end, Node.js execution plumbing, LLMs for AI-capable nodes, Cursor for iteration speed. The interesting work was the contract between editor state and runner — so a graph that looks right on screen also **runs the same way** the next morning.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/multikunst-automation/screen-002.webp',
            title: 'Nodes',
          },
        ],
      },
      {
        heading: 'More screens',
        body: 'Additional builder frames from the Multikunst release.',
        layout: 'gallery',
        media: [
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
      'Desktop widget game grown from a focus-timer experiment into an arena brawler and island builder — an own painterly universe on floating islands, built solo from hand-drawn art direction to shipped launcher, bilingual website, and v0.3.14.',
    date: '2026-02-01',
    author: 'Artjom N.',
    tools: [
      { name: 'Tauri' },
      { name: 'React' },
      { name: 'Three.js' },
      { name: 'R3F' },
      { name: 'Meshy' },
      { name: 'Cursor' },
    ],
    tags: ['Game', '3D', 'Desktop'],
    type: 'video',
    thumbnail: '/projects/skyhaven/posters/fullfarming.webp',
    videoUrl: '/projects/skyhaven/tile-preview.mp4',
    order: 6,
    role: 'Art direction, 3D & code end to end',
    client: 'Personal · in active development',
    timeframe: '2026 — ongoing',
    team: 'Solo',
    outcomes: [
      'Grew a focus-widget experiment into an arena brawler + island builder — 94 commits from March to August 2026, shipping v0.3.14',
      'Built a modular environment kit: 76 tile types on a 1 m grid, multi-cell POI footprints, walk-surface calibration, and a hard 420 MB asset budget gate',
      'Authored the complete visual identity — hand-drawn character art, a custom cursor and icon pipeline, and a gold-on-dark-glass CI shared by game and website',
      'Shipped the full ecosystem solo: game, Windows/macOS launcher with CDN update channels, and a bilingual site with arena roster, 3D inspector, and wiki',
    ],
    explanation: `Skyhaven started in early 2026 as an experiment — how far can one artist-developer get with AI-accelerated tooling? It is now a daily project: an arena brawler and survival adventure in an own painterly universe, still shipping as a calm desktop widget.

Technically it's a Tauri 2 shell around a React 19 UI and a Three.js / React Three Fiber world — 186 GLB models, a 1 m modular tile grid, day/night lighting, and internal production tooling (DevHub, Tile Lab).

The same monorepo ships the game, a Windows/macOS launcher with CDN update channels, and a bilingual site with arena roster, in-browser 3D inspector, wiki, and downloads. Combat VFX are authored in Skyhaven VFX Studio against the game's own catalog contract.`,
    references: [
      {
        url: SKYHAVEN_SITE_URL,
        label: 'Open the Skyhaven website',
      },
      {
        url: '/project/skyhaven-vfx',
        label: 'Skyhaven VFX Studio',
      },
      {
        url: SKYHAVEN_RELEASES_URL,
        label: 'Try on GitHub Releases',
      },
    ],
    caseSections: [
      {
        heading: 'From experiment to universe',
        body: `Skyhaven started in early 2026 as an experiment: how far can one artist-developer get building a real game with AI-accelerated tooling? The honest answer turned into a project I work on every day — an **arena brawler and survival adventure** set on floating islands, with its own story, factions, and hand-drawn visual language, still shipping as a calm desktop widget. Current build: **v0.3.14**.`,
        layout: 'full-media',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven/videos/cinematic.mp4',
            title: 'Skyhaven cinematic',
            caption: 'In-engine cinematic — the island world in motion.',
          },
        ],
      },
      {
        heading: 'An own universe',
        body: `The world is built on a simple myth: after **“the Break,”** the earth rose into floating fragments above a cloud sea — Skyhaven is a fragment field, not a planet. Coins are minted magic, and factions like **The Mints**, the **Drifters**, the **Grounders**, and the **Ruin-Keepers** disagree about what uncontrolled magic would do to the sky.

The look came before the tech. Hand-drawn and painted character art — Fighter, Mage, Mining Man — set the visual rules: *isometric, warm, painterly, cozy-fantasy*. Every 3D asset since has to pass that bar. The pipeline is openly hybrid: my art direction and drawings up front, AI and DCC tools as accelerators behind them.`,
        layout: 'text-left',
        // TODO(Artjom): Scans der Original-Zeichnungen/Gemälde ablegen und einkommentieren —
        // am stärksten: ein Motiv als Zeichnung + finales 3D-Pendant (Vorher/Nachher).
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven/story/artwork-01.webp', title: 'Original concept painting', fit: 'contain', frame: 'paper', caption: 'Hand-drawn origin of the Skyhaven look.' },
        // ],
      },
      {
        heading: 'What it is today',
        body: `Three modes ship today. **Arena** — a ladder of four named villains with telegraphed third-person combat. **Build** — a free island builder on a modular tile kit. And the original **widget companion** that started everything, still fully alive. A story mode card already sits in the menu: the universe is written, the mode is next.`,
        layout: 'text-right',
        // TODO(Artjom): Mode-Select-Screenshot (Story / Arena / Build) ablegen und einkommentieren.
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven/screens/mode-select.webp', title: 'Mode select', caption: 'Story, Arena, and Build — one universe, three entry points.' },
        // ],
      },
      {
        heading: 'The widget superpower',
        body: `Skyhaven runs as a frameless, transparent, always-on-top **960×618 Tauri window** at the edge of your screen. Focus sessions (15/30/60/120 minutes, plus a Pomodoro cycle) are timestamp-based — close the app, come back later, and the island has kept working: crops grew, your character mined, rewards wait.

The game respects that you are working. That constraint shaped every system in it.`,
        layout: 'text-left',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven/videos/widget-highlight.mp4',
            title: 'Widget overview',
            autoplay: true,
            loop: true,
            muted: true,
            caption: 'The widget at the edge of the screen — HUD, sidebar, floating island.',
          },
        ],
        // TODO(Artjom): Screenshot vom Widget auf echtem Desktop mit laufender Focus-Clock ablegen:
        // { kind: 'image', src: '/projects/skyhaven/screens/widget-desktop.webp', title: 'Widget on a real desktop', caption: 'Always-on-top companion while you work.' },
      },
      {
        heading: 'Environment craft: a modular tile world',
        body: `The world is a **1-meter modular grid**: 76 tile types, stack heights up to five levels, and multi-cell footprints — trees at 3×3, large POIs like the Mask Temple and the tavern at 2×2 to 4×4. Every GLB is normalized onto its footprint, and a dedicated **Tile Lab** calibrates walk surfaces per tile (48 calibrated keys) so characters read the terrain correctly.

Performance is part of the craft: instanced ground tiles, grass LOD that fades at 6 units and culls at 11, gltf-transform optimization passes, and a hard **asset budget gate — 420 MB total, 12 MB per file** — enforced by script before anything ships.`,
        layout: 'text-right',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven/videos/farming.mp4',
            title: 'Farming loop',
            autoplay: true,
            loop: true,
            muted: true,
            caption: 'The tile world in motion — till, plant, grow, harvest.',
          },
        ],
        // TODO(Artjom): Build-Mode-Screenshot mit offenem Baukasten-Panel + Tile-Lab-Shot ablegen:
        // { kind: 'image', src: '/projects/skyhaven/screens/build-mode.webp', title: 'Build mode', caption: 'Baukasten — 48 buildable tiles with placement validation.' },
        // { kind: 'image', src: '/projects/skyhaven/screens/tile-lab.webp', title: 'Tile Lab', caption: 'Walk-surface calibration per tile.' },
      },
      {
        heading: 'Light, sky, and mood',
        body: `A day/night system lerps sun elevation and intensity into night blues under a moonlit sky, over a procedural Preetham sky model. Torches, wells, and the forge scale their point lights up at night.

On a stage this small, lighting *is* the level design — the island has to feel like a place worth returning to after a work session.`,
        layout: 'text-left',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven/videos/fullfarming.mp4',
            title: 'Full farming showcase',
            autoplay: true,
            loop: true,
            muted: true,
            caption: 'Island ambience in one take — light, sky, and place.',
          },
        ],
      },
      {
        heading: 'Combat & the arena ladder',
        body: `Combat is third-person with readable intent: enemies telegraph with wind-ups and an overhead glyph (a separate glyph marks unblockables), and the player answers with **block, dodge-roll i-frames, and three-hit combos** across four weapons — fist, axe, bow, greatsword.

The arena ladder stacks four villains — **Emberforge Reaper, Forest Seeker, Hurt Corp Enforcer, General Mage** — and mask rewards (Iron / Gold / Bone / End) apply real stat modifiers, not cosmetics. Feel is tuned in the details: hitstop, camera trauma, damage numbers, clash sounds. The combat VFX themselves are authored in **Skyhaven VFX Studio**.`,
        layout: 'text-right',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven/videos/fighting.mp4',
            title: 'Combat slice',
            autoplay: true,
            loop: true,
            muted: true,
            caption: 'Telegraphs, block/dodge, and hit feedback on the mining island.',
          },
        ],
        // TODO(Artjom): Arena-Overview-Screenshot mit den 4 Villains ablegen:
        // { kind: 'image', src: '/projects/skyhaven/screens/arena-overview.webp', title: 'Arena ladder', caption: 'Four villains, mask rewards with real stat modifiers.' },
      },
      {
        heading: 'Characters & voices',
        body: `Eight playable characters share the rig family, and NPCs carry the world — **Brakka** the miner, **Lux** the fighter trainer, Skully, the Dock Mage — with a narrator voice-over pipeline generating the spoken beats. Character rules live in written docs so behavior stays consistent as content grows.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven/models-3d/main-char.webp',
            title: 'Main character',
            fit: 'contain',
            caption: 'Production render — the player character.',
          },
        ],
        // TODO(Artjom): Character-Select-Overlay-Screenshot ablegen:
        // { kind: 'image', src: '/projects/skyhaven/screens/character-select.webp', title: 'Character select', caption: 'Eight playable characters on one rig family.' },
      },
      {
        heading: 'UI language: cursor, pictograms, thumbnails',
        body: `The UI is its own crafted layer. A custom **crystal cursor** ships as a real cursor asset (PNG + hotspot JSON, wired through a CSS token), built by the same icon pipeline that trims and compresses **15 hand-drawn stone emblems** into toolbox icons — seven build categories, nine tools. Around **75 produced thumbnails** cover build tiles, equipment, and the website's 3D catalog.

The CI holds it together: dark glass panels with a **gold \`#f0b93a\`** accent shared by game and website, Koulen and Jersey10 for game chrome, Archivo for menus and web.`,
        layout: 'text-right',
        // TODO(Artjom): Icon-/Cursor-Collage (oder Sprite-Sheet) + Thumbnail-Grid ablegen:
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven/screens/ui-icons-collage.webp', title: 'Cursor & icon system', fit: 'contain', caption: 'Crystal cursor and hand-drawn stone emblems.' },
        //   { kind: 'image', src: '/projects/skyhaven/screens/thumbnails-grid.webp', title: 'Produced thumbnails', fit: 'contain', caption: '~75 thumbnails across tiles, equipment, and web catalog.' },
        // ],
      },
      {
        heading: 'Content at scale',
        body: `**186 GLB models and 52 FBX rigs** ship in the current build — characters, enemies, POIs, props, and tiles, all under one visual rule set. A selection of production renders:`,
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/skyhaven/models-3d/taverne.webp', title: 'Tavern · Social Hub', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/mine.webp', title: 'Mine POI', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/airShipPort.webp', title: 'Airship port', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/enemy-robot.webp', title: 'Enemy robot', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/farm2x2.webp', title: 'Farm · 2×2 multi-cell tile', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/tree.webp', title: 'Tree · 3×3 footprint', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/airship-wing.webp', title: 'Airship wing', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/pathCross.webp', title: 'Path tile', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/prop-axe.webp', title: 'Prop · axe', fit: 'contain' },
          { kind: 'image', src: '/projects/skyhaven/models-3d/halfGrownCropTile.webp', title: 'Crop tile · growth stage', fit: 'contain' },
        ],
        // TODO(Artjom): Optional — ein Spiel-GLB für den interaktiven 3D-Viewer ablegen und als
        // eigenen Abschnitt einkommentieren (kind: 'model3d'):
        // { kind: 'model3d', src: '/projects/skyhaven/models-3d/main-char.glb', title: 'Inspect the model' },
      },
      {
        heading: 'Production tooling',
        body: `Content at this pace needs internal tools. **DevHub** bundles a Visual Lab, Material Lab, lighting and sky controls, a Camera Studio, Character Lab, and a scene composer. **Tile Lab** handles walk-surface calibration. Capture pipelines render portfolio and marketing footage straight from the game.

The tooling is the difference between a demo and a production.`,
        layout: 'text-left',
        // TODO(Artjom): DevHub-Screenshot ablegen:
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven/screens/devhub.webp', title: 'DevHub', caption: 'Internal production tooling — labs, lighting, camera, scenes.' },
        // ],
      },
      {
        heading: 'Shipping it',
        body: `One repo ships the whole ecosystem: the game, a **Windows/macOS launcher** (v0.2.8) with stable/dev update channels on a CDN, and a bilingual marketing site with the arena roster, an in-browser **3D model inspector** for real game assets, a wiki, FAQ, and a waitlist.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven/website.webp',
            title: 'Skyhaven website',
            caption: 'Arena roster, 3D inspector, wiki, and downloads — same project.',
          },
        ],
      },
      {
        heading: 'The numbers, and what is next',
        body: `**94 commits between March and August 2026**, 3,760 tracked files, current version v0.3.14 — built solo next to client work.

In design and partially shipping already: the **Social Hub** multiplayer tavern (its mesh ships in v0.3.14), the story mode, and a funding track targeting a **Q1 2027** release.`,
        layout: 'text-left',
        // TODO(Artjom): Optional — Social-Hub-Taverne-Screenshot ablegen:
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven/screens/social-hub.webp', title: 'Social Hub tavern', caption: 'Multiplayer hub — mesh already shipping in v0.3.14.' },
        // ],
      },
    ],
  },
  {
    id: 'ninja-mage',
    slug: 'ninja-mage',
    title: 'Ninja Mage',
    description:
      'Avatar-inspired ninja-mage cinematic — Marvelous Designer cloth, stacked Mixamo clips, and transparent video planes warped into elemental trails. Cycles render; the brief was readable silhouette, timing, and color.',
    date: '2023-06-01',
    author: 'Artjom N.',
    tools: [
      { name: 'Marvelous Designer' },
      { name: 'Mixamo' },
      { name: 'Blender' },
      { name: 'Cycles' },
    ],
    tags: ['VFX', 'Cinematic', '3D'],
    type: 'video',
    thumbnail: '/projects/ninja-mage/poster.webp',
    videoUrl: '/projects/ninja-mage/hero.mp4',
    videoPortrait: true,
    gallery: [
      { type: 'image', src: '/projects/ninja-mage/environment.webp' },
      { type: 'image', src: '/projects/ninja-mage/environment-1.webp' },
      { type: 'image', src: '/projects/ninja-mage/environment-3.webp' },
      { type: 'image', src: '/projects/ninja-mage/render-transparent.webp' },
      { type: 'image', src: '/projects/ninja-mage/blender-viewport.webp' },
      { type: 'image', src: '/projects/ninja-mage/blender-viewport-1.webp' },
    ],
    order: 9,
    role: 'Solo 3D / VFX',
    client: 'Personal · study',
    timeframe: '2023',
    team: 'Solo',
    outcomes: [
      'Combined Mixamo clips into a readable combat beat with cloth sim from Marvelous Designer',
      'Used transparent video planes as source footage, then distorted them into elemental trails in the render',
    ],
    explanation:
      'A short pre-rendered combat piece, not a realtime engine. The problem is the same one combat VFX always has: can you read the attack, the hit, and the character against the environment.',
    caseSections: [
      {
        heading: 'What it is',
        body: `Ninja Mage is a short **Avatar-inspired cinematic** — one combat beat for a ninja-mage character. It is pre-rendered in Blender Cycles, not a realtime game engine. The craft question is the same one combat VFX always has: can you read the attack, the hit, and the character against the environment?

Silhouette, timing, and color mattered more than particle count. The film below is the final encode with audio.`,
        layout: 'portrait-split',
        media: [
          {
            kind: 'video',
            src: '/projects/ninja-mage/hero.mp4',
            title: 'Ninja Mage · final attack',
            portrait: true,
            caption: 'Full Cycles encode with audio.',
          },
        ],
      },
      {
        heading: 'How it was made',
        body: `**Marvelous Designer** for cloth — garments that move with the strike instead of stiff mesh clothes. **Mixamo** for motion, with clips stacked into one readable beat rather than a single mocap take.

Elemental trails did not start as particle systems. They started as **transparent video planes** in the scene, then got warped so the energy follows the strike instead of sitting as a flat billboard. That plate is the beauty pass on the right — cloth, trails, and figure in one alpha cutout.`,
        layout: 'portrait-split',
        media: [
          {
            kind: 'image',
            src: '/projects/ninja-mage/render-transparent.webp',
            title: 'Transparent beauty pass',
            portrait: true,
            fit: 'contain',
            frame: 'dark',
            caption: 'Alpha cutout — cloth, trails, and figure in one plate.',
          },
        ],
      },
      {
        heading: 'Environment & lighting',
        body: `The set is a tight canyon so the figure stays the read. Lighting and environment passes from look-dev — same project, not a different sci-fi still set. Behind the scenes these frames were the checks: does the silhouette still clear when the trails bloom?`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/projects/ninja-mage/environment.webp',
            title: 'Environment',
            fit: 'contain',
          },
        ],
      },
      {
        heading: 'Viewport',
        body: `Blender viewport before the final Cycles encode — trail plates and cloth sitting in the same shot. This is the working view where timing gets adjusted: when the trail turns on, when the hit reads, when the aftermath clears.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/ninja-mage/blender-viewport.webp',
            title: 'Blender viewport',
          },
        ],
      },
      {
        heading: 'More stills',
        body: 'Additional look-dev and viewport frames.',
        layout: 'gallery',
        media: [
          {
            kind: 'image',
            src: '/projects/ninja-mage/environment-1.webp',
            title: 'Environment pass',
            fit: 'contain',
          },
          { kind: 'image', src: '/projects/ninja-mage/environment-3.webp', title: 'Lighting', fit: 'contain' },
          { kind: 'image', src: '/projects/ninja-mage/blender-viewport-1.webp', title: 'Viewport · alternate' },
        ],
      },
    ],
  },
  {
    id: 'skyhaven-vfx',
    slug: 'skyhaven-vfx',
    title: 'Skyhaven VFX Studio',
    description:
      'Companion authoring tool for Skyhaven combat VFX — Tauri 2, React, and React Three Fiber. Reads the game catalog read-only, binds effects to catalogued action markers on a combo timeline, and exports hash-validated packages. Not a second engine, and not Occupied VFX.',
    date: '2026-06-01',
    author: 'Artjom N.',
    tools: [{ name: 'Tauri' }, { name: 'React' }, { name: 'Three.js' }, { name: 'R3F' }],
    tags: ['Tool', 'VFX', 'Realtime'],
    type: 'video',
    thumbnail: '/projects/skyhaven-vfx/editor.webp',
    videoUrl: '/projects/skyhaven-vfx/studio-demo.mp4',
    gallery: [
      { type: 'image', src: '/projects/skyhaven-vfx/start-screen.webp' },
      { type: 'image', src: '/projects/skyhaven-vfx/editor.webp' },
      { type: 'image', src: '/projects/skyhaven-vfx/presets.webp' },
      { type: 'image', src: '/projects/skyhaven-vfx/animations.webp' },
    ],
    order: 10,
    role: 'Tooling & effect language',
    client: 'Personal · Skyhaven',
    timeframe: '2026',
    team: 'Solo',
    outcomes: [
      'Built a read-only Asset Bridge with sha256-hashed assets, so the game checkout stays the single source of truth',
      'Bound combo timelines to catalogued action markers (Trail On / Impact / Trail Off) with revision hashes that refuse stale packages',
      'Designed a six-phase spell language with 22 built-in effect recipes, a natural-language recipe builder, and widget/gameplay/cinematic quality budgets',
      'Proved the contract end to end with the Cracked Mask · Greatsword Combo 3 slice — same action ID, sockets, and timings in studio and arena',
    ],
    explanation: `Skyhaven combat needs readable VFX on a desktop widget budget. The studio is the authoring side of that problem: data-driven effects composed from nine layer types, validated against the game's own catalog, and exported as hash-checked packages — not a second game engine.

153 source files, 36 components, 32 unit test suites — built solo. Occupied VFX is a separate Multikunst browser instrument for live visuals; this studio only talks to Skyhaven.`,
    references: [
      { url: '/project/skyhaven', label: 'Skyhaven case study' },
      { url: SKYHAVEN_SITE_URL, label: 'Open the Skyhaven website' },
    ],
    caseSections: [
      {
        heading: 'Studio demo',
        body: `Skyhaven VFX Studio is the **authoring instrument** for Skyhaven combat effects — a Tauri 2 desktop app built with React 19, React Three Fiber, and Zustand. It reads the game catalog (characters, weapons, action IDs), lets you compose trails, impacts, and spells on a combo timeline, then exports validated packages for the game.

It is not a second game engine, and it is not Occupied VFX — Occupied is a Multikunst live-visuals instrument. This studio only talks to Skyhaven.`,
        layout: 'full-media',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven-vfx/studio-demo.mp4',
            title: 'Skyhaven VFX Studio demo',
            caption: 'Studio walkthrough — hub, timeline, and live effect preview.',
            // TODO(Artjom): Aktuelle Studio-Aufnahme unter public/projects/skyhaven-vfx/studio-demo.mp4 ersetzen.
          },
        ],
      },
      {
        heading: 'Why a studio exists',
        body: `Attacks in Skyhaven have to **telegraph, travel, hit, and clear** — on a tiny desktop widget as well as in a full fight view. Authoring that inside the game editor mixes content with engine code and slows iteration.

The studio is a dedicated tool speaking the same contract as the game: same catalog, same sockets, same action IDs. Author fast, export safely.`,
        layout: 'text-left',
      },
      {
        heading: 'Hub & Asset Bridge',
        body: `The hub connects to a Skyhaven checkout through a **read-only Asset Bridge**. Characters, animations, and weapons come from the game's own catalog; every asset is keyed by a **sha256 hash**, and a mismatch tells you to refresh the catalog instead of silently drifting.

Export writers are physically blocked from writing into the game repo — the game stays the single source of truth.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/start-screen.webp',
            title: 'Hub · Asset Bridge',
            caption: 'Project hub and read-only Asset Bridge into the game checkout.',
          },
        ],
      },
      {
        heading: 'From Mixamo FBX to a calibrated grip',
        body: `A project starts from a Mixamo-compatible FBX with skin. If a source file moves on disk, a **fingerprint-based repair flow** relinks it instead of breaking the project.

Before any effects exist, the **grip calibration** screen aligns the weapon in the character's hand with move/rotate/scale gizmos. Trail sockets inherit from that transform — so every downstream effect sits correctly on the blade, not floating beside it.`,
        layout: 'text-left',
        // TODO(Artjom): Screenshot der Grip-Kalibrierung (Waffe + Gizmos in der Hand) ablegen:
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven-vfx/grip-calibration.webp', title: 'Grip calibration', caption: 'Weapon alignment with gizmos — trail sockets inherit from this transform.' },
        // ],
      },
      {
        heading: 'The combo timeline',
        body: `The editor is built like an instrument: a multi-track **stage timeline** with animation strips, VFX clips, and audio; markers locked to the catalog contract — **Trail On, Impact, Trail Off**; bezier time and pose curves; and a **Combo Test** mode that replays buffered clicks like real gameplay.

A Clean Preview toggle strips the HUD for portfolio-ready framing.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/animations.webp',
            title: 'Animation / combo timeline',
            fit: 'contain',
            portrait: true,
          },
        ],
        // TODO(Artjom): Close-up der Timeline mit sichtbaren Trail-On/Impact/Trail-Off-Markern ablegen:
        // { kind: 'image', src: '/projects/skyhaven-vfx/timeline-markers.webp', title: 'Marker contract', caption: 'Trail On / Impact / Trail Off — locked to the game catalog.' },
      },
      {
        heading: 'The effect language',
        body: `Effects compose from **nine layer types** — particles, mesh particles, ribbons, lightning, procedural abilities, flipbooks, light events, sound events, and camera shake — over a material model with texture blending, UV flow, **erosion, and color ramps**.

Twenty-two recipes ship built in, from weapon trails and impact bursts to teleports, healing rituals, and elemental storms.`,
        layout: 'text-left',
        // TODO(Artjom): Material-Inspector-Screenshot (Erosion/Color-Ramp-Controls) ablegen:
        // media: [
        //   { kind: 'image', src: '/projects/skyhaven-vfx/material-inspector.webp', title: 'Material inspector', caption: 'Texture blending, UV flow, erosion, color ramps.' },
        // ],
      },
      {
        heading: 'Spell Lab & the six phases',
        body: `Structured spells run through six phases — **Anticipation, Inscription, Convergence, Release, Impact, Aftermath** — so telegraphing is data, not a polish pass you remember later.

An **Effect Recipe Builder** turns a plain-language prompt (German or English) into a recipe, and the **Spell Lab** aims and casts travel effects live in the viewport.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/presets.webp',
            title: 'Presets & recipes',
            fit: 'contain',
            portrait: true,
          },
        ],
        // TODO(Artjom): Spell-Lab-Screenshot (Zielen/Casten im Viewport) + Recipe-Builder-Prompt ablegen:
        // { kind: 'image', src: '/projects/skyhaven-vfx/spell-lab.webp', title: 'Spell Lab', caption: 'Aim and cast travel effects live in the viewport.' },
        // { kind: 'image', src: '/projects/skyhaven-vfx/recipe-builder.webp', title: 'Effect Recipe Builder', caption: 'Plain-language prompt to effect recipe.' },
      },
      {
        heading: 'Quality budgets',
        body: `Every effect carries budgets — max particles, draw calls, lights — and three quality tiers scale it: **widget (0.45×), gameplay (1.0×), cinematic (1.35×)**. A live budget state (green / yellow / red) sits in the editor HUD.

An effect that reads in a full fight still has to fit an always-on-top widget window. That constraint is designed in, not patched on.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/editor.webp',
            title: 'Editor',
            caption: 'Viewport, inspector, and live performance overlay.',
          },
        ],
      },
      {
        heading: 'The export contract',
        body: `Export is a package, not a file dump: **manifest, bindings, composition, and effect JSON**, plus validation and performance reports, zipped as a \`.skyhavenvfx\` archive. Action contracts carry **revision hashes** — if the game revises an action, import refuses the stale package instead of silently corrupting timing.

The proven slice is **Cracked Mask · Greatsword Combo 3**: same action ID, sockets, and timings in studio and arena.`,
        layout: 'text-right',
      },
      {
        heading: 'Built solo, tested',
        body: `153 source files, 36 React components, and **32 unit test suites** — built solo, in the same universe as the game it serves.

The studio is what tech art looks like on this project: not one effect, but the system that makes a hundred effects consistent.`,
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
        heading: 'What it is',
        body: `CoinCraft is a colorful **match-3 puzzle** under Multikunst — combine coins, unlock power-ups, and climb the leaderboards. It is a playable web build, not a pitch deck: the live URL is the proof.

The production job was to ship a slice that feels addictive in the first minute — clear match rules, readable feedback, and a leaderboard loop that invites another round.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/tools/coincraft-thumb.png',
            title: 'CoinCraft',
            fit: 'contain',
            caption: 'Match-3 under Multikunst.',
          },
        ],
      },
      {
        heading: 'How to play',
        body: `Open the live build to play. The case study keeps a light footprint on purpose — the game is the artifact. For a deeper look at Multikunst’s tooling and realtime work, see Occupied VFX and the Skyhaven projects.`,
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
        heading: 'What it is',
        body: `Ryuk PP is a **pixel-art 2D platformer** built in Godot — run, jump, collect bones, explore hand-crafted levels. It ships as a browser-playable slice (collaboration with oxxupe), so recruiters and friends can try it without installing the engine.

The brief was a readable platformer loop in the browser: tight controls, clear collectibles, levels that show craft rather than procedural noise.`,
        layout: 'text-left',
      },
      {
        heading: 'Play in browser',
        body: `The embed below is the Godot build. Use **WASD** or arrow keys. This case study keeps the interactive build as the main artifact — the process story is the collaboration: ship a slice that runs where people already are (the browser), then iterate on levels and feel.`,
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
