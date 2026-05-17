/**
 * Per-project grouping for the modal media-thumbnail strip.
 *
 * When a project has a config registered here, `ProjectMediaThumbs` renders the
 * configured group tiles (collapsible) instead of the linear strip. Adding the
 * concept to a new project means dropping a new entry in `PROJECT_MEDIA_GROUPS`
 * — no UI changes required.
 */

export interface ProjectMediaGroupAsset {
  kind: 'image' | 'video' | 'html' | 'audio' | 'model3d';
  src: string;
}

export interface ProjectMediaGroup {
  /** Stable key persisted on each asset (`asset.groupKey`). */
  key: string;
  /** Tile label shown to the user. */
  label: string;
  /** Optional supporting text under the label (small caps). */
  caption?: string;
  /**
   * Predicate deciding whether an asset belongs to this group. Groups are
   * evaluated in the array order defined below; the first match wins.
   */
  match: (asset: ProjectMediaGroupAsset) => boolean;
}

export interface ProjectMediaGroupsConfig {
  /** Order = display order in the strip and match-priority order. */
  groups: ProjectMediaGroup[];
}

/** Returns the group key whose predicate first matches the asset, or undefined. */
export function assignGroupKey(
  asset: ProjectMediaGroupAsset,
  config: ProjectMediaGroupsConfig,
): string | undefined {
  for (const g of config.groups) {
    if (g.match(asset)) return g.key;
  }
  return undefined;
}

/** Treat any `.webm` / `.mp4` source or `kind === 'video'` as a video asset. */
const isVideoAsset = (a: ProjectMediaGroupAsset): boolean =>
  a.kind === 'video' || /\.(webm|mp4)$/i.test(a.src);

/** Live HTML viewer or static GLB/FBX 3D asset. */
const isInteractiveAsset = (a: ProjectMediaGroupAsset): boolean =>
  a.kind === 'html' || a.kind === 'model3d';

/** Helper: case-insensitive `regex` match against the filename. */
const filenameMatches = (a: ProjectMediaGroupAsset, regex: RegExp): boolean =>
  regex.test(a.src.toLowerCase());

/** blueprintue.com interactive embeds (modal `kind: 'html'` + render URL). */
export function isUnrealBlueprintAsset(a: ProjectMediaGroupAsset): boolean {
  return a.kind === 'html' && /blueprintue\.com\/render\//i.test(a.src);
}

/** Still screenshot paired with a blueprint embed (Dakar Companion BOT editor view). */
function isDakarBlueprintStillImage(a: ProjectMediaGroupAsset): boolean {
  return (
    a.kind === 'image' &&
    /elearning-africa-dakar-senegal-2023\/companion-bot-blueprint\.webp$/i.test(a.src)
  );
}

/**
 * Dakar 2023 — trade-fair impressions, gameplay footage, blueprint embeds, videos.
 * Blueprint embeds must be excluded from fair/ingame (URLs contain substring "blueprint").
 */
const dakarConfig: ProjectMediaGroupsConfig = {
  groups: [
    {
      key: 'fair',
      label: 'eLearning Fair',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        if (isUnrealBlueprintAsset(a)) return false;
        if (isDakarBlueprintStillImage(a)) return false;
        return !filenameMatches(
          a,
          /vr-scene|vr-character|dadbbot|visualisation|visualization/,
        );
      },
    },
    {
      key: 'ingame',
      label: 'Gameplay Footage',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        if (isUnrealBlueprintAsset(a)) return false;
        if (isDakarBlueprintStillImage(a)) return false;
        return filenameMatches(
          a,
          /vr-scene|vr-character|dadbbot|visualisation|visualization/,
        );
      },
    },
    {
      key: 'blueprints',
      label: 'Unreal Blueprints',
      match: (a) => isUnrealBlueprintAsset(a) || isDakarBlueprintStillImage(a),
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * Kigali 2024 — AR experience captures, fair / booth photos, videos.
 */
const kigaliConfig: ProjectMediaGroupsConfig = {
  groups: [
    {
      key: 'ar',
      label: 'AR Experience',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        return filenameMatches(a, /kigali_ar_|kigali_gameplay/);
      },
    },
    {
      key: 'fair',
      label: 'eLearning Fair',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        return filenameMatches(
          a,
          /kigali_messestand|kigali_proffesional|kigali_conventioncenter/,
        );
      },
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * Rekuperation Education — interview portraits, edu video stills, final video.
 */
const rekuperationEducationConfig: ProjectMediaGroupsConfig = {
  groups: [
    {
      key: 'edu',
      label: 'Edu Visuals',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        return filenameMatches(a, /rekuperation-edu-video/);
      },
    },
    {
      key: 'interview',
      label: 'Interview',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        return filenameMatches(a, /schlarp/);
      },
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * T-Shirt Jan — outdoor / nature shots, studio close-ups, lookbook video.
 */
const tshirtJanConfig: ProjectMediaGroupsConfig = {
  groups: [
    {
      key: 'outdoor',
      label: 'Outdoor & Nature',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        return filenameMatches(a, /outdoor|djungle|jungle/);
      },
    },
    {
      key: 'studio',
      label: 'Studio',
      match: (a) => {
        if (isVideoAsset(a)) return false;
        return filenameMatches(a, /shirt\d/);
      },
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * Pult Vacuum — live 3D viewer, product renders, motion clips.
 */
const pultVacuumConfig: ProjectMediaGroupsConfig = {
  groups: [
    { key: 'live', label: 'Live 3D', match: isInteractiveAsset },
    {
      key: 'renders',
      label: 'Product Renders',
      match: (a) => !isVideoAsset(a) && !isInteractiveAsset(a),
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * The House — live 3D viewer, architecture renders, walkthrough video.
 */
const theHouseConfig: ProjectMediaGroupsConfig = {
  groups: [
    { key: 'live', label: 'Live 3D', match: isInteractiveAsset },
    {
      key: 'renders',
      label: 'Architecture Renders',
      match: (a) => !isVideoAsset(a) && !isInteractiveAsset(a),
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * Lexsolar — in-game prototype screens + gameplay / case / UI videos.
 */
const lexsolarConfig: ProjectMediaGroupsConfig = {
  groups: [
    {
      key: 'ingame',
      label: 'In-Game Prototype',
      match: (a) => !isVideoAsset(a),
    },
    {
      key: 'gameplay',
      label: 'Gameplay',
      match: (a) => isVideoAsset(a) && filenameMatches(a, /whole-exercise|gameplay/),
    },
    {
      key: 'reference',
      label: 'Case & UI',
      match: (a) =>
        isVideoAsset(a) &&
        filenameMatches(a, /case-footage|ui-examples|expert-exercise/),
    },
  ],
};

/**
 * Pocket Multipass — product renders, motion / detail videos.
 */
const pocketMultipassConfig: ProjectMediaGroupsConfig = {
  groups: [
    {
      key: 'renders',
      label: 'Product Renders',
      match: (a) => !isVideoAsset(a) && !isInteractiveAsset(a),
    },
    { key: 'videos', label: 'Videos', match: isVideoAsset },
  ],
};

/**
 * Registry — slug -> grouping config.
 *
 * To enable grouped media tiles for another project:
 *   1. Define a `const myConfig: ProjectMediaGroupsConfig` with 2-N groups.
 *   2. Each group needs `{ key, label, match(asset) }` (caption optional).
 *   3. Add `[MY_SLUG]: myConfig` here.
 *
 * Projects without an entry keep the existing linear thumbnail strip.
 *
 * Tip: include a final group whose predicate always returns `true` (or
 * inverts the others) so unmatched assets still surface in the strip. Otherwise
 * any asset that doesn't match a predicate is silently hidden.
 */
const PROJECT_MEDIA_GROUPS: Record<string, ProjectMediaGroupsConfig> = {
  'elearning-africa-dakar-senegal-2023': dakarConfig,
  'elearning-africa-kigali-2024': kigaliConfig,
  'rekuperation-education': rekuperationEducationConfig,
  'tshirt-jan': tshirtJanConfig,
  'pult-vacuum': pultVacuumConfig,
  'the-house': theHouseConfig,
  'lexsolar-digital-learning-kit': lexsolarConfig,
  'pocket-multipass': pocketMultipassConfig,
};

export function getProjectMediaGroupsConfig(
  slug: string | undefined,
): ProjectMediaGroupsConfig | undefined {
  if (!slug) return undefined;
  return PROJECT_MEDIA_GROUPS[slug];
}
