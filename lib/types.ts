export type ProjectType = 'html' | 'video' | 'audio' | 'image';

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
}

export interface PostsData {
  posts: Project[];
  lastUpdated: string;
}
