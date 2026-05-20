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
  | 'multikunst-occupied';

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
      ' of  —  assets,  hooks, and a  aligning stakeholders on how  could scale digitally.',
    role:
      ' from  through , , and  with  and .',
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
      ' translating  and  into spatial  — , , and  with the exhibiting team.',
    role:
      ' owning ,  with , and  across rehearsal to .',
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
      'A  for  — , , and  surfaced for management without chasing spreadsheets. Project managers logged status into ; the tool synced them every day at  and  so team, ,  and the  could watch the entire  live.',
    role:
      ',  with leadership, and  so teams could rely on  during delivery.',
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
      ' unpacking learning modules in an  — , , and .',
    role:
      ' across , , , and .',
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
      ' on  — translating  into paced  for learners and faculty review.',
    role:
      ' with ,  rhythms, reviews, and  for .',
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

export const ARCHITECTURE_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  {
    id: 'solar-tech-campus',
    title: 'DADB Solar Technician Digital Campus',
    year: '2026',
    category: 'Education · Digital campus',
    description:
      ' synced into  — , , and a  learners navigate as a  rather than a static course shell.',
    role:
      'Led  and co-designed the  — from  and  through , , and .',
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
      ' authored in , refined in  —  with a  so , , and  reads interactively.',
    role:
      ' through , , , and  — bridging  with an .',
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
      'Conceptual  —  meets , with  and  brought to life in .',
    role:
      'Co-created under the  — , , and  with the team.',
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
      ' exploring , , and  — a  in .',
    role:
      ' — , , and  for a short .',
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
      ' for  — , , and  routing , , , and  through modular  for  and .',
    role:
      'Built and shipped under  — , , and  for a  used by  and .',
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
    tileTags: ['Three.js', 'GLSL'],
    tileBadges: ['Tool', '3D'],
    span: 'normal',
  },
];

export const ALL_HIGHLIGHT_PROJECTS: HighlightProject[] = [
  ...HIGHLIGHT_PROJECTS,
  ...ARCHITECTURE_HIGHLIGHT_PROJECTS,
  ...MULTIKUNST_HIGHLIGHT_PROJECTS,
];

export function highlightById(id: HighlightProjectId | null): HighlightProject | undefined {
  if (!id) return undefined;
  return ALL_HIGHLIGHT_PROJECTS.find((p) => p.id === id);
}
