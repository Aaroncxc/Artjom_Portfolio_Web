/**
 * Portfolio v3 (e-learning focus). Bilingual EN/DE content.
 */
export type Locale = 'en' | 'de';

export type Media =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster?: string; alt: string }
  | { kind: 'workflow'; variant: 'heygen' | 'ai-department' | 'virtual-production' };

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

export interface PortfolioContent {
  contact: {
    name: string;
    phone: string;
    phoneHref: string;
    email: string;
    location: string;
    education: string;
    cert: string;
    languages: string;
    toolsLine: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    roles: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: { value: string; label: string }[];
  ui: {
    work: string;
    cases: string;
    about: string;
    contact: string;
    selectedWork: string;
    casesHeading: string;
    howIWork: string;
    background: string;
    alsoBuilding: string;
    whatIDid: string;
    result: string;
    footerHeadline: string;
    langEn: string;
    langDe: string;
  };
  featured: CaseStudy[];
  cases: CaseStudy[];
  strengths: string[];
  more: { title: string; text: string; href?: string }[];
}

const EMAIL = 'a.naninjan@googlemail.com';

const en: PortfolioContent = {
  contact: {
    name: 'Artjom Naninjan',
    phone: '0163 8655190',
    phoneHref: 'tel:+491638655190',
    email: EMAIL,
    location: 'Berlin · remote / hybrid',
    education: 'B.Sc. Architecture, BHT Berlin 2016–2020',
    cert: 'IHK-certified Project Manager',
    languages: 'German, English, Russian (business fluent)',
    toolsLine: 'Tools: Unreal Engine, Blender, Archicad, Adobe (AE, Premiere), Cursor',
  },
  hero: {
    eyebrow: 'E-Learning · Production & Product Management',
    headline: 'I build e-learning productions that deliver.',
    sub: 'Head of Production — 23 direct reports, six 30-hour courses per year, €380k saved annually through AI avatars.',
    roles: ['Head of Production', 'Senior Project Manager'],
    ctaPrimary: 'Get in touch',
    ctaSecondary: 'See the work',
  },
  stats: [
    { value: '23', label: 'direct reports (AE, editing, 2D, 3D, 2 PMs in India)' },
    { value: '6 × 30 h', label: 'courses per year — KPI met and held' },
    { value: '€380k', label: 'saved per year with an AI avatar workflow' },
    { value: '2×', label: 'eLearning Africa booths with VR / AR exercises' },
  ],
  ui: {
    work: 'Work',
    cases: 'Case studies',
    about: 'About',
    contact: 'Contact',
    selectedWork: 'Selected work',
    casesHeading: 'Case studies · production leadership in e-learning',
    howIWork: 'How I work',
    background: 'Background',
    alsoBuilding: 'Also building',
    whatIDid: 'What I did',
    result: 'Result',
    footerHeadline: 'Let’s talk about course production and learning products.',
    langEn: 'EN',
    langDe: 'DE',
  },
  featured: [
    {
      id: 'production',
      index: '01',
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
      media: [{ kind: 'image', src: '/tools/dadb-course-overview/team-1.jpg', alt: 'Production team' }],
      note: 'No course content shown — only own material.',
    },
    {
      id: 'heygen',
      index: '02',
      title: 'Replacing voice talent with AI avatars — €380k saved per year',
      kicker: 'Workflow · HeyGen × Virtual Production',
      summary: 'Each course had its own, expensive narrator — around €380,000 per year.',
      action: ['Built a workflow with my team that replaces narrators with digital avatars in HeyGen.'],
      result: ['€380,000 saved per year.'],
      tools: ['HeyGen', 'Unreal Engine'],
      media: [{ kind: 'workflow', variant: 'heygen' }],
    },
    {
      id: 'lernwerk',
      index: '03',
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
  ],
  cases: [
    {
      id: 'sokra',
      index: '04',
      title: 'Sokra — AI processes for a school e-learning company',
      kicker: 'EdTech · Berlin · March–May 2026',
      summary:
        'Three months on the Sokra team, building personalized AI learning for classrooms: internal AI processes and communication channels to public and private schools.',
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
    {
      id: 'ai-department',
      index: '05',
      title: 'Setting up an AI department',
      kicker: 'Change management · AI in course production',
      summary:
        'Built an AI department and pushed for everyone to train quickly in AI and to create and improve courses directly with AI.',
      action: [
        'Introduced HeyGen, Synthesia and ElevenLabs for voice and presenter pipelines; used AI to strengthen script work and editorial feedback loops — editorial control stayed in-house.',
      ],
      result: ['Courses created and improved directly with AI across the production.'],
      tools: ['HeyGen', 'Synthesia', 'ElevenLabs'],
      media: [{ kind: 'workflow', variant: 'ai-department' }],
    },
    {
      id: 'course-overview',
      index: '06',
      title: 'Course Overview Tool — one live view of the pipeline',
      kicker: 'Internal tool · built with Cursor',
      summary: 'The production was losing track of course progress.',
      action: [
        'Wrote the Course Overview Tool myself.',
        'PMs logged status in Excel; the tool synced twice a day and showed progress per course with percentages and timelines.',
      ],
      result: ['Used by everyone, running on large screens in the office. Still online (names changed).'],
      tools: ['Next.js', 'React', 'Tailwind', 'Cursor'],
      media: [
        { kind: 'image', src: '/tools/dadb-course-overview/course-1.jpg', alt: 'Overview' },
        { kind: 'image', src: '/tools/dadb-course-overview/course-5.jpg', alt: 'KPI dashboard' },
      ],
      links: [{ href: 'https://v0-image-analysis-taupe-beta.vercel.app', label: 'Open the tool' }],
    },
    {
      id: 'digital-campus',
      index: '07',
      title: 'Digital Campus & leXsolar — learning in 3D',
      kicker: 'Learning design · Solar Technician · passion project inside the company',
      summary:
        'Vocational training in Africa needs solar technicians at scale — a course was built with Hochschule Offenburg as the German partner. Delivery layers: walkable digital campus plus leXsolar’s training kit, visualised and mirrored digitally.',
      action: [
        'Visualised the campus in Blender and Archicad, built it in Unreal.',
        'leXsolar: Blender assets and a Unity learning game, from partner workshops to prototype milestones with editorial and SMEs.',
      ],
      result: [
        'Campus concept worked out in depth; leXsolar prototype aligned stakeholders on scaling hands-on labs digitally.',
      ],
      tools: ['Unreal Engine', 'Blender', 'Archicad', 'Unity'],
      media: [
        { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/campus-hero.webp', alt: 'Digital Campus' },
        { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/solarpark-manage-01.webp', alt: 'Solar park' },
        {
          kind: 'video',
          src: '/projects/lexsolar-digital-learning-kit/whole-exercise-gameplay.webm',
          poster: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
          alt: 'leXsolar exercise',
        },
      ],
    },
    {
      id: 'learning-games',
      index: '08',
      title: 'Learning games & Virtual Production',
      kicker: 'Unreal Engine · where I started',
      summary:
        'I came in through Virtual Production after studying architecture, then used Unreal for virtual-production parts, small learning games and VR applications.',
      action: [
        'E-mobility explainer: visualised recuperation in Unreal, filmed it, added After Effects animation, cut in Premiere.',
      ],
      result: ['Own Unreal and 3D work that can be shown without course content.'],
      tools: ['Unreal Engine', 'Blender', 'After Effects', 'Premiere'],
      media: [{ kind: 'workflow', variant: 'virtual-production' }],
    },
    {
      id: 'kigali',
      index: '09',
      title: 'Kigali — interactive inverter exercise at eLearning Africa',
      kicker: 'Learning experience · eLearning Africa 2024, German Pavilion',
      summary:
        'Same solar-technician training line for Africa’s vocational market — live at eLearning Africa Kigali: interactive inverter exercise on the German Pavilion stand (floor footage).',
      action: [
        'Owned the booth narrative and stakeholder timelines from rehearsal to live floor.',
        'Coordinated the XR build with third-party developers and freelancers.',
      ],
      result: ['Hands-on exercise run live with visitors at the German Pavilion.'],
      tools: ['Unreal Engine', 'Blender', 'Archicad'],
      media: [
        {
          kind: 'video',
          src: '/projects/elearning-africa-kigali-2024/expokigali-demo-vr-test.webm',
          poster: '/projects/elearning-africa-kigali-2024/Kigali_Gameplay_Thumbnail.jpg',
          alt: 'Kigali inverter exercise',
        },
        { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp', alt: 'Booth in Kigali' },
        { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp', alt: 'AR build' },
      ],
    },
    {
      id: 'elearning-africa',
      index: '10',
      title: 'VR & AR at eLearning Africa — Dakar 2023 and Kigali 2024',
      kicker: 'Learning experience · German Pavilion, own stand',
      summary:
        'Solar technician course context — two German Pavilion booths (Dakar 2023, Kigali 2024) with hands-on VR/AR exercises that make the training tangible on the fair floor.',
      action: [
        'Dakar: scene choreography, onboarding flow, Unreal deployment and live operator support.',
        'Kigali: booth narrative, XR coordination, rollout on the floor.',
      ],
      result: ['Two live booths with hands-on learning exercises.'],
      tools: ['Unreal Engine', 'Blender', 'Archicad'],
      media: [
        {
          kind: 'video',
          src: '/projects/elearning-africa-dakar-senegal-2023/linkedin-vr-trailer.webm',
          poster: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07-thumb.jpg',
          alt: 'Dakar VR trailer',
        },
        { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp', alt: 'Dakar VR scene' },
        { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_ConventionCenter.jpg', alt: 'Kigali Convention Center' },
      ],
    },
  ],
  strengths: [
    'Calm under pressure, open ear for the team, enjoy solving problems and taking responsibility.',
    'Talk at eye level with producers, editors, 2D/3D artists and programmers (Unreal, Unity, Godot).',
    'Energy from planning with teams: course structure, content, faster production at the same quality.',
  ],
  more: [
    {
      title: 'Skyhaven',
      text: 'Desktop widget RPG — experiment in how far AI can go. Everything visible is AI-generated, all code AI-written. In progress.',
      href: 'https://coincraft-skyhaven.vercel.app/en/',
    },
    { title: 'Occupied', text: 'VFX tool for music-driven visuals. 66 users, used live at Bunker West.' },
    { title: 'Multikunst', text: '3D collective for joint projects — Lernwerk and Occupied started here.' },
  ],
};

const de: PortfolioContent = {
  contact: {
    name: 'Artjom Naninjan',
    phone: '0163 8655190',
    phoneHref: 'tel:+491638655190',
    email: EMAIL,
    location: 'Berlin · remote / hybrid',
    education: 'B.Sc. Architektur, BHT Berlin 2016–2020',
    cert: 'IHK-zertifizierter Projektmanager',
    languages: 'Deutsch, Englisch, Russisch (verhandlungssicher)',
    toolsLine: 'Tools: Unreal Engine, Blender, Archicad, Adobe (AE, Premiere), Cursor',
  },
  hero: {
    eyebrow: 'E-Learning · Produktion & Produktmanagement',
    headline: 'Ich baue E-Learning-Produktionen, die liefern.',
    sub: 'Head of Production — 23 direct reports, sechs 30-Stunden-Kurse pro Jahr, 380.000 € jährlich durch KI-Avatare eingespart.',
    roles: ['Head of Production', 'Senior Projektmanager'],
    ctaPrimary: 'Kontakt',
    ctaSecondary: 'Arbeit ansehen',
  },
  stats: [
    { value: '23', label: 'direct reports (AE, Schnitt, 2D, 3D, 2 PMs in Indien)' },
    { value: '6 × 30 h', label: 'Kurse pro Jahr — KPI erreicht und gehalten' },
    { value: '380.000 €', label: 'jährlich durch KI-Avatar-Workflow eingespart' },
    { value: '2×', label: 'eLearning Africa mit VR / AR-Übungen' },
  ],
  ui: {
    work: 'Arbeit',
    cases: 'Case Studies',
    about: 'Profil',
    contact: 'Kontakt',
    selectedWork: 'Ausgewählte Projekte',
    casesHeading: 'Case Studies · Produktionsführung im E-Learning',
    howIWork: 'So arbeite ich',
    background: 'Hintergrund',
    alsoBuilding: 'Außerdem',
    whatIDid: 'Was ich gemacht habe',
    result: 'Ergebnis',
    footerHeadline: 'Sprechen wir über Kursproduktion und Lernprodukte.',
    langEn: 'EN',
    langDe: 'DE',
  },
  featured: [
    {
      id: 'production',
      index: '01',
      title: 'Kursproduktion von null aufgebaut',
      kicker: 'Head of Production · Rolle & Ergebnisse',
      summary:
        'Produktionsabteilung von Grund auf aufgebaut — beginnend mit filmischer Kursproduktion — und als Head of Production geführt.',
      action: [
        'Team aufgebaut und strukturiert: 3 After Effects, 6 Cutter, 6 2D-, 6 3D-Artists plus 2 Projektmanager in Indien — 23 direct reports.',
        'Teams pro Kurs zugewiesen, Roadmap und Ausblick gesetzt, Personalplanung und Produktionsbudget-Kalkulation verantwortet.',
        'Freelancer, Sprecher und externe Fachexperten aus Hochschulen und Unternehmen gesteuert; Abstimmung mit Redaktion und Instructional Design.',
        'Reporting an Stakeholder, CTO und CEO.',
      ],
      result: ['KPI von sechs Kursen pro Jahr erreicht und gehalten — ab 2025 sechs Kurse à ca. 30 Stunden.'],
      tools: ['Produktionsplanung', 'Teamführung', 'Budgetierung'],
      media: [{ kind: 'image', src: '/tools/dadb-course-overview/team-1.jpg', alt: 'Produktionsteam' }],
      note: 'Kein Kursinhalt gezeigt — nur eigenes Material.',
    },
    {
      id: 'heygen',
      index: '02',
      title: 'Sprecher durch KI-Avatare ersetzt — 380.000 € pro Jahr gespart',
      kicker: 'Workflow · HeyGen × Virtual Production',
      summary: 'Jeder Kurs hatte einen eigenen, teuren Sprecher — rund 380.000 € pro Jahr.',
      action: ['Mit dem Team einen Workflow gebaut, der Sprecher durch digitale Avatare in HeyGen ersetzt.'],
      result: ['380.000 € pro Jahr eingespart.'],
      tools: ['HeyGen', 'Unreal Engine'],
      media: [{ kind: 'workflow', variant: 'heygen' }],
    },
    {
      id: 'lernwerk',
      index: '03',
      title: 'Lernwerk — KI-Autorenstudio für ganze Kurse',
      kicker: 'Lernprodukt · 2026 — aktiv',
      summary:
        'Local-first Autorenstudio: Briefing → generierter Kurs → visuelles Editing → SCORM-Export und verifizierbares Zertifikat. Kein Nutzerkonto nötig.',
      action: [
        'Lernprodukt-Seite verantwortet: wie aus einem Briefing ein Kurs wird und welche Modulformate Autoren brauchen.',
        'Weg zu SCORM und Zertifikaten definiert.',
        'Mit Sahachat Sonnenburg (Produktdesign & Engineering) im Kollektiv Multikunst gebaut, mit Cursor AI-coded.',
      ],
      result: [
        'Laufendes Produkt mit 15+ interaktiven Modulformaten, SCORM-Export, lokaler Bibliothek, signierten Zertifikaten.',
        'Live-Studio ohne Account.',
      ],
      tools: ['React', 'OpenRouter', 'SCORM', 'Cursor'],
      media: [
        { kind: 'image', src: '/tools/lernwerk/hero.webp', alt: 'Lernwerk Landing' },
        { kind: 'image', src: '/tools/lernwerk/editor.webp', alt: 'Lernwerk Editor' },
        { kind: 'image', src: '/tools/lernwerk/course-preview.webp', alt: 'Kursvorschau' },
        { kind: 'image', src: '/tools/lernwerk/certificate.webp', alt: 'Zertifikat' },
      ],
      links: [
        { href: 'https://lernwerk-flame.vercel.app/', label: 'Lernwerk öffnen' },
        { href: 'https://www.sahachat-sonnenburg.com/work/lernwerk', label: 'Design Case' },
      ],
    },
  ],
  cases: [
    {
      id: 'sokra',
      index: '04',
      title: 'Sokra — KI-Prozesse für ein Schul-E-Learning-Unternehmen',
      kicker: 'EdTech · Berlin · März–Mai 2026',
      summary:
        'Drei Monate im Sokra-Team für personalisiertes KI-Lernen im Klassenzimmer: interne KI-Prozesse und Kommunikationswege zu öffentlichen und privaten Schulen.',
      action: [
        'Interne Abläufe mit KI verschlankt, damit Arbeit nicht in Einzel-Chats verschwindet.',
        'Kommunikationswege zu einzelnen öffentlichen und privaten Schulen aufgebaut.',
      ],
      result: ['Direkte Erfahrung im B2G-/Schulsegment des E-Learnings.'],
      tools: ['KI-Prozesse', 'Schulkommunikation'],
      media: [
        { kind: 'video', src: '/tools/sokra/tile-preview.mp4', poster: '/tools/sokra/tile-poster.webp', alt: 'Sokra Produkt' },
        { kind: 'image', src: '/tools/sokra/class-feedback.webp', alt: 'Klassen-Feedback' },
      ],
      links: [{ href: 'https://sokra.io/de', label: 'sokra.io' }],
      note: 'Screenshots zeigen Sokras Produkt.',
    },
    {
      id: 'ai-department',
      index: '05',
      title: 'KI-Abteilung aufgebaut',
      kicker: 'Change Management · KI in der Kursproduktion',
      summary:
        'KI-Abteilung aufgebaut und darauf gedrängt, dass alle schnell in KI trainieren und Kurse direkt mit KI erstellen und verbessern.',
      action: [
        'HeyGen, Synthesia und ElevenLabs für Sprecher- und Presenter-Pipelines; Skriptarbeit und Feedbackschleifen mit der Redaktion KI-gestützt verbessert — redaktionelle Kontrolle blieb in-house.',
      ],
      result: ['Kurse in der gesamten Produktion direkt mit KI erstellt und verbessert.'],
      tools: ['HeyGen', 'Synthesia', 'ElevenLabs'],
      media: [{ kind: 'workflow', variant: 'ai-department' }],
    },
    {
      id: 'course-overview',
      index: '06',
      title: 'Course Overview Tool — eine Live-Ansicht der Pipeline',
      kicker: 'Internes Tool · mit Cursor gebaut',
      summary: 'Die Produktion verlor den Überblick über den Kursfortschritt.',
      action: [
        'Course Overview Tool selbst geschrieben.',
        'PMs trugen Status in Excel ein; das Tool synchronisierte zweimal täglich und zeigte Fortschritt pro Kurs mit Prozenten und Timelines.',
      ],
      result: ['Von allen genutzt, auf großen Screens im Büro. Noch online (Namen geändert).'],
      tools: ['Next.js', 'React', 'Tailwind', 'Cursor'],
      media: [
        { kind: 'image', src: '/tools/dadb-course-overview/course-1.jpg', alt: 'Übersicht' },
        { kind: 'image', src: '/tools/dadb-course-overview/course-5.jpg', alt: 'KPI-Dashboard' },
      ],
      links: [{ href: 'https://v0-image-analysis-taupe-beta.vercel.app', label: 'Tool öffnen' }],
    },
    {
      id: 'digital-campus',
      index: '07',
      title: 'Digital Campus & leXsolar — Lernen in 3D',
      kicker: 'Learning Design · Solar Technician · Passion Project im Unternehmen',
      summary:
        'Berufsausbildung in Afrika braucht Solarteure — Kurs mit Hochschule Offenburg als deutschem Partner. Umsetzung: begehbarer Digital Campus plus leXsolar-Koffer, visualisiert und digital gespiegelt.',
      action: [
        'Campus in Blender und Archicad visualisiert, in Unreal umgesetzt.',
        'leXsolar: Blender-Assets und Unity-Lernspiel, von Partner-Workshops bis Prototyp-Meilensteine mit Redaktion und SMEs.',
      ],
      result: [
        'Campus-Konzept vertieft ausgearbeitet; leXsolar-Prototyp aligned Stakeholder für digitale Hands-on-Labs.',
      ],
      tools: ['Unreal Engine', 'Blender', 'Archicad', 'Unity'],
      media: [
        { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/campus-hero.webp', alt: 'Digital Campus' },
        { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/solarpark-manage-01.webp', alt: 'Solarpark' },
        {
          kind: 'video',
          src: '/projects/lexsolar-digital-learning-kit/whole-exercise-gameplay.webm',
          poster: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
          alt: 'leXsolar Übung',
        },
      ],
    },
    {
      id: 'learning-games',
      index: '08',
      title: 'Lernspiele & Virtual Production',
      kicker: 'Unreal Engine · Einstieg',
      summary:
        'Einstieg über Virtual Production nach Architekturstudium, danach Unreal für VP-Anteile, kleine Lernspiele und VR-Anwendungen.',
      action: [
        'E-Mobility-Erklärvideo: Rekuperation in Unreal visualisiert, gefilmt, After-Effects-Animation, Schnitt in Premiere.',
      ],
      result: ['Eigenes Unreal- und 3D-Material ohne Kursinhalte zeigbar.'],
      tools: ['Unreal Engine', 'Blender', 'After Effects', 'Premiere'],
      media: [{ kind: 'workflow', variant: 'virtual-production' }],
    },
    {
      id: 'kigali',
      index: '09',
      title: 'Kigali — interaktive Wechselrichter-Übung auf der eLearning Africa',
      kicker: 'Learning Experience · eLearning Africa 2024, Deutscher Pavillon',
      summary:
        'Solarteur-Ausbildungslinie für den afrikanischen Berufsbildungsmarkt — live auf der eLearning Africa in Kigali: interaktive Wechselrichter-Übung im Deutschen Pavillon (Messeboden).',
      action: [
        'Stand-Narrative und Stakeholder-Timelines von Probe bis Live-Betrieb verantwortet.',
        'XR-Umsetzung mit externen Entwicklern und Freelancern koordiniert.',
      ],
      result: ['Hands-on-Übung live mit Besuchern im Deutschen Pavillon.'],
      tools: ['Unreal Engine', 'Blender', 'Archicad'],
      media: [
        {
          kind: 'video',
          src: '/projects/elearning-africa-kigali-2024/expokigali-demo-vr-test.webm',
          poster: '/projects/elearning-africa-kigali-2024/Kigali_Gameplay_Thumbnail.jpg',
          alt: 'Kigali Wechselrichter-Übung',
        },
        { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp', alt: 'Stand in Kigali' },
        { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp', alt: 'AR-Build' },
      ],
    },
    {
      id: 'elearning-africa',
      index: '10',
      title: 'VR & AR auf der eLearning Africa — Dakar 2023 und Kigali 2024',
      kicker: 'Learning Experience · Deutscher Pavillon, eigener Stand',
      summary:
        'Solarteur-Kurs-Kontext — zwei Messestände im Deutschen Pavillon (Dakar 2023, Kigali 2024) mit Hands-on-VR/AR-Übungen, die die Ausbildung auf der Messe erlebbar machen.',
      action: [
        'Dakar: Szenen-Choreografie, Onboarding-Flow, Unreal-Deployment und Live-Support.',
        'Kigali: Stand-Narrative, XR-Koordination, Rollout auf der Messe.',
      ],
      result: ['Zwei Live-Stände mit Hands-on-Lernübungen.'],
      tools: ['Unreal Engine', 'Blender', 'Archicad'],
      media: [
        {
          kind: 'video',
          src: '/projects/elearning-africa-dakar-senegal-2023/linkedin-vr-trailer.webm',
          poster: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07-thumb.jpg',
          alt: 'Dakar VR Trailer',
        },
        { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp', alt: 'Dakar VR-Szene' },
        { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_ConventionCenter.jpg', alt: 'Kigali Convention Center' },
      ],
    },
  ],
  strengths: [
    'Ruhe unter Druck, offenes Ohr fürs Team, Freude an Problemlösung und Verantwortung.',
    'Auf Augenhöhe mit Producern, Cutter, 2D/3D-Artists und Programmierern (Unreal, Unity, Godot).',
    'Energie aus Planung mit Teams: Kursstruktur, Inhalte, schnellere Produktion bei gleicher Qualität.',
  ],
  more: [
    {
      title: 'Skyhaven',
      text: 'Desktop-Widget-RPG — Experiment, wie weit KI reicht. Alles Sichtbare KI-generiert, Code KI-geschrieben. In Arbeit.',
      href: 'https://coincraft-skyhaven.vercel.app/en/',
    },
    { title: 'Occupied', text: 'VFX-Tool für musikgetriebene Visuals. 66 Nutzer, live im Bunker West.' },
    { title: 'Multikunst', text: '3D-Kollektiv für gemeinsame Projekte — Lernwerk und Occupied starteten hier.' },
  ],
};

export function getV3Content(locale: Locale): PortfolioContent {
  return locale === 'de' ? de : en;
}

/** @deprecated use getV3Content — kept so older imports fail loudly at compile time if any remain */
export const CONTACT = en.contact;
export const HERO = en.hero;
