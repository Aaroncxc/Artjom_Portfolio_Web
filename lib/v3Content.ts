/**
 * Portfolio v3 (e-learning focus). Content sourced only from Artjom's career
 * questionnaire (12.10.2026) and the existing portfolio. Do not add salary,
 * insolvency, or DADB course content here.
 */
export type Media =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster?: string; alt: string }
  | { kind: 'placeholder'; label: string };

export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  problem?: string;
  action: string[];
  result: string[];
  tools: string[];
  media: Media[];
  links?: { href: string; label: string }[];
  note?: string;
}

export const CONTACT = {
  name: 'Artjom Naninjan',
  phone: '0163 8655190',
  phoneHref: 'tel:+491638655190',
  email: 'hello@artjom-naninjan.com',
  location: 'Berlin · remote / hybrid',
  education: 'B.Sc. Architektur, BHT Berlin 2016–2020',
  cert: 'IHK-certified Project Manager',
  languages: 'German, English, Russian (business fluent)',
};

export const HERO = {
  eyebrow: 'E-Learning · Production & Product Management',
  headline: 'I want to build good products for learners.',
  sub: 'Head of Production in e-learning. I built a course production from scratch, led 23 people directly, and shipped six 30-hour courses per year — now looking for a management role in a strong e-learning company.',
  roles: ['Head of Production', 'Senior Project Manager', 'Game Producer'],
};

export const STATS = [
  { value: '23', label: 'direct reports (AE, editing, 2D, 3D, 2 PMs in India)' },
  { value: '6 × 30 h', label: 'courses per year — KPI met and held' },
  { value: '€380k', label: 'saved per year with an AI avatar workflow' },
  { value: '2×', label: 'eLearning Africa booths with VR / AR exercises' },
];

/** Top three, in the order Artjom asked for. */
export const FEATURED: CaseStudy[] = [
  {
    id: 'lernwerk',
    index: '01',
    title: 'Lernwerk — AI authoring studio for complete courses',
    kicker: 'Learning product · 2026 — active',
    summary:
      'Local-first authoring studio: brief → generated course → visual edit → SCORM export and a verifiable certificate. No user account needed.',
    action: [
      'Owned the learning-product side: how a brief becomes a course and which module formats authors actually need.',
      'Defined the path out to SCORM and certificates.',
      'Built with Sahachat Sonnenburg (product design & engineering) within the Multikunst collective, AI-coded with Cursor.',
    ],
    result: [
      'Working product with 15+ interactive module formats, SCORM export, local library, signed certificates.',
      'Live studio without an account.',
    ],
    tools: ['React', 'OpenRouter', 'SCORM', 'Cursor'],
    media: [
      { kind: 'image', src: '/tools/lernwerk/hero.webp', alt: 'Lernwerk landing' },
      { kind: 'image', src: '/tools/lernwerk/editor.webp', alt: 'Lernwerk editor' },
      { kind: 'image', src: '/tools/lernwerk/course-preview.webp', alt: 'Course preview' },
      { kind: 'image', src: '/tools/lernwerk/certificate.webp', alt: 'Certificate' },
    ],
    links: [
      { href: 'https://lernwerk-flame.vercel.app/', label: 'Open Lernwerk' },
      { href: 'https://www.sahachat-sonnenburg.com/work/lernwerk', label: 'Design case' },
    ],
  },
  {
    id: 'kigali',
    index: '02',
    title: 'Kigali — interactive inverter exercise at eLearning Africa',
    kicker: 'Learning experience · eLearning Africa 2024, German Pavilion',
    summary:
      'An interactive VR/AR exercise on mounting an inverter, shown on our own stand at eLearning Africa in Kigali — real footage from the floor.',
    action: [
      'Owned the booth narrative and stakeholder timelines from rehearsal to live floor.',
      'Coordinated the XR build with third-party developers and freelancers.',
    ],
    result: ['Hands-on exercise run live with visitors at the German Pavilion.'],
    tools: ['Unreal Engine', 'Blender', 'Archicad'],
    media: [
      // TODO(Artjom): confirm which clip shows the inverter exercise best.
      { kind: 'video', src: '/projects/elearning-africa-kigali-2024/expokigali-demo-vr-test.webm', poster: '/projects/elearning-africa-kigali-2024/Kigali_Gameplay_Thumbnail.jpg', alt: 'Kigali inverter exercise' },
      { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp', alt: 'Booth in Kigali' },
      { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp', alt: 'AR build' },
    ],
  },
  {
    id: 'sokra',
    index: '03',
    title: 'Sokra — AI processes for a school e-learning company',
    kicker: 'EdTech · Berlin · March–May 2026',
    summary:
      'Three months at Sokra, which builds personalized AI learning for classrooms. I worked on internal AI processes and communication paths to schools — I did not found the company or build the product.',
    action: [
      'Tightened internal processes with AI so work did not live in one-off chats.',
      'Built communication paths to individual public and private schools.',
    ],
    result: ['Direct experience with the B2G / school segment of e-learning.'],
    tools: ['AI processes', 'School communication'],
    media: [
      { kind: 'video', src: '/tools/sokra/tile-preview.mp4', poster: '/tools/sokra/tile-poster.webp', alt: 'Sokra product' },
      { kind: 'image', src: '/tools/sokra/class-feedback.webp', alt: 'Class feedback' },
    ],
    links: [{ href: 'https://sokra.io/de', label: 'sokra.io' }],
    note: 'Screens show Sokra’s product.',
  },
];

export const CASES: CaseStudy[] = [
  {
    id: 'production',
    index: '04',
    title: 'Building a course production from zero',
    kicker: 'Head of Production · role & results',
    summary:
      'Built the production department from the ground up — starting with film-based course production — and led it as Head of Production.',
    action: [
      'Hired and structured the team: 3 After Effects, 6 editors, 6 2D, 6 3D artists, plus 2 project managers in India — 23 direct reports.',
      'Assigned teams per course, set roadmap and outlook, owned staffing and the production budget calculation.',
      'Steered freelancers, voice talent and external subject-matter experts from universities and companies; aligned with the editorial team and its instructional designers.',
      'Reported to stakeholders, the CTO and the CEO.',
    ],
    result: ['KPI of six courses per year met and held — from 2025, six courses of ~30 hours each.'],
    tools: ['Production planning', 'Team leadership', 'Budgeting'],
    media: [
      { kind: 'image', src: '/tools/dadb-course-overview/team-1.jpg', alt: 'Production team' },
    ],
    note: 'No course content shown — only own material.',
  },
  {
    id: 'heygen',
    index: '05',
    title: 'Replacing voice talent with AI avatars — €380k saved per year',
    kicker: 'Workflow · HeyGen × Virtual Production',
    summary: 'Each course had its own, expensive narrator — around €380,000 per year.',
    problem: 'Expensive voice talent per course, about €380,000 per year.',
    action: ['Built a workflow with my team that replaces narrators with digital avatars in HeyGen.'],
    result: ['€380,000 saved per year.'],
    tools: ['HeyGen', 'Unreal Engine'],
    media: [{ kind: 'placeholder', label: 'Own HeyGen + Virtual Production demo (to be produced — no course footage)' }],
  },
  {
    id: 'ai-department',
    index: '06',
    title: 'Setting up an AI department',
    kicker: 'Change management · AI in course production',
    summary:
      'Built an AI department and pushed for everyone to train quickly in AI and to create and improve courses directly with AI.',
    action: ['Introduced AI tools such as HeyGen, Synthesia and ElevenLabs into voice, presenter and video pipelines while keeping editorial control in-house.'],
    result: ['Courses created and improved directly with AI across the production.'],
    tools: ['HeyGen', 'Synthesia', 'ElevenLabs'],
    media: [{ kind: 'placeholder', label: 'Visual for AI department / workflow diagram (missing)' }],
  },
  {
    id: 'elearning-africa',
    index: '07',
    title: 'VR & AR at eLearning Africa — Dakar 2023 and Kigali 2024',
    kicker: 'Learning experience · German Pavilion, own stand',
    summary:
      'Two appearances with interactive exercises. In Dakar I built the VR exercise myself; in Kigali an interactive VR exercise on mounting an inverter was built with third parties and freelancers.',
    action: [
      'Dakar: scene choreography, onboarding flow, Unreal deployment and live operator support.',
      'Kigali: booth narrative, XR coordination, rollout on the floor.',
    ],
    result: ['Two live booths with hands-on learning exercises.'],
    tools: ['Unreal Engine', 'Blender', 'Archicad'],
    media: [
      { kind: 'video', src: '/projects/elearning-africa-dakar-senegal-2023/linkedin-vr-trailer.webm', poster: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07-thumb.jpg', alt: 'Dakar VR trailer' },
      { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp', alt: 'Dakar VR scene' },
      { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_ConventionCenter.jpg', alt: 'Kigali Convention Center' },
    ],
  },
  {
    id: 'course-overview',
    index: '08',
    title: 'Course Overview Tool — one live view of the pipeline',
    kicker: 'Internal tool · built with Cursor',
    summary: 'The production was losing track of course progress.',
    problem: 'The production was losing track of course progress.',
    action: [
      'Wrote the Course Overview Tool myself.',
      'PMs logged status in Excel; the tool synced twice a day and showed progress per course with percentages and timelines.',
    ],
    result: ['Used by everyone, running on large screens in the office. Still online (names changed).'],
    tools: ['Next.js', 'React', 'Tailwind', 'Cursor'],
    media: [
      { kind: 'image', src: '/tools/dadb-course-overview/thumbnail.jpg', alt: 'Course Overview Tool' },
      { kind: 'image', src: '/tools/dadb-course-overview/course-1.jpg', alt: 'Overview' },
    ],
    links: [{ href: 'https://v0-image-analysis-taupe-beta.vercel.app', label: 'Open the tool' }],
  },
  {
    id: 'digital-campus',
    index: '09',
    title: 'Digital Campus & leXsolar — learning in 3D',
    kicker: 'Learning design · Solar Technician · passion project inside the company',
    summary:
      'A walkable digital campus where learners build and mount solar panels and learn the basics of electrical engineering — plus a digital twin of leXsolar’s physical solar learning kits.',
    action: [
      'Visualised the campus in Blender and Archicad, built it in Unreal.',
      'leXsolar: Blender assets and a Unity learning game, from partner workshops to prototype milestones with editorial and SMEs.',
    ],
    result: ['Campus concept worked out in depth; leXsolar prototype aligned stakeholders on scaling hands-on labs digitally.'],
    tools: ['Unreal Engine', 'Blender', 'Archicad', 'Unity'],
    media: [
      { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/campus-hero.webp', alt: 'Digital Campus' },
      { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/solarpark-manage-01.webp', alt: 'Solar park' },
      { kind: 'video', src: '/projects/lexsolar-digital-learning-kit/whole-exercise-gameplay.webm', poster: '/projects/lexsolar-digital-learning-kit/ingame-05.webp', alt: 'leXsolar exercise' },
    ],
  },
  {
    id: 'learning-games',
    index: '10',
    title: 'Learning games & Virtual Production',
    kicker: 'Unreal Engine · where I started',
    summary:
      'I came in through Virtual Production after studying architecture, then used Unreal for virtual-production parts, small learning games and VR applications.',
    action: ['E-mobility explainer: visualised recuperation in Unreal, filmed it, added After Effects animation, cut in Premiere.'],
    result: ['Own Unreal and 3D work that can be shown without course content.'],
    tools: ['Unreal Engine', 'Blender', 'After Effects', 'Premiere'],
    media: [
      { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video.webp', alt: 'E-mobility explainer' },
      { kind: 'placeholder', label: 'Own Virtual Production demo reel (missing)' },
    ],
  },
];

export const STRENGTHS = [
  'Calm under pressure, open ear for the team, enjoy solving problems and taking responsibility.',
  'Talk at eye level with producers, editors, 2D/3D artists and programmers (Unreal, Unity, Godot).',
  'Energy from planning with teams: course structure, content, faster production at the same quality.',
];

export const MORE = [
  { title: 'Skyhaven', text: 'Desktop widget RPG — experiment in how far AI can go. Everything visible is AI-generated, all code AI-written. In progress.', href: 'https://coincraft-skyhaven.vercel.app/en/' },
  { title: 'Occupied', text: 'VFX tool for music-driven visuals. 66 users, used live at Bunker West.' },
  { title: 'Multikunst', text: '3D collective for joint projects — Lernwerk and Occupied started here.' },
];
