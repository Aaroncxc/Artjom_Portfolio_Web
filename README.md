# multikunst Web

A production-ready landing site for the multikunst art collective featuring a glassmorphism design, 3D pointcloud hero, scroll-snap project gallery, and PureRef-inspired reference boards.

## Features

- **Interactive 3D Hero**: Pointcloud logo with scrub-to-reveal interaction
- **Glassmorphism Design**: Modern "milk glass" aesthetic with aurora gradients
- **Projects Grid**: Filterable grid with modal slides for project details
- **Reference Boards**: PureRef-inspired infinite canvas per project for mood boards
- **Multiple Media Types**: HTML/interactive, video, audio, and image projects
- **Accessibility**: Focus states, keyboard navigation, reduced motion support
- **Responsive**: Desktop-first with full mobile support

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **3D**: Three.js + @react-three/fiber
- **Animation**: Framer Motion
- **Design**: Glassmorphism with aurora gradients

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── GlobalBackgroundAurora.tsx  # Animated gradient blobs
│   ├── LightLeaksBackground.tsx    # Pearl gradient background
│   ├── GlassPanel.tsx      # Reusable glass container
│   ├── TextPointCloudHero.tsx  # 3D text pointcloud hero
│   ├── Navigation.tsx      # Glass navigation bar
│   ├── AboutSection.tsx    # About + member cards
│   ├── ProjectsGrid.tsx    # Project grid + filters + modal
│   ├── ProjectSlide.tsx    # Individual project slide (modal)
│   ├── Project3DPreview.tsx # 3D model preview in grid
│   ├── ProjectBoardAccordion.tsx  # Board accordion wrapper
│   └── board/
│       ├── BoardCanvas.tsx # Infinite canvas with pan/zoom
│       ├── BoardItem.tsx   # Individual board item
│       └── ResizeHandles.tsx # Resize controls
├── lib/
│   ├── types.ts            # Project types
│   ├── projects.ts         # Data helpers
│   ├── boardTypes.ts       # Board item types
│   └── boardIO.ts          # Board load/export/import
├── public/
│   ├── posts.json          # Projects data
│   ├── logo.svg            # Logo
│   ├── boards/             # Board JSON files
│   │   ├── echo-chamber.json
│   │   └── neural-pathways.json
│   └── projects/           # Interactive project files
```

## Reference Boards (PureRef-inspired)

Each project has an expandable "Board / References" accordion that provides an infinite canvas for mood boards and references.

### View Mode (Public)
- Pan: Click and drag, or Space + drag
- Zoom: Mouse wheel or pinch
- Media playback works (video/audio controls)
- Items cannot be moved or resized

### Edit Mode (Authorized)
To enable edit mode, add query parameters to the URL:

```
http://localhost:3000/?edit=1&key=YOUR_EDIT_KEY
```

The edit key is configured in `.env.local`:
```
NEXT_PUBLIC_MULTIKUNST_EDIT_KEY=your-secret-key
```

In edit mode:
- Drag & drop images, videos, or audio files onto the board
- Click to select items
- Drag to move selected items
- Corner handles to resize (images/videos)
- Toolbar: Save, Import, z-order controls, Delete, Reset view
- "Unsaved changes" indicator shows when changes haven't been saved

### Board Files

Board layouts are stored as JSON in `/public/boards/<slug>.json`:

```json
{
  "version": 1,
  "slug": "project-slug",
  "items": [
    {
      "id": "item_123",
      "type": "image",
      "src": "data:image/png;base64,... or URL",
      "fileName": "reference.png",
      "x": 100,
      "y": 50,
      "width": 300,
      "height": 200,
      "zIndex": 1
    }
  ],
  "lastModified": "2025-01-29T12:00:00Z"
}
```

**Workflow:**
1. Enable edit mode with `?edit=1&key=YOUR_KEY`
2. Drop files onto the board
3. Arrange items as needed
4. Click "Save" to download JSON
5. Place the JSON file in `/public/boards/<slug>.json`
6. Commit to version control

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Dark gradient | `#0B0F1A → #15112A` | Background |
| Glass bg | `rgba(255,255,255,0.08)` | Panels |
| Text primary | `rgba(255,255,255,0.92)` | Headings |
| Accent cyan | `#5EEAD4` | Primary accent |
| Accent violet | `#A78BFA` | Secondary accent |
| Accent coral | `#FB7185` | Tertiary accent |
| Board accent | `#4FD1C5` | Selection, focus |

### Keyboard Shortcuts (Board)

| Key | Action |
|-----|--------|
| Space + Drag | Pan canvas |
| Mouse Wheel | Zoom in/out |
| Escape | Deselect item |
| Delete/Backspace | Delete selected item (edit mode) |
| Tab | Navigate toolbar (edit mode) |

## Adding Projects

Edit `public/posts.json`:

```json
{
  "id": "9",
  "slug": "my-project",
  "title": "My Project",
  "description": "Description...",
  "date": "2025-12-01",
  "tags": ["art", "interactive"],
  "type": "html",
  "thumbnail": "/assets/cover.jpg",
  "htmlPath": "/projects/my-project/index.html"
}
```

## Drive-as-CMS (Future)

The content pipeline supports Google Drive as the source of truth:

1. Team uploads project folders to Drive
2. Ingest script processes folders with `post.json` metadata
3. Assets are uploaded to storage/CDN
4. `posts.json` is regenerated for the website

See `/ingest` folder for implementation details.

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Important:** Set `NEXT_PUBLIC_MULTIKUNST_EDIT_KEY` in your production environment variables. Use a strong, unique key for production.

Works with Vercel, Netlify, or any Node.js host.

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

WebGL required for 3D hero.

## License

MIT
