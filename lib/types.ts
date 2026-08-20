export type ProjectType = 'html' | 'video' | 'audio' | 'image';

/** Optional entry for the modal “Toolbox” strip (logo path is under /public). */
export interface ProjectTool {
  name: string;
  icon?: string;
}

export interface ProjectMedia {
  type: 'video' | 'image' | 'html' | 'model3d';
  src: string;
  title?: string;
  /** Short description shown under the active medium in the project modal (1–2 sentences). */
  caption?: string;
}

/** Interactive Unreal Engine blueprint embed (blueprintue.com render URL). */
export interface UnrealBlueprintMedia {
  url: string;
  title?: string;
  /** One-line purpose of this blueprint, shown under the viewer when active. */
  caption?: string;
  previewImage?: string;
}

/** Media item inside a case-study story section. */
export interface CaseSectionMedia {
  src: string;
  kind: 'image' | 'video' | 'html' | 'model3d';
  caption?: string;
  title?: string;
  /** Prefer contain + max-height for portrait / cutout media (no cover crop). */
  portrait?: boolean;
  /** Visual frame behind the asset — dark helps alpha cutouts. */
  frame?: 'dark' | 'paper';
  /** Image object-fit; default cover for stills, contain when portrait/fit set. */
  fit?: 'contain' | 'cover';
  /** Video: muted autoplay loop (UI loops / ambient product shots). */
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

/**
 * Editorial story block for the dedicated project case-study page.
 * Layouts control how text and media share the viewport.
 */
export type CaseSectionLayout =
  | 'text-left'
  | 'text-right'
  | 'full-media'
  | 'gallery'
  | 'live-embed'
  | 'portrait-split';

export interface CaseSection {
  heading?: string;
  body?: string;
  media?: CaseSectionMedia[];
  layout?: CaseSectionLayout;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** ISO date (yyyy-mm-dd) — shown as “Feb 2025” in the project modal when set. */
  date: string;
  /** Libraries / apps used — optional icons map to URLs like `/tool-icons/blender.png`. */
  tools?: ProjectTool[];
  tags: string[];
  type: ProjectType;
  thumbnail?: string;
  htmlPath?: string;
  videoUrl?: string;
  audioUrl?: string;
  images?: string[];
  author?: string;
  featured?: boolean;
  /**
   * Curated sort weight for the portfolio grid (lower = earlier).
   * When omitted, grid falls back to date descending.
   */
  order?: number;
  /** Role on the project — shown on case-study pages and grid tiles. */
  role?: string;
  /** Client / context (e.g. “DADB”, “Multikunst”). */
  client?: string;
  /** Human-readable timeframe (e.g. “Jan–May 2023”). */
  timeframe?: string;
  /** Team size / composition note. */
  team?: string;
  /** 2–4 outcome bullets for recruiters (belegbare Ergebnisse only). */
  outcomes?: string[];
  /**
   * Editorial story sections for `/project/[slug]`.
   * Must answer What / Why / How (see `.cursor/rules/case-study-narrative.mdc`).
   * Drive posts: prefer `lib/caseStudyNarratives.ts`. When omitted, fallback builds
   * What / Why / How from description + explanation + gallery.
   */
  caseSections?: CaseSection[];
  model3dPath?: string;
  model3dRotationX?: number; // Rotation in degrees on X axis (default: -90 for upright)
  model3dMaterialColor?: string; // Override color for plastic/transparent materials
  model3dOffsetY?: number; // Vertical offset for centering in preview tile (default: -0.3)
  /**
   * Animation progress in the FBX/GLB clip displayed in the preview, 0..1 (0 = start, 1 = end).
   * Useful when the bind pose is "open" and the closed state lives at the end of the animation.
   * Default 0 (= time 0 of the first animation).
   */
  model3dAnimationProgress?: number;
  /**
   * When false, the grid tile never mounts the 3D hover preview—even if model3dPath is set—
   * so hover can stay video thumbnail / HoverPlayVideo instead. Opening the modal can still include the 3D asset.
   * Default true (omit) for existing projects.
   */
  showTile3dHover?: boolean;
  /** Grid tile: show a neutral gray “3D” chip when there is no `model3dPath` (still / render-only 3D work). */
  tile3dBadge?: boolean;
  /** Big brand-tight “staircase” overlay on the grid tile only (first word, then indented rest). */
  tileOverlayTitle?: string;
  /**
   * When false, the project modal omits carousel slides for `model3dPath` / gallery model3d.
   * The grid tile still uses `model3dPath` for hover/badge when enabled. Default true (omit).
   */
  showModel3dInModal?: boolean;
  /**
   * Modal: first HTML / Live tile uses a small WebGL preview of `model3dPath` whenever it is set.
   * Set to `false` to keep the flat `thumbnail` image (lighter or if the mini preview is undesirable).
   */
  liveThumbUsesModelPreview?: boolean;
  videoPortrait?: boolean; // If true, video is displayed in portrait (9:16) layout
  // Additional media gallery for projects with multiple assets
  gallery?: ProjectMedia[];
  /**
   * Captions keyed by media `src` (video URL, image path, html path, model path, blueprint URL).
   * Used when a slide is not represented in `gallery` / `unrealBlueprints` with its own `caption`.
   */
  mediaCaptions?: Record<string, string>;
  /** Interactive Unreal Engine blueprint embeds (blueprintue.com render URLs). */
  unrealBlueprints?: UnrealBlueprintMedia[];
  // Long-form description shown in the "Description" tab of the project modal.
  // Falls back to `description` when omitted.
  explanation?: string;
  // Short bullet list shown in the "Private" tab info column.
  // Falls back to the first few `tags` when omitted.
  highlights?: string[];
  // Optional override for the "Hire Me" CTA target. Defaults to the global contact mailto.
  ctaHref?: string;
  // External reference links (e.g. official event page, article, partner site) shown as chips
  // in the project modal info column.
  references?: ProjectReference[];
}

export interface ProjectReference {
  url: string;
  label?: string;
}

export interface PostsData {
  posts: Project[];
  lastUpdated: string;
}
