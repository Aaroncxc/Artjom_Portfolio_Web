import { buildHireMailto } from '@/lib/contact';

/** Public base URL for role landing pages (used in docs + Bewerbungs-App deep links). */
export const ROLE_LANDING_BASE_URL = 'https://artjomnaninjan.vercel.app/p';

export interface RoleLandingCase {
  title: string;
  summary: string;
  /** Internal `/project/...` path or external URL. */
  href: string;
  image?: string;
  tag?: string;
}

export interface RoleLandingCTA {
  label: string;
  href: string;
}

/**
 * Stellen-spezifischer Portfolio-Slice für `/p/[slug]`.
 * One record = one deploy-free URL on the main Vercel site.
 */
export interface RoleLanding {
  slug: string;
  roleTitle: string;
  company: string;
  /** Hero headline — role + company fit in one line. */
  headline: string;
  /** 3–5 fit bullets (skills, scope, outcomes). */
  bullets: string[];
  /** Exactly three curated cases for the template layout. */
  cases: [RoleLandingCase, RoleLandingCase, RoleLandingCase];
  /** Optional skill chips under the hero. */
  skills?: string[];
  cta: RoleLandingCTA;
  /** Used for Open Graph + Bewerbungs-App mailto subject fallback. */
  mailtoSubject?: string;
}

export const ROLE_LANDINGS: RoleLanding[] = [
  {
    slug: 'stackfuel-ai-portfolio-lead',
    roleTitle: 'AI Portfolio Lead',
    company: 'StackFuel',
    headline:
      'Production leadership for AI-native learning portfolios — from course roadmap to live dashboards.',
    bullets: [
      'End-to-end course production across Editorial, 2D, 3D, and Unreal with weekly CEO KPI reporting.',
      'Built and shipped the Course Overview Tool — Excel sync, pipeline visibility, AI-assisted content ops.',
      'Scaled ~35 people across four sites and six parallel productions on three continents.',
    ],
    skills: [
      'AI content pipelines',
      'Portfolio roadmap',
      'Team leadership',
      'Platform launch',
      'KPI reporting',
    ],
    cases: [
      {
        title: 'Course Overview Tool',
        summary:
          'Live dashboard for chapters, modules, minutes, and blockers — synced from production Excel twice daily.',
        href: '/project/course-overview',
        image: '/tools/dadb-course-overview/thumbnail.jpg',
        tag: 'Live tool',
      },
      {
        title: 'Lexsolar Digital Learning Kit',
        summary:
          'Digital twin of physical solar learning cases — Blender assets and Unity prototype for stakeholder alignment.',
        href: '/project/lexsolar-digital-learning-kit',
        image: '/projects/lexsolar-digital-learning-kit/ingame-05.webp',
        tag: 'XR · Education',
      },
      {
        title: 'DADB Solar Technician Digital Campus',
        summary:
          'Head of Production: multi-module campus launch — staffing, milestones, and cross-department delivery.',
        href: '/project/dadb-solar-technician-digital-campus',
        image: '/projects/dadb-solar-technician-digital-campus/thumbnail.webp',
        tag: 'Ops · Leadership',
      },
    ],
    mailtoSubject: 'StackFuel — AI Portfolio Lead — Artjom Naninjan',
    cta: {
      label: 'Discuss this role',
      href: buildHireMailto('StackFuel — AI Portfolio Lead — Artjom Naninjan'),
    },
  },
  {
    slug: 'intermate-creative-lead',
    roleTitle: 'Creative Lead',
    company: 'Intermate',
    headline:
      'Creative production across realtime, VFX, and editorial — ops, capacity, and shipped demos.',
    bullets: [
      'Led interdisciplinary teams through concept, production, post, and launch for brand and product work.',
      'Shipped browser-ready VFX and realtime demos — Occupied tool suite and Skyhaven VFX Studio.',
      'Stakeholder reporting, capacity planning, and KPI visibility for creative departments.',
    ],
    skills: [
      'Creative ops',
      'Realtime 3D',
      'VFX pipeline',
      'Editorial delivery',
      'Team coordination',
    ],
    cases: [
      {
        title: 'Occupied VFX Tool Suite',
        summary:
          'In-browser VFX workspace — compositing, review, and delivery tooling built for production teams.',
        href: '/project/occupied',
        image: '/tools/occupied/thumbnail.webp',
        tag: 'Try in browser',
      },
      {
        title: 'Skyhaven VFX Studio',
        summary:
          'Realtime VFX pipeline and studio showcase — Unreal workflows, releases, and live product site.',
        href: '/project/skyhaven-vfx',
        image: '/projects/skyhaven-vfx/start-screen.webp',
        tag: 'Realtime · VFX',
      },
      {
        title: 'Agata Journal',
        summary:
          'Product site and editorial experience — creative direction from concept through shipped web product.',
        href: 'https://www.agatajournal.com/',
        image: '/tools/agata/product-poster.webp',
        tag: 'Product site',
      },
    ],
    mailtoSubject: 'Intermate — Creative Lead — Artjom Naninjan',
    cta: {
      label: 'Discuss this role',
      href: buildHireMailto('Intermate — Creative Lead — Artjom Naninjan'),
    },
  },
];

export function getAllRoleLandingSlugs(): string[] {
  return ROLE_LANDINGS.map((entry) => entry.slug);
}

export function getRoleLandingBySlug(slug: string): RoleLanding | undefined {
  return ROLE_LANDINGS.find((entry) => entry.slug === slug);
}

export function roleLandingUrl(slug: string): string {
  return `${ROLE_LANDING_BASE_URL}/${slug}`;
}
