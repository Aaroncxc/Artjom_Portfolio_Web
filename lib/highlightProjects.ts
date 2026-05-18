import { DADB_COURSE_OVERVIEW_TOOL_ID, DADB_COURSE_OVERVIEW_TOOL_URL } from '@/lib/toolLinks';

/** Highlight IDs for the bento rail under About (not tied to posts.json schema). */
export type HighlightProjectId =
  | 'lexsolar'
  | 'kigali'
  | 'course-overview'
  | 'dakar'
  | 'emobility';

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
  gallery?: string[];
  projectSlug?: string;
  toolDeeplinkId?: string;
  /** External URL — when set the inline detail CTA opens it directly (target=_blank). */
  toolExternalUrl?: string;
  /** Top-left tile chips (immersion / category badges). Rendered with chip classes from `ProjectsGrid`. */
  tileBadges?: Array<'3D' | 'VR' | 'AR' | 'Learning Experience' | 'Tool' | 'Dashboard' | 'Internal'>;
  /** Top-left tile chips — neutral (tool names etc.). */
  tileTags?: string[];
  span: 'featured' | 'normal';
}

export const HIGHLIGHT_PROJECTS: HighlightProject[] = [
  {
    id: 'lexsolar',
    title: 'Lexsolar Digital Learning Kit',
    year: '2026',
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
      '/tools/dadb-course-overview/team-1.jpg',
      '/tools/dadb-course-overview/team-2.jpg',
    ],
    toolDeeplinkId: DADB_COURSE_OVERVIEW_TOOL_ID,
    toolExternalUrl: DADB_COURSE_OVERVIEW_TOOL_URL,
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

export function highlightById(id: HighlightProjectId | null): HighlightProject | undefined {
  if (!id) return undefined;
  return HIGHLIGHT_PROJECTS.find((p) => p.id === id);
}
