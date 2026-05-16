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
  // Long-form description shown in the "Explanation" tab of the project modal.
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
