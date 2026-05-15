# multikunst Ingest System

A Node.js pipeline that syncs content from Google Drive to the multikunst website.

## Overview

This system allows team members to upload new projects via Google Drive, which are then automatically processed and published to the website. Google Drive acts as the "source of truth" for content management, while public hosting uses optimized storage/CDN.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Google Drive   │ ──> │  Ingest Script  │ ──> │  Public Storage │
│  (Source)       │     │  (Processor)    │     │  (CDN/S3/R2)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   posts.json    │
                        │   (Website)     │
                        └─────────────────┘
```

## Upload Convention

Create a folder for each project in the designated Drive folder:

```
/MULTIKUNST_UPLOADS/
├── echo-chamber/                    # Folder name = project slug
│   ├── post.json                    # REQUIRED: Project metadata
│   ├── cover.png                    # Optional: Thumbnail image
│   └── app.zip                      # For type=html: Interactive app
│
├── chromatic-drift/
│   ├── post.json
│   ├── cover.jpg
│   └── video.mp4                    # For type=video: Video file
│
├── field-recordings/
│   ├── post.json
│   ├── cover.png
│   └── audio.mp3                    # For type=audio: Audio file
│
└── between-worlds/
    ├── post.json
    ├── cover.jpg
    ├── image-01.jpg                 # For type=image: Gallery images
    ├── image-02.jpg
    └── image-03.jpg
```

### post.json Format

```json
{
  "title": "Echo Chamber",
  "description": "An interactive sound installation exploring...",
  "date": "2025-11-15",
  "tags": ["installation", "sound", "interactive"],
  "type": "html",
  "author": "Sofia Andersson",
  "featured": true
}
```

**Fields:**
- `title` (required): Display title
- `description` (required): Project description
- `date` (required): Publication date (YYYY-MM-DD)
- `tags` (required): Array of tag strings
- `type` (required): One of `html`, `video`, `audio`, `image`
- `author` (optional): Creator name
- `featured` (optional): Boolean, highlights on homepage
- `model3dPath` (optional): Public path to an FBX for the portfolio modal 3D tab (e.g. `/projects/my-slug/model.fbx`). The file must already exist under `public/projects/<slug>/` (ingest does not upload it).
- `model3dRotationX`, `model3dOffsetY`, `model3dMaterialColor` (optional): Tunables for that preview
- `showTile3dHover` (optional): When `false`, the grid tile skips mounting 3D on hover (large models stay out of the grid)

### Asset Types by Project Type

| Type | Required Assets | Notes |
|------|-----------------|-------|
| `html` | `app.zip` | Must contain `index.html` at root |
| `video` | `.mp4` or `.webm` | First video file found |
| `audio` | `.mp3`, `.wav`, or `.ogg` | First audio file found |
| `image` | Multiple images | All images except cover |

All types can include a `cover.*` image for thumbnails.

## Setup

### 1. Install Dependencies

```bash
cd ingest
npm install
```

### 2. Configure Google Drive API

1. Create a Google Cloud project
2. Enable the Google Drive API
3. Create a service account and download the JSON key
4. Share the Drive folder with the service account email

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
# Required
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account.json

# Storage (choose one)
STORAGE_PROVIDER=local  # or s3, r2, gcs

# Output paths
OUTPUT_POSTS_JSON=../public/posts.json
OUTPUT_PROJECTS_DIR=../public/projects
OUTPUT_ASSETS_DIR=../public/assets
```

### 4. Storage Configuration

#### Local (default)
Assets are copied to `public/assets/`. Good for development.

#### S3 / Cloudflare R2
```env
STORAGE_PROVIDER=s3
S3_BUCKET=your-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
# For R2:
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
ASSETS_CDN_URL=https://cdn.yourdomain.com
```

#### Google Cloud Storage
```env
STORAGE_PROVIDER=gcs
GCS_BUCKET=your-bucket
GCS_PROJECT_ID=your-project
ASSETS_CDN_URL=https://storage.googleapis.com/your-bucket
```

## Usage

### Manual Run

```bash
npm run dev      # Development (ts-node)
npm run build    # Compile TypeScript
npm start        # Run compiled version
```

### Automated (Recommended)

Set up a cron job or scheduled task:

```bash
# Every 15 minutes
*/15 * * * * cd /path/to/ingest && npm start >> /var/log/ingest.log 2>&1
```

Or use a serverless function (AWS Lambda, Cloud Functions, etc.)

## Why This Architecture?

### Google Drive as Source of Truth
- **Familiar UI**: Team members already know Drive
- **Collaboration**: Built-in sharing and permissions
- **Version history**: Google maintains file versions
- **Mobile friendly**: Easy uploads from anywhere

### Separate Public Storage
- **Performance**: CDN edge caching
- **Cost**: Drive API has quotas; CDN is cheaper at scale
- **Control**: Proper cache headers, image optimization
- **Reliability**: Static hosting is simpler than API-dependent serving

## Future Improvements

### Push Notifications (Recommended)
Currently uses polling. For real-time updates:
1. Set up Google Drive Push Notifications (webhooks)
2. Deploy an endpoint to receive change notifications
3. Trigger ingest on relevant changes

### Image Optimization
Add automatic image processing:
- Generate responsive sizes (srcset)
- Convert to WebP/AVIF
- Compress thumbnails

### Video Transcoding
For video projects:
- Generate HLS/DASH for adaptive streaming
- Create preview thumbnails
- Extract audio track for accessibility

## Troubleshooting

### "No valid post.json found"
- Check the file is named exactly `post.json` (lowercase)
- Verify JSON syntax is valid
- Ensure required fields are present

### "Error: No valid Google credentials"
- Verify service account JSON path
- Check the service account has Drive API access
- Confirm folder is shared with service account email

### Assets not appearing
- Check file naming conventions
- Verify storage provider credentials
- Check CDN URL configuration
