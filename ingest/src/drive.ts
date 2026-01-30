import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { DrivePostMeta } from './types';

export class DriveClient {
  private drive: drive_v3.Drive;

  constructor(keyPath?: string, keyJson?: string) {
    let auth;

    if (keyJson) {
      const credentials = JSON.parse(keyJson);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
    } else if (keyPath && fs.existsSync(keyPath)) {
      auth = new google.auth.GoogleAuth({
        keyFile: keyPath,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
    } else {
      throw new Error('No valid Google credentials provided');
    }

    this.drive = google.drive({ version: 'v3', auth });
  }

  // List all project folders in the uploads folder
  async listProjectFolders(parentFolderId: string): Promise<drive_v3.Schema$File[]> {
    const response = await this.drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'modifiedTime desc',
    });

    return response.data.files || [];
  }

  // List files in a project folder
  async listFolderContents(folderId: string): Promise<drive_v3.Schema$File[]> {
    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, size)',
    });

    return response.data.files || [];
  }

  // Download a file
  async downloadFile(fileId: string, destPath: string): Promise<void> {
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const dest = fs.createWriteStream(destPath);
    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      (response.data as NodeJS.ReadableStream)
        .pipe(dest)
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });
  }

  // Read post.json from a folder
  async readPostJson(folderId: string): Promise<DrivePostMeta | null> {
    const files = await this.listFolderContents(folderId);
    const postJsonFile = files.find(
      (f) => f.name?.toLowerCase() === 'post.json'
    );

    if (!postJsonFile?.id) {
      return null;
    }

    const response = await this.drive.files.get(
      { fileId: postJsonFile.id, alt: 'media' },
      { responseType: 'text' }
    );

    try {
      return JSON.parse(response.data as string) as DrivePostMeta;
    } catch (e) {
      console.error(`Failed to parse post.json in folder ${folderId}:`, e);
      return null;
    }
  }

  // Find specific asset files in a folder
  async findAssets(folderId: string): Promise<{
    cover?: drive_v3.Schema$File;
    video?: drive_v3.Schema$File;
    audio?: drive_v3.Schema$File;
    images: drive_v3.Schema$File[];
    htmlZip?: drive_v3.Schema$File;
  }> {
    const files = await this.listFolderContents(folderId);
    
    const result: {
      cover?: drive_v3.Schema$File;
      video?: drive_v3.Schema$File;
      audio?: drive_v3.Schema$File;
      images: drive_v3.Schema$File[];
      htmlZip?: drive_v3.Schema$File;
    } = {
      images: [],
    };

    for (const file of files) {
      const name = file.name?.toLowerCase() || '';
      const mime = file.mimeType || '';

      // Cover image
      if (name.startsWith('cover.') && mime.startsWith('image/')) {
        result.cover = file;
      }
      // Video
      else if (name.endsWith('.mp4') || name.endsWith('.webm') || mime.startsWith('video/')) {
        result.video = file;
      }
      // Audio
      else if (name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.ogg') || mime.startsWith('audio/')) {
        result.audio = file;
      }
      // HTML zip (app.zip)
      else if (name === 'app.zip' || name === 'html.zip') {
        result.htmlZip = file;
      }
      // Other images (for galleries)
      else if (mime.startsWith('image/') && !name.startsWith('cover.')) {
        result.images.push(file);
      }
    }

    // Sort images by name for consistent ordering
    result.images.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return result;
  }
}
