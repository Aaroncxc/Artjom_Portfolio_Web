import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { DriveClient } from './drive';
import { createStorageProvider } from './storage';
import {
  ProcessedProject,
  OutputPost,
  OutputPostsData,
  IngestConfig,
  StorageProvider,
} from './types';

// Load environment variables
dotenv.config();

// Configuration from environment
const config: IngestConfig = {
  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
  storageProvider: (process.env.STORAGE_PROVIDER as 'local' | 's3' | 'r2' | 'gcs') || 'local',
  outputPostsJson: process.env.OUTPUT_POSTS_JSON || '../public/posts.json',
  outputProjectsDir: process.env.OUTPUT_PROJECTS_DIR || '../public/projects',
  outputAssetsDir: process.env.OUTPUT_ASSETS_DIR || '../public/assets',
  assetsCdnUrl: process.env.ASSETS_CDN_URL || '',
};

// Temp directory for downloads
const TEMP_DIR = path.join(__dirname, '../.temp');

async function main() {
  console.log('=== multikunst Content Ingest ===\n');

  // Validate configuration
  if (!config.driveFolderId) {
    console.error('Error: GOOGLE_DRIVE_FOLDER_ID is required');
    process.exit(1);
  }

  // Initialize Drive client
  console.log('Initializing Google Drive client...');
  const drive = new DriveClient(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  );

  // Initialize storage provider
  console.log(`Initializing storage provider: ${config.storageProvider}`);
  const storage = createStorageProvider(config.storageProvider, {
    outputAssetsDir: path.resolve(__dirname, '..', config.outputAssetsDir),
    assetsCdnUrl: config.assetsCdnUrl,
    S3_BUCKET: process.env.S3_BUCKET || '',
    S3_REGION: process.env.S3_REGION || '',
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
    S3_ENDPOINT: process.env.S3_ENDPOINT || '',
    GCS_BUCKET: process.env.GCS_BUCKET || '',
    GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || '',
  });

  // Ensure temp directory exists
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  // List project folders
  console.log('\nFetching project folders from Drive...');
  const folders = await drive.listProjectFolders(config.driveFolderId);
  console.log(`Found ${folders.length} project folder(s)\n`);

  const processedProjects: ProcessedProject[] = [];

  // Process each folder
  for (const folder of folders) {
    if (!folder.id || !folder.name) continue;

    console.log(`\nProcessing: ${folder.name}`);
    const slug = folder.name;

    // Read post.json
    const meta = await drive.readPostJson(folder.id);
    if (!meta) {
      console.log(`  Skipping: No valid post.json found`);
      continue;
    }
    console.log(`  Title: ${meta.title}`);
    console.log(`  Type: ${meta.type}`);

    // Find assets
    const assets = await drive.findAssets(folder.id);
    const project: ProcessedProject = {
      slug,
      meta,
      assets: {},
      localPaths: {},
      publicUrls: {},
    };

    // Download and process assets
    const tempSlugDir = path.join(TEMP_DIR, slug);
    if (!fs.existsSync(tempSlugDir)) {
      fs.mkdirSync(tempSlugDir, { recursive: true });
    }

    // Cover image
    if (assets.cover?.id) {
      const ext = path.extname(assets.cover.name || '.png');
      const localPath = path.join(tempSlugDir, `cover${ext}`);
      console.log(`  Downloading cover image...`);
      await drive.downloadFile(assets.cover.id, localPath);
      project.localPaths.cover = localPath;
      project.publicUrls.thumbnail = await storage.upload(
        localPath,
        `assets/${slug}/cover${ext}`
      );
    }

    // Video
    if (meta.type === 'video' && assets.video?.id) {
      const ext = path.extname(assets.video.name || '.mp4');
      const localPath = path.join(tempSlugDir, `video${ext}`);
      console.log(`  Downloading video...`);
      await drive.downloadFile(assets.video.id, localPath);
      project.localPaths.video = localPath;
      project.publicUrls.videoUrl = await storage.upload(
        localPath,
        `assets/${slug}/video${ext}`
      );
    }

    // Audio
    if (meta.type === 'audio' && assets.audio?.id) {
      const ext = path.extname(assets.audio.name || '.mp3');
      const localPath = path.join(tempSlugDir, `audio${ext}`);
      console.log(`  Downloading audio...`);
      await drive.downloadFile(assets.audio.id, localPath);
      project.localPaths.audio = localPath;
      project.publicUrls.audioUrl = await storage.upload(
        localPath,
        `assets/${slug}/audio${ext}`
      );
    }

    // Images (for galleries)
    if (meta.type === 'image' && assets.images.length > 0) {
      project.publicUrls.images = [];
      project.localPaths.images = [];
      
      for (let i = 0; i < assets.images.length; i++) {
        const img = assets.images[i];
        if (!img.id) continue;
        
        const ext = path.extname(img.name || '.jpg');
        const localPath = path.join(tempSlugDir, `image-${i}${ext}`);
        console.log(`  Downloading image ${i + 1}/${assets.images.length}...`);
        await drive.downloadFile(img.id, localPath);
        project.localPaths.images.push(localPath);
        
        const url = await storage.upload(
          localPath,
          `assets/${slug}/image-${i}${ext}`
        );
        project.publicUrls.images.push(url);
      }
    }

    // HTML zip (interactive projects)
    if (meta.type === 'html' && assets.htmlZip?.id) {
      const localZipPath = path.join(tempSlugDir, 'app.zip');
      console.log(`  Downloading HTML archive...`);
      await drive.downloadFile(assets.htmlZip.id, localZipPath);

      // Extract to projects directory
      const projectDir = path.resolve(__dirname, '..', config.outputProjectsDir, slug);
      console.log(`  Extracting to ${projectDir}...`);
      
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }

      const zip = new AdmZip(localZipPath);
      zip.extractAllTo(projectDir, true);

      project.localPaths.htmlDir = projectDir;
      project.publicUrls.htmlPath = `/projects/${slug}/index.html`;
    }

    processedProjects.push(project);
    console.log(`  Done!`);
  }

  // Generate posts.json
  console.log('\n\nGenerating posts.json...');
  const posts: OutputPost[] = processedProjects.map((p, index) => ({
    id: String(index + 1),
    slug: p.slug,
    title: p.meta.title,
    description: p.meta.description,
    date: p.meta.date,
    tags: p.meta.tags,
    type: p.meta.type,
    thumbnail: p.publicUrls.thumbnail,
    videoUrl: p.publicUrls.videoUrl,
    audioUrl: p.publicUrls.audioUrl,
    images: p.publicUrls.images,
    htmlPath: p.publicUrls.htmlPath,
    author: p.meta.author,
    featured: p.meta.featured,
    explanation: p.meta.explanation,
    highlights: p.meta.highlights,
    ctaHref: p.meta.ctaHref,
    tools: p.meta.tools,
    showTile3dHover: p.meta.showTile3dHover,
    showModel3dInModal: p.meta.showModel3dInModal,
    model3dPath: p.meta.model3dPath,
    model3dRotationX: p.meta.model3dRotationX,
    model3dMaterialColor: p.meta.model3dMaterialColor,
    model3dOffsetY: p.meta.model3dOffsetY,
  }));

  const output: OutputPostsData = {
    posts,
    lastUpdated: new Date().toISOString(),
  };

  const postsJsonPath = path.resolve(__dirname, '..', config.outputPostsJson);
  const postsJsonDir = path.dirname(postsJsonPath);
  if (!fs.existsSync(postsJsonDir)) {
    fs.mkdirSync(postsJsonDir, { recursive: true });
  }
  fs.writeFileSync(postsJsonPath, JSON.stringify(output, null, 2));
  console.log(`Written to: ${postsJsonPath}`);

  // Cleanup temp directory
  console.log('\nCleaning up temporary files...');
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log('\n=== Ingest Complete ===');
  console.log(`Processed ${processedProjects.length} project(s)`);
}

// Run
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
