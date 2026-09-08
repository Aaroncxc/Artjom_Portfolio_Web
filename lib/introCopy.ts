/**
 * Bilingual copy for /intro pitch deck.
 * Facts only — sourced from MASTER_PROFIL / AboutSection. No invented claims.
 */

export type IntroLang = 'en' | 'de';

export type Localized = Record<IntroLang, string>;

export function pick(copy: Localized, lang: IntroLang): string {
  return copy[lang];
}

export const INTRO_WORK_HREF = '/?skipHero=true';
export const INTRO_LINKEDIN =
  'https://www.linkedin.com/in/artjom-naninjan-5136b1203';

export const INTRO_NAV_LINE: Localized = {
  en: 'Two minutes. Then the work.',
  de: 'Zwei Minuten. Dann die Arbeit.',
};

export const CHROME = {
  index: { en: 'Index', de: 'Index' } satisfies Localized,
  seeWork: { en: 'See the work', de: 'Zur Arbeit' } satisfies Localized,
  seeWorkHint: {
    en: 'Full portfolio on the main page',
    de: 'Gesamtes Portfolio auf der Hauptseite',
  } satisfies Localized,
  hireMe: { en: 'Hire Me', de: 'Kontakt' } satisfies Localized,
  prev: { en: 'Previous slide', de: 'Vorherige Folie' } satisfies Localized,
  next: { en: 'Next slide', de: 'Nächste Folie' } satisfies Localized,
  of: { en: 'of', de: 'von' } satisfies Localized,
  langEn: 'EN',
  langDe: 'DE',
} as const;

export type IntroSlideId =
  | 'cover'
  | 'path'
  | 'scale'
  | 'production'
  | 'built'
  | 'shipped'
  | 'differentiators'
  | 'why'
  | 'partners'
  | 'close';

export type IntroLayout =
  | 'hero'
  | 'timeline'
  | 'facts'
  | 'split'
  | 'gallery'
  | 'feature'
  | 'triptych'
  | 'chips'
  | 'partners'
  | 'mosaic';

export type IntroMediaItem = {
  src: string;
  alt: Localized;
  href?: string;
  /** object-cover focus, e.g. '50% 20%' */
  focus?: string;
};

export type ProjectCard = {
  /** Stable id for Built logo → preview mapping */
  id?: string;
  title: Localized;
  blurb: Localized;
  href?: string;
  thumb?: string;
  meta?: Localized;
  /** Larger tile in gallery/feature layouts */
  featured?: boolean;
};

export type TimelineStop = {
  period: Localized;
  title: Localized;
  blurb: Localized;
  href?: string;
};

export type ChipItem = {
  label: Localized;
  icon?: string;
  /** Built-slide preview target (`ProjectCard.id`) */
  previewId?: string;
};

/** Honest toolkit — Stark + Solide only (MASTER_PROFIL). */
export const INTRO_TOOLKIT_CHIPS: ChipItem[] = [
  {
    label: { en: 'Blender', de: 'Blender' },
    icon: '/tool-icons/blender.png',
    previewId: 'multiply',
  },
  {
    label: { en: 'Unreal Engine', de: 'Unreal Engine' },
    icon: '/tool-icons/unreal-engine.png',
    previewId: 'dakar',
  },
  {
    label: { en: 'Unity', de: 'Unity' },
    icon: '/tool-icons/unity.svg',
    previewId: 'lexsolar',
  },
  {
    label: { en: 'Archicad', de: 'Archicad' },
    icon: '/tool-icons/archicad.png',
    previewId: 'the-house',
  },
  {
    label: { en: 'Figma', de: 'Figma' },
    icon: '/tool-icons/figma.svg',
    previewId: 'course-overview',
  },
  {
    label: { en: 'Cursor', de: 'Cursor' },
    icon: '/tool-icons/cursor.svg',
    previewId: 'skyhaven',
  },
  {
    label: { en: 'Adobe AE / Premiere', de: 'Adobe AE / Premiere' },
    icon: '/tool-icons/adobe.svg',
    previewId: 'multiply',
  },
  {
    label: { en: 'GitHub', de: 'GitHub' },
    icon: '/tool-icons/github.svg',
    previewId: 'skyhaven',
  },
  {
    label: { en: 'React / Next.js', de: 'React / Next.js' },
    icon: '/tool-icons/react.svg',
    previewId: 'skyhaven',
  },
  {
    label: { en: 'Three.js / R3F', de: 'Three.js / R3F' },
    icon: '/tool-icons/threejs.svg',
    previewId: 'occupied',
  },
  {
    label: { en: 'TypeScript', de: 'TypeScript' },
    previewId: 'skyhaven',
  },
  {
    label: { en: 'Tauri', de: 'Tauri' },
    previewId: 'skyhaven',
  },
];

export type IntroSlideDef = {
  id: IntroSlideId;
  layout: IntroLayout;
  /** Short label for index / progress */
  label: Localized;
  kicker: Localized;
  title: Localized;
  body?: Localized;
  bullets?: Localized[];
  metrics?: { value: string; label: Localized }[];
  cards?: ProjectCard[];
  media?: IntroMediaItem[];
  timeline?: TimelineStop[];
  chips?: ChipItem[];
  /** Pull-quote (why slide) */
  quote?: Localized;
  quoteAttribution?: Localized;
  chipsLabel?: Localized;
  heroChips?: Localized[];
  ctaPrimary?: { label: Localized; href: string };
  ctaSecondary?: { label: Localized; href: string; external?: boolean };
};

export const INTRO_SLIDES: IntroSlideDef[] = [
  {
    id: 'cover',
    layout: 'hero',
    label: { en: 'Cover', de: 'Einstieg' },
    kicker: { en: 'Introduction', de: 'Einführung' },
    title: {
      en: 'I enable teams to do great work',
      de: 'Ich bringe Teams in die Lage, großartig zu liefern',
    },
    body: {
      en: 'Structures and craft fluency in the same fields the team ships in — so specialists can do their best work.',
      de: 'Strukturen und Praxis in genau den Gewerken, in denen das Team liefert — damit Spezialisten ihr Bestes machen können.',
    },
    heroChips: [
      { en: 'Berlin', de: 'Berlin' },
      { en: 'Production & Project Lead', de: 'Production & Project Lead' },
      { en: 'Available now', de: 'Sofort verfügbar' },
    ],
    bullets: [
      {
        en: 'Artjom Naninjan',
        de: 'Artjom Naninjan',
      },
      {
        en: 'Full-time · Berlin / Brandenburg / Remote (DE)',
        de: 'Vollzeit · Berlin / Brandenburg / Remote (DE)',
      },
    ],
    media: [
      {
        src: '/about/artjom-portrait.jpg',
        alt: {
          en: 'Artjom Naninjan — studio portrait',
          de: 'Artjom Naninjan — Studio-Portrait',
        },
        focus: '50% 30%',
      },
    ],
  },
  {
    id: 'path',
    layout: 'timeline',
    label: { en: 'Path', de: 'Weg' },
    kicker: { en: 'Who I am', de: 'Wer ich bin' },
    title: {
      en: 'Architecture into production leadership',
      de: 'Von Architektur zur Produktionsleitung',
    },
    body: {
      en: 'Four promotions in 4.5 years at DADB — then a creative collective I co-founded, not a job substitute.',
      de: 'Vier Aufstiege in 4,5 Jahren bei der DADB — danach ein Kreativkollektiv, das ich mitgegründet habe, kein Job-Ersatz.',
    },
    timeline: [
      {
        period: { en: '2016–2020', de: '2016–2020' },
        title: { en: 'B.Sc. Architecture', de: 'B.Sc. Architektur' },
        blurb: {
          en: 'Berliner Hochschule für Technik · student council lead',
          de: 'Berliner Hochschule für Technik · Fachschaftsleiter',
        },
      },
      {
        period: { en: '2021–2025', de: '2021–2025' },
        title: { en: 'DADB · four roles', de: 'DADB · vier Rollen' },
        blurb: {
          en: '3D Artist → Mixed Reality Lead → Head of 3D → Head of Production',
          de: '3D Artist → Mixed Reality Lead → Head of 3D → Head of Production',
        },
      },
      {
        period: { en: '2026', de: '2026' },
        title: { en: 'Multikunst', de: 'Multikunst' },
        blurb: {
          en: 'Collective co-founded 2023 · creative lead since January',
          de: 'Kollektiv gegründet 2023 · kreative Leitung seit Januar',
        },
        href: 'https://multikunst.vercel.app',
      },
    ],
    media: [
      {
        src: '/about/E-Learning_Africa_2024.jpg',
        alt: {
          en: 'E-Learning Africa booth',
          de: 'E-Learning Africa Messestand',
        },
      },
      {
        src: '/about/ProductRoadshow_India_2024.jpg',
        alt: {
          en: 'Product roadshow India 2024',
          de: 'Product Roadshow Indien 2024',
        },
      },
    ],
  },
  {
    id: 'scale',
    layout: 'facts',
    label: { en: 'Scale', de: 'Maßstab' },
    kicker: { en: 'The scale', de: 'Der Maßstab' },
    title: {
      en: 'The numbers that matter',
      de: 'Die Zahlen, die zählen',
    },
    body: {
      en: 'As Head of Production I led digital course production across three continents — confirmed in writing by the CTO.',
      de: 'Als Head of Production habe ich die digitale Kursproduktion über drei Kontinente geführt — schriftlich vom CTO bestätigt.',
    },
    metrics: [
      { value: '35', label: { en: 'people led', de: 'Mitarbeitende' } },
      {
        value: '6',
        label: { en: 'parallel productions', de: 'parallele Produktionen' },
      },
      {
        value: '7',
        label: { en: 'departments', de: 'Departments' },
      },
      { value: '4', label: { en: 'sites', de: 'Standorte' } },
      { value: '3', label: { en: 'continents', de: 'Kontinente' } },
    ],
    media: [
      {
        src: '/about/ProductRoadshow1_India_2024.jpg',
        alt: {
          en: 'International production roadshow',
          de: 'Internationale Produktions-Roadshow',
        },
      },
    ],
  },
  {
    id: 'production',
    layout: 'split',
    label: { en: 'Production', de: 'Produktion' },
    kicker: { en: 'How I ran it', de: 'Wie ich gesteuert habe' },
    title: {
      en: 'Structures you can run a company on',
      de: 'Strukturen, mit denen man liefern kann',
    },
    body: {
      en: 'I built the project-management function, weekly KPI reporting, and a live dashboard — because six productions across Berlin, India and Dakar do not run on status meetings alone.',
      de: 'Ich habe die PM-Struktur, wöchentliches KPI-Reporting und ein Live-Dashboard aufgebaut — weil sich sechs Produktionen in Berlin, Indien und Dakar nicht über Status-Meetings steuern lassen.',
    },
    cards: [
      {
        title: {
          en: 'Course Overview Tool',
          de: 'Course Overview Tool',
        },
        blurb: {
          en: 'Next.js live dashboard — one shared view for teams, PMs, stakeholders and leadership',
          de: 'Live-Dashboard in Next.js — eine gemeinsame Sicht für Teams, PMs, Stakeholder und Leadership',
        },
        href: '/project/course-overview',
        thumb: '/tools/dadb-course-overview/course-1.jpg',
        meta: { en: 'Case study', de: 'Case Study' },
      },
    ],
    media: [
      {
        src: '/tools/dadb-course-overview/course-1.jpg',
        alt: {
          en: 'Course Overview Tool dashboard',
          de: 'Course Overview Tool Dashboard',
        },
        href: '/project/course-overview',
      },
      {
        src: '/tools/dadb-course-overview/course-2.jpg',
        alt: {
          en: 'Course Overview Tool modules',
          de: 'Course Overview Tool Module',
        },
        href: '/project/course-overview',
      },
    ],
  },
  {
    id: 'built',
    layout: 'gallery',
    label: { en: 'Bring', de: 'Mitbringen' },
    kicker: { en: 'What I bring', de: 'Was ich mitbringe' },
    title: {
      en: 'Structures, distributed delivery, hands-on craft',
      de: 'Strukturen, verteilte Lieferung, Hands-on',
    },
    body: {
      en: 'Production lead who still builds the pipeline — learning kits, VR/AR stands, and Blender-driven 3D.',
      de: 'Produktionsleiter, der die Pipeline selbst baut — Lernkoffer, VR/AR-Stände und Blender-3D.',
    },
    bullets: [
      {
        en: 'Ownership culture, dedicated PMs, binding processes — not ad-hoc firefighting',
        de: 'Ownership-Kultur, dedizierte PMs, verbindliche Prozesse — kein Ad-hoc-Feuerlöschen',
      },
      {
        en: 'Distributed teams across time zones without meeting overload',
        de: 'Verteilte Teams über Zeitzonen — ohne Meeting-Overload',
      },
      {
        en: 'Hands-on in Blender, Unreal (C++ / Blueprints), Unity, Three.js / React / Next.js',
        de: 'Hands-on in Blender, Unreal (C++ / Blueprints), Unity, Three.js / React / Next.js',
      },
      {
        en: 'IHK-certified project lead (Nov 2024)',
        de: 'IHK-zertifizierter Projektleiter (Nov 2024)',
      },
      {
        en: 'AI-enabled production — embedded in the workflow, not a side hobby',
        de: 'KI-gestützte Produktion — im Alltag verankert, kein Nebenhobby',
      },
    ],
    chipsLabel: { en: 'Toolkit', de: 'Werkzeugkasten' },
    chips: INTRO_TOOLKIT_CHIPS,
    cards: [
      {
        id: 'lexsolar',
        title: {
          en: 'leXsolar Digital Learning Kit',
          de: 'leXsolar Digital Learning Kit',
        },
        blurb: {
          en: 'Physical kits rebuilt in Blender · learning game in Unity · finished and playable',
          de: 'Physische Lernkoffer in Blender · Lernspiel in Unity · fertig und spielbar',
        },
        href: '/project/lexsolar-digital-learning-kit',
        thumb: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
        meta: { en: 'Unity · Blender', de: 'Unity · Blender' },
        featured: true,
      },
      {
        id: 'multiply',
        title: { en: 'Multiply', de: 'Multiply' },
        blurb: {
          en: 'Multikunst — Blender lookdev, lighting and motion for a branded 3D piece',
          de: 'Multikunst — Lookdev, Licht und Motion in Blender für ein Brand-3D-Stück',
        },
        href: '/project/multiply',
        thumb: '/projects/multiply/Thumbnail.png',
        meta: { en: 'Blender', de: 'Blender' },
      },
      {
        id: 'the-house',
        title: { en: 'The House', de: 'The House' },
        blurb: {
          en: 'Archicad → Unreal realtime walkthrough — architecture you can move through',
          de: 'Archicad → Unreal Realtime-Walkthrough — Architektur, die man begeht',
        },
        href: '/project/the-house',
        thumb: '/projects/the-house/architecture-enhanced-01.webp',
        meta: { en: 'Archicad · Unreal', de: 'Archicad · Unreal' },
      },
      {
        id: 'dakar',
        title: {
          en: 'E-Learning Africa · Dakar',
          de: 'E-Learning Africa · Dakar',
        },
        blurb: {
          en: 'VR in the German Pavilion · Unreal C++ / Blueprints · on-site tech ops',
          de: 'VR im German Pavilion · Unreal C++ / Blueprints · Technik vor Ort',
        },
        href: '/project/elearning-africa-dakar-senegal-2023',
        thumb:
          '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07.webp',
        meta: { en: 'Unreal · XR', de: 'Unreal · XR' },
      },
      {
        id: 'course-overview',
        title: { en: 'Course Overview Tool', de: 'Course Overview Tool' },
        blurb: {
          en: 'Production dashboard for parallel courses — status, modules, delivery',
          de: 'Produktions-Dashboard für parallele Kurse — Status, Module, Lieferung',
        },
        href: '/project/course-overview',
        thumb: '/tools/dadb-course-overview/course-1.jpg',
        meta: { en: 'Figma · Ops', de: 'Figma · Ops' },
      },
      {
        id: 'skyhaven',
        title: { en: 'Skyhaven v0.2.0', de: 'Skyhaven v0.2.0' },
        blurb: {
          en: 'Desktop widget game — Tauri, React, TypeScript — published on GitHub Releases',
          de: 'Desktop-Widget-Spiel — Tauri, React, TypeScript — auf GitHub Releases',
        },
        href: '/project/skyhaven',
        thumb: '/projects/skyhaven/posters/fullfarming.webp',
        meta: { en: 'Tauri · React', de: 'Tauri · React' },
      },
      {
        id: 'occupied',
        title: { en: 'Occupied VFX', de: 'Occupied VFX' },
        blurb: {
          en: 'Browser realtime VFX engine — GLSL / Three.js, GPU effect graph',
          de: 'Browser-Realtime-VFX — GLSL / Three.js, GPU-Effektgraph',
        },
        href: '/project/occupied',
        thumb: '/tools/occupied/thumbnail.webp',
        meta: { en: 'Three.js', de: 'Three.js' },
      },
    ],
  },
  {
    id: 'shipped',
    layout: 'feature',
    label: { en: 'Shipped', de: 'Veröffentlicht' },
    kicker: { en: 'After DADB', de: 'Nach der DADB' },
    title: {
      en: 'I kept shipping after DADB',
      de: 'Nach der DADB weiter gebaut',
    },
    body: {
      en: 'I kept building: published products, Multikunst creative lead, continuous craft.',
      de: 'Weiter gebaut: eigene Produkte, kreative Leitung Multikunst, weiter am Handwerk.',
    },
    cards: [
      {
        title: { en: 'Skyhaven v0.2.0', de: 'Skyhaven v0.2.0' },
        blurb: {
          en: 'Desktop widget game — Tauri, React, Three.js — published on GitHub Releases',
          de: 'Desktop-Widget-Spiel — Tauri, React, Three.js — auf GitHub Releases',
        },
        href: '/project/skyhaven',
        thumb: '/projects/skyhaven/posters/fullfarming.webp',
        meta: { en: 'Game', de: 'Spiel' },
        featured: true,
      },
      {
        title: { en: 'Occupied VFX', de: 'Occupied VFX' },
        blurb: {
          en: 'Browser realtime VFX engine — GLSL / Three.js, GPU effect graph',
          de: 'Browser-Realtime-VFX — GLSL / Three.js, GPU-Effektgraph',
        },
        href: '/project/occupied',
        thumb: '/tools/occupied/thumbnail.webp',
        meta: { en: 'Live tool', de: 'Live-Tool' },
        featured: true,
      },
      {
        title: { en: 'MultiView', de: 'MultiView' },
        blurb: {
          en: 'Browser 3D editor — modeling, materials, rendering, web export',
          de: 'Browser-3D-Editor — Modellierung, Material, Rendering, Web-Export',
        },
        href: `${INTRO_WORK_HREF}#tools-games`,
        meta: { en: 'Tool', de: 'Tool' },
      },
    ],
  },
  {
    id: 'differentiators',
    layout: 'triptych',
    label: { en: 'Edge', de: 'Profil' },
    kicker: { en: 'Three edges', de: 'Drei Kanten' },
    title: {
      en: 'Three things that travel with me',
      de: 'Drei Dinge, die mitkommen',
    },
    cards: [
      {
        title: {
          en: 'Architect who can do realtime',
          de: 'Architekt, der Realtime kann',
        },
        blurb: {
          en: 'B.Sc. Architecture + Archicad + Unreal + Blender — I understand construction and the engine.',
          de: 'B.Sc. Architektur + Archicad + Unreal + Blender — ich verstehe Konstruktion und Engine.',
        },
        thumb: '/projects/the-house/architecture-enhanced-01.webp',
        href: '/project/the-house',
      },
      {
        title: {
          en: 'Production lead who still produces',
          de: 'Produktionsleiter, der selbst produziert',
        },
        blurb: {
          en: '~35 people, seven departments, three continents — while working in Blender, Unreal, Unity and code.',
          de: 'Rund 35 Personen, sieben Departments, drei Kontinente — und Arbeit in Blender, Unreal, Unity und Code.',
        },
        thumb: '/about/E-Learning_Africa_2024.jpg',
      },
      {
        title: {
          en: 'Builds the tools that are missing',
          de: 'Baut die Tools, die fehlen',
        },
        blurb: {
          en: 'Course Overview Tool, Occupied VFX, MultiView, Skyhaven — and an internal AI department at DADB.',
          de: 'Course Overview Tool, Occupied VFX, MultiView, Skyhaven — und internes KI-Department bei der DADB.',
        },
        thumb: '/tools/dadb-course-overview/course-1.jpg',
        href: '/project/course-overview',
      },
    ],
  },
  {
    id: 'why',
    layout: 'split',
    label: { en: 'Why now', de: 'Warum jetzt' },
    kicker: { en: 'Next chapter', de: 'Nächstes Kapitel' },
    title: {
      en: 'Full-time. Lead delivery.',
      de: 'Festanstellung. Lieferung führen.',
    },
    body: {
      en: 'I am looking for a permanent role in Berlin, Brandenburg or remote in Germany — not freelance. I want to enable teams to do great work.',
      de: 'Ich suche eine Festanstellung in Berlin, Brandenburg oder remote in Deutschland — kein Freelance. Ich will Teams in die Lage versetzen, großartige Arbeit zu liefern.',
    },
    bullets: [
      {
        en: 'Available immediately',
        de: 'Sofort verfügbar',
      },
      {
        en: 'Lead production and stay close to the craft',
        de: 'Produktion führen, nah an den Gewerken bleiben',
      },
      {
        en: 'Since then: shipped products, Multikunst creative lead',
        de: 'Seitdem: eigene Produkte, kreative Leitung Multikunst',
      },
    ],
    quote: {
      en: 'Ownership instead of ad-hoc firefighting.',
      de: 'Ownership statt Ad-hoc-Feuerlöschen.',
    },
    quoteAttribution: {
      en: 'CTO, DADB',
      de: 'CTO, DADB',
    },
    media: [
      {
        src: '/about/artjom-portrait.jpg',
        alt: {
          en: 'Artjom Naninjan',
          de: 'Artjom Naninjan',
        },
        focus: '50% 18%',
      },
    ],
  },
  {
    id: 'partners',
    layout: 'partners',
    label: { en: 'Partners', de: 'Partner' },
    kicker: {
      en: 'Delivered with / at DADB',
      de: 'Geliefert mit / bei der DADB',
    },
    title: {
      en: 'Universities and industry partners',
      de: 'Hochschulen und Industriepartner',
    },
    body: {
      en: 'Production for higher-education and industry partners of the German Academy of Digital Education — not a freelance client roster.',
      de: 'Produktion für Hochschul- und Industriepartner der German Academy of Digital Education — keine Freelance-Kundenliste.',
    },
  },
  {
    id: 'close',
    layout: 'mosaic',
    label: { en: 'Next', de: 'Weiter' },
    kicker: { en: 'Next step', de: 'Nächster Schritt' },
    title: {
      en: 'The work is on the main page',
      de: 'Die Arbeit liegt auf der Hauptseite',
    },
    body: {
      en: 'This intro is the map. Case studies, tools and games live on the portfolio — start there when you want proof.',
      de: 'Dieses Intro ist die Landkarte. Case Studies, Tools und Games liegen auf dem Portfolio — dort beginnt der Beleg.',
    },
    media: [
      {
        src: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
        alt: { en: 'leXsolar', de: 'leXsolar' },
        href: '/project/lexsolar-digital-learning-kit',
      },
      {
        src: '/projects/multiply/Thumbnail.png',
        alt: { en: 'Multiply', de: 'Multiply' },
        href: '/project/multiply',
      },
      {
        src: '/projects/the-house/architecture-enhanced-01.webp',
        alt: { en: 'The House', de: 'The House' },
        href: '/project/the-house',
      },
      {
        src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07.webp',
        alt: { en: 'E-Learning Africa Dakar', de: 'E-Learning Africa Dakar' },
        href: '/project/elearning-africa-dakar-senegal-2023',
      },
      {
        src: '/tools/dadb-course-overview/course-1.jpg',
        alt: { en: 'Course Overview Tool', de: 'Course Overview Tool' },
        href: '/project/course-overview',
      },
      {
        src: '/projects/skyhaven/posters/fullfarming.webp',
        alt: { en: 'Skyhaven', de: 'Skyhaven' },
        href: '/project/skyhaven',
      },
    ],
    ctaPrimary: {
      label: { en: 'Open the portfolio', de: 'Zum Portfolio' },
      href: INTRO_WORK_HREF,
    },
    ctaSecondary: {
      label: { en: 'LinkedIn', de: 'LinkedIn' },
      href: INTRO_LINKEDIN,
      external: true,
    },
  },
];

/** LinkedIn document carousel (1080×1350) — shorter set, same copy source. */
export const INTRO_CAROUSEL_SLIDE_IDS = [
  'cover',
  'path',
  'scale',
  'built',
  'why',
  'partners',
  'close',
] as const satisfies readonly IntroSlideId[];

export const INTRO_CAROUSEL_SLIDES: IntroSlideDef[] =
  INTRO_CAROUSEL_SLIDE_IDS.map((id) => {
    const slide = INTRO_SLIDES.find((s) => s.id === id);
    if (!slide) throw new Error(`Missing intro slide for carousel: ${id}`);
    return slide;
  });

export const INTRO_META = {
  title: {
    en: 'Intro · Artjom Naninjan',
    de: 'Intro · Artjom Naninjan',
  } satisfies Localized,
  description: {
    en: 'Two-minute introduction: who I am, what I built, why I am looking, and what I bring — then the full portfolio.',
    de: 'Zwei Minuten Einführung: wer ich bin, was ich gebaut habe, warum ich suche und was ich mitbringe — danach das volle Portfolio.',
  } satisfies Localized,
};
