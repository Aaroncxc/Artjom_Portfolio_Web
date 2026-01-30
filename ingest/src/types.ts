// Post metadata from post.json in Drive folder
export interface DrivePostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  type: 'html' | 'video' | 'audio' | 'image';
  author?: string;
  featured?: boolean;
}

// Internal representation of a project during processing
export interface ProcessedProject {
  slug: string;
  meta: DrivePostMeta;
  assets: {
    cover?: string;
    video?: string;
    audio?: string;
    images?: string[];
    htmlZip?: string;
  };
  localPaths: {
    cover?: string;
    video?: string;
    audio?: string;
    images?: string[];
    htmlDir?: string;
  };
  publicUrls: {
    thumbnail?: string;
    videoUrl?: string;
    audioUrl?: string;
    images?: string[];
    htmlPath?: string;
  };
}

// Final output format for posts.json
export interface OutputPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  type: 'html' | 'video' | 'audio' | 'image';
  thumbnail?: string;
  videoUrl?: string;
  audioUrl?: string;
  images?: string[];
  htmlPath?: string;
  author?: string;
  featured?: boolean;
}

export interface OutputPostsData {
  posts: OutputPost[];
  lastUpdated: string;
}

// Storage provider interface
export interface StorageProvider {
  upload(localPath: string, remotePath: string): Promise<string>;
  getPublicUrl(remotePath: string): string;
}

// Configuration
export interface IngestConfig {
  driveFolderId: string;
  storageProvider: 'local' | 's3' | 'r2' | 'gcs';
  outputPostsJson: string;
  outputProjectsDir: string;
  outputAssetsDir: string;
  assetsCdnUrl: string;
}
