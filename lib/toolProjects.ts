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
      'A compact desktop widget game — a floating isometric island at the edge of your screen while you focus: focus sessions, inventory, farming, island building, and a playable mining combat slice. Combat VFX are authored in Skyhaven VFX Studio. The public site (arena roster, 3D inspector, wiki, downloads) is part of the same project.',
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
      'Authored combat VFX in a dedicated studio and imported them via vfx:import',
    ],
    explanation: `Skyhaven is a desktop widget game for Windows and macOS — inspired by the calm of games like Rusty's Retirement, but with clearer action POIs and a stronger sense of place.

Technically it's a Tauri 2 shell around a React 19 UI and a Three.js / React Three Fiber world. Already playable: focus timer, inventory & equipment, farming, toolbox build mode, island switching, and third-person combat on the mining island.

The public website is part of the same build: bilingual landing page, arena roster with an in-browser 3D inspector for real game models, build-mode loop, wiki, FAQ, and Windows / macOS downloads.

Combat VFX are authored in Skyhaven VFX Studio and imported as JSON packages — the public site is marketing and inspection for the same game, not a separate product.`,
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
        heading: 'What it is',
        body: `Skyhaven is a calm **desktop widget game** for Windows and macOS — a floating isometric island at the edge of your screen while you focus. Focus sessions (30 / 60 / 120 minutes), inventory, farming, custom island building, and a playable mining combat slice.

Inspired by the calm of games like Rusty's Retirement, but with clearer action POIs and a stronger sense of place. No fail-state pressure, no click grinding — when the session ends, you collect rewards and keep going.`,
        layout: 'text-left',
      },
      {
        heading: 'How it is built',
        body: `Technically it is a **Tauri 2** shell around a React UI and a Three.js / React Three Fiber world. Art direction, 3D, and code are owned end to end: sketches and visual rules first, Meshy for 3D iteration, Cursor for gameplay — every merge reviewed in Git.

Combat VFX are authored in a separate **Skyhaven VFX Studio** and imported as JSON packages. The public site (arena roster, 3D inspector, wiki, downloads) is the same project, not a second case study.`,
        layout: 'text-left',
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
      'Authoring tool for Skyhaven combat VFX — Tauri 2, React, and React Three Fiber. Reads the game catalog, binds trails and impacts to Action IDs, and exports JSON the game imports. Not a second engine, and not Occupied VFX.',
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
      'Built a read-only Coincraft Asset Bridge so character, animation, and weapon data come from the game checkout',
      'Bound combo timelines to catalogued Action IDs (Trail On / Impact / Trail Off) instead of free-timed previews',
      'Exported effect packages (manifest, bindings, composition, JSON) that Skyhaven imports with vfx:import',
    ],
    explanation: `Skyhaven combat needs readable VFX on a desktop widget budget. The studio is the authoring side of that problem: data-driven effects, not a second game engine.

Occupied VFX is a separate Multikunst browser instrument for live visuals. This studio only talks to Skyhaven.`,
    references: [
      { url: '/project/skyhaven', label: 'Skyhaven case study' },
      { url: SKYHAVEN_SITE_URL, label: 'Open the Skyhaven website' },
    ],
    caseSections: [
      {
        heading: 'Studio demo',
        body: `Skyhaven VFX Studio is the **authoring tool** for Skyhaven combat effects — Tauri 2, React, and React Three Fiber. It reads the game catalog (characters, weapons, action IDs), lets you edit trails and impacts on a combo timeline, then exports JSON packages the game imports with \`vfx:import\`.

It is not a second game engine, and it is not Occupied VFX. Occupied is a Multikunst live-visuals instrument. This studio only talks to Skyhaven.

The video below is a drop-in placeholder — replace \`studio-demo.mp4\` when your recording is ready.`,
        layout: 'full-media',
        media: [
          {
            kind: 'video',
            src: '/projects/skyhaven-vfx/studio-demo.mp4',
            title: 'Skyhaven VFX Studio demo',
            caption: 'Replace public/projects/skyhaven-vfx/studio-demo.mp4 when the recording is ready.',
          },
        ],
      },
      {
        heading: 'Why a studio',
        body: `Attacks in Skyhaven have to **telegraph, travel, hit, and clear** on a tiny desktop widget as well as in a fight view. Authoring that inside the game editor mixes content with the engine and makes iteration slow.

The studio is a dedicated tool with the same catalog, sockets, and Action IDs — then export. Quality budgets (\`widget\` / \`gameplay\` / \`cinematic\`) scale particles, draws, and lights so an effect that reads in a fight still fits the widget shell.`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/start-screen.webp',
            title: 'Hub · Asset Bridge',
            caption: 'Project hub and read-only Coincraft Asset Bridge.',
          },
        ],
      },
      {
        heading: 'Hub & Asset Bridge',
        body: `The start screen is a project hub plus a **read-only Coincraft Asset Bridge**. Character, animation, and weapon files come from the game checkout. The studio does not write those assets back — Skyhaven stays the source of truth for gameplay timing and sockets.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/editor.webp',
            title: 'Editor',
            caption: 'Viewport, inspector, and performance overlay.',
          },
        ],
      },
      {
        heading: 'Editor & combo timeline',
        body: `Viewport, inspector, performance overlay, and a combo timeline locked to catalogued markers — **Trail On**, **Impact**, **Trail Off**. If Skyhaven revises an action hash, import refuses a stale package. That keeps studio and arena on the same contract instead of “it looked fine in preview.”`,
        layout: 'text-left',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/animations.webp',
            title: 'Animation / combo',
            fit: 'contain',
            portrait: true,
          },
        ],
      },
      {
        heading: 'Presets & spell phases',
        body: `Gameplay categories: **weapon, impact, world, projectile, movement, pickup**. Structured spells use six phases — Anticipation, Inscription, Convergence, Release, Impact, Aftermath — so telegraphing is data, not a polish pass you remember later.

The vertical slice is **Cracked Mask · Greatsword Combo 3** — same action ID, sockets, and timings in studio and in the arena.`,
        layout: 'text-right',
        media: [
          {
            kind: 'image',
            src: '/projects/skyhaven-vfx/presets.webp',
            title: 'Presets',
            fit: 'contain',
            portrait: true,
          },
        ],
      },
      {
        heading: 'How it lands in Skyhaven',
        body: `Export is a package: manifest, bindings, composition, effect JSON. Skyhaven runs **\`vfx:import\`**. Failed imports write no registry data and never modify source models or animations — so a bad package cannot silently corrupt the game checkout.`,
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
