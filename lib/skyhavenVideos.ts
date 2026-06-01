/** Skyhaven gameplay clips served from `public/projects/skyhaven/` (see `npm run compress:skyhaven`). */

export const SKYHAVEN_TILE_VIDEO = '/projects/skyhaven/tile-preview.mp4';

export const SKYHAVEN_TILE_POSTER = '/projects/skyhaven/posters/fullfarming.webp';

export interface SkyhavenVideoClip {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
}

export const SKYHAVEN_VIDEO_CLIPS: SkyhavenVideoClip[] = [
  {
    id: 'fullfarming',
    title: 'Full farming showcase',
    description:
      'Complete farming loop on the agriculture island — till, plant, grow, harvest, and island ambience in one take.',
    src: '/projects/skyhaven/videos/fullfarming.mp4',
    poster: SKYHAVEN_TILE_POSTER,
  },
  {
    id: 'fighting',
    title: 'Combat slice',
    description:
      'Mining island combat loop — enemy robots, telegraphs, block/dodge feedback, and hit reactions.',
    src: '/projects/skyhaven/videos/fighting.mp4',
    poster: '/projects/skyhaven/posters/fighting.webp',
  },
  {
    id: 'farming',
    title: 'Farming loop',
    description: 'Till, plant, grow, and harvest on the farming POI — crops, tools, and island switching.',
    src: '/projects/skyhaven/videos/farming.mp4',
    poster: '/projects/skyhaven/posters/farming.webp',
  },
  {
    id: 'widget-highlight',
    title: 'Widget overview',
    description:
      'Earlier widget highlight capture — HUD, sidebar, and floating-island presentation at the screen edge.',
    src: '/projects/skyhaven/videos/widget-highlight.mp4',
    poster: '/projects/skyhaven/posters/widget-highlight.webp',
  },
];
