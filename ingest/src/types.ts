// Post metadata from post.json in Drive folder
export interface DrivePostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  type: 'html' | 'video' | 'audio' | 'image';
  author?: string;
  featured?: boolean;
  // Long-form copy for the project modal "Explanation" tab.
  explanation?: string;
  // Bullet list for the "Private" tab info column.
  highlights?: string[];
  // Optional override for the project's "Hire Me" CTA target.
  ctaHref?: string;
  // When false → video/thumbnail hover only on grid; omit or true → 3D on hover if model3dPath exists.
  showTile3dHover?: boolean;
  /** When false → modal carousel omits FBX / model3d slides; tile can still use model3dPath. */
  showModel3dInModal?: boolean;
  /** Optional public URL/path to FBX loaded by the modal 3D preview (typically `/projects/<slug>/model.fbx`). */
  model3dPath?: string;
  model3dRotationX?: number;
  model3dMaterialColor?: string;
  model3dOffsetY?: number;
  /** Libraries / apps (optional `icon` is a public URL path). */
  tools?: { name: string; icon?: string }[];
  /** Interactive Unreal blueprint embed URLs (passed through to posts.json). */
  unrealBlueprints?: { url: string; title?: string; caption?: string; previewImage?: string }[];
  /** Captions keyed by media src (video, image paths, etc.). */
  mediaCaptions?: Record<string, string>;
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
  explanation?: string;
  highlights?: string[];
  ctaHref?: string;
  tools?: { name: string; icon?: string }[];
  showTile3dHover?: boolean;
  showModel3dInModal?: boolean;
  model3dPath?: string;
  model3dRotationX?: number;
  model3dMaterialColor?: string;
  model3dOffsetY?: number;
  unrealBlueprints?: { url: string; title?: string; caption?: string; previewImage?: string }[];
  mediaCaptions?: Record<string, string>;
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
