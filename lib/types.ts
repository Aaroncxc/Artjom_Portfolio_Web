export type ProjectType = 'html' | 'video' | 'audio' | 'image';

export interface ProjectMedia {
  type: 'video' | 'image';
  src: string;
  title?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
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
  // Additional media gallery for projects with multiple assets
  gallery?: ProjectMedia[];
}

export interface PostsData {
  posts: Project[];
  lastUpdated: string;
}
