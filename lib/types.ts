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
  // Additional media gallery for projects with multiple assets
  gallery?: ProjectMedia[];
}

export interface PostsData {
  posts: Project[];
  lastUpdated: string;
}
