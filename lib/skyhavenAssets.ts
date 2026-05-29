/** Categorized 3D asset stills for the Skyhaven highlight detail (webp under public/projects/skyhaven/models-3d). */

export type SkyhavenAssetCategoryId =
  | 'characters'
  | 'buildings'
  | 'nature'
  | 'paths'
  | 'props'
  | 'airships';

export interface SkyhavenAssetCategory {
  id: SkyhavenAssetCategoryId;
  label: string;
  /** Basename without extension — maps to `/projects/skyhaven/models-3d/{id}.webp` */
  assets: string[];
  /** Two portfolio previews per category (defaults to first two in `assets`). */
  previewAssets?: string[];
}

/** How many assets to show per category in the highlight codex. */
export const SKYHAVEN_CATEGORY_PREVIEW_COUNT = 2;

export const SKYHAVEN_ASSET_CATEGORIES: SkyhavenAssetCategory[] = [
  {
    id: 'characters',
    label: 'Characters',
    assets: [
      'main-char',
      'skully',
      'rovolto',
      'magic-man',
      'mining-man',
      'enemy-robot',
      'farmingChicken',
      'statueAaron',
    ],
    previewAssets: ['main-char', 'enemy-robot'],
  },
  {
    id: 'buildings',
    label: 'Buildings & POIs',
    assets: [
      'taverne',
      'magicTower',
      'mine',
      'cottaTile',
      'wellTile',
      'well2Tile',
      'kaserneTile',
      'ancientTempleTile',
      'floatingForge',
      'poisFarming',
      'hangerTower',
      'hangerDock',
      'hangerDock2',
      'hangerHanger',
    ],
    previewAssets: ['taverne', 'mine'],
  },
  {
    id: 'nature',
    label: 'Nature',
    assets: [
      'tree',
      'treeMiddle',
      'grass',
      'dirt',
      'bushTile',
      'clouds',
      'grasBlumen',
      'halfGrownCropTile',
    ],
    previewAssets: ['tree', 'halfGrownCropTile'],
  },
  {
    id: 'paths',
    label: 'Tiles & paths',
    assets: [
      'pathCross',
      'pathStraight',
      'farm2x2',
      'runeTile',
      'ancientStone',
      'ancientStoneWall',
      'ancientCornerWall',
    ],
    previewAssets: ['farm2x2', 'pathCross'],
  },
  {
    id: 'props',
    label: 'Props',
    assets: [
      'prop-torch',
      'prop-axe',
      'prop-shield',
      'prop-harke',
      'prop-setzling',
      'prop-giesskanne',
      'torchDecoration',
    ],
    previewAssets: ['prop-axe', 'prop-setzling'],
  },
  {
    id: 'airships',
    label: 'Airships',
    assets: ['airship-wing', 'airShipPort', 'airShipControl'],
    previewAssets: ['airship-wing', 'airShipPort'],
  },
];

export function skyhavenCategoryPreviewAssets(category: SkyhavenAssetCategory): string[] {
  const picked =
    category.previewAssets ??
    category.assets.slice(0, SKYHAVEN_CATEGORY_PREVIEW_COUNT);
  return picked.slice(0, SKYHAVEN_CATEGORY_PREVIEW_COUNT);
}

export const SKYHAVEN_CODEX_PREVIEW_COUNT =
  SKYHAVEN_ASSET_CATEGORIES.length * SKYHAVEN_CATEGORY_PREVIEW_COUNT;

export const SKYHAVEN_ASSET_BASE = '/projects/skyhaven/models-3d';

export function skyhavenAssetSrc(id: string): string {
  return `${SKYHAVEN_ASSET_BASE}/${id}.webp`;
}

export function skyhavenAssetLabel(id: string): string {
  return id
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export { skyhavenAssetBlurb } from '@/lib/skyhavenAssetMeta';

export const SKYHAVEN_ASSET_COUNT = SKYHAVEN_ASSET_CATEGORIES.reduce(
  (n, c) => n + c.assets.length,
  0,
);
