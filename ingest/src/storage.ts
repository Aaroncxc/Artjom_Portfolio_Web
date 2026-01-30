import * as fs from 'fs';
import * as path from 'path';
import { StorageProvider } from './types';

// Local storage (copies to public folder)
export class LocalStorage implements StorageProvider {
  private baseDir: string;
  private publicUrlBase: string;

  constructor(baseDir: string, publicUrlBase: string = '') {
    this.baseDir = baseDir;
    this.publicUrlBase = publicUrlBase;
  }

  async upload(localPath: string, remotePath: string): Promise<string> {
    const destPath = path.join(this.baseDir, remotePath);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(localPath, destPath);
    return this.getPublicUrl(remotePath);
  }

  getPublicUrl(remotePath: string): string {
    if (this.publicUrlBase) {
      return `${this.publicUrlBase}/${remotePath}`;
    }
    return `/${remotePath}`;
  }
}

// S3-compatible storage (works with AWS S3, Cloudflare R2, etc.)
export class S3Storage implements StorageProvider {
  private bucket: string;
  private region: string;
  private endpoint?: string;
  private publicUrlBase: string;

  constructor(config: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
    publicUrlBase?: string;
  }) {
    this.bucket = config.bucket;
    this.region = config.region;
    this.endpoint = config.endpoint;
    this.publicUrlBase = config.publicUrlBase || `https://${config.bucket}.s3.${config.region}.amazonaws.com`;

    // In a real implementation, you would initialize the S3 client here
    // Example with AWS SDK v3:
    // import { S3Client } from '@aws-sdk/client-s3';
    // this.client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    //   endpoint: config.endpoint,
    // });
    
    console.log('[S3Storage] Initialized (stub implementation)');
    console.log(`  Bucket: ${this.bucket}`);
    console.log(`  Region: ${this.region}`);
    if (this.endpoint) console.log(`  Endpoint: ${this.endpoint}`);
  }

  async upload(localPath: string, remotePath: string): Promise<string> {
    // Stub implementation - in production, use AWS SDK
    // Example:
    // const fileStream = fs.createReadStream(localPath);
    // await this.client.send(new PutObjectCommand({
    //   Bucket: this.bucket,
    //   Key: remotePath,
    //   Body: fileStream,
    //   ContentType: mime.lookup(localPath) || 'application/octet-stream',
    // }));
    
    console.log(`[S3Storage] Would upload: ${localPath} -> ${remotePath}`);
    return this.getPublicUrl(remotePath);
  }

  getPublicUrl(remotePath: string): string {
    return `${this.publicUrlBase}/${remotePath}`;
  }
}

// Google Cloud Storage
export class GCSStorage implements StorageProvider {
  private bucket: string;
  private publicUrlBase: string;

  constructor(config: {
    bucket: string;
    projectId: string;
    publicUrlBase?: string;
  }) {
    this.bucket = config.bucket;
    this.publicUrlBase = config.publicUrlBase || `https://storage.googleapis.com/${config.bucket}`;

    // In a real implementation, you would initialize the GCS client here
    // Example:
    // import { Storage } from '@google-cloud/storage';
    // this.client = new Storage({ projectId: config.projectId });
    
    console.log('[GCSStorage] Initialized (stub implementation)');
    console.log(`  Bucket: ${this.bucket}`);
  }

  async upload(localPath: string, remotePath: string): Promise<string> {
    // Stub implementation - in production, use @google-cloud/storage
    // Example:
    // await this.client.bucket(this.bucket).upload(localPath, {
    //   destination: remotePath,
    // });
    
    console.log(`[GCSStorage] Would upload: ${localPath} -> ${remotePath}`);
    return this.getPublicUrl(remotePath);
  }

  getPublicUrl(remotePath: string): string {
    return `${this.publicUrlBase}/${remotePath}`;
  }
}

// Factory function to create storage provider
export function createStorageProvider(
  provider: 'local' | 's3' | 'r2' | 'gcs',
  config: Record<string, string>
): StorageProvider {
  switch (provider) {
    case 'local':
      return new LocalStorage(
        config.outputAssetsDir || '../public/assets',
        config.assetsCdnUrl
      );

    case 's3':
    case 'r2':
      return new S3Storage({
        bucket: config.S3_BUCKET || '',
        region: config.S3_REGION || 'us-east-1',
        accessKeyId: config.S3_ACCESS_KEY_ID || '',
        secretAccessKey: config.S3_SECRET_ACCESS_KEY || '',
        endpoint: config.S3_ENDPOINT,
        publicUrlBase: config.assetsCdnUrl,
      });

    case 'gcs':
      return new GCSStorage({
        bucket: config.GCS_BUCKET || '',
        projectId: config.GCS_PROJECT_ID || '',
        publicUrlBase: config.assetsCdnUrl,
      });

    default:
      throw new Error(`Unknown storage provider: ${provider}`);
  }
}
