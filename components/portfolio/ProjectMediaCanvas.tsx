'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/types';
import { Project3DPreview } from '../Project3DPreview';

/** Optional miniature GLB thumb for modal strip (live HTML tile). */
export interface ModalThumbModelPreview {
  src: string;
  rotationX?: number;
  materialColor?: string;
  offsetY?: number;
  animationProgress?: number;
}

export interface ModalAsset {
  kind: 'image' | 'video' | 'html' | 'audio' | 'model3d';
  src: string;
  thumb: string;
  poster?: string;
  title?: string;
  /** When set, `ProjectMediaThumbs` renders a tiny Three.js preview instead of `thumb`. */
  thumbModelPreview?: ModalThumbModelPreview;
}

function thumbModelPreviewForProject(project: Project): ModalThumbModelPreview | undefined {
  if (project.liveThumbUsesModelPreview === false) return undefined;
  const path = project.model3dPath?.trim();
  if (!path) return undefined;
  return {
    src: path,
    rotationX: project.model3dRotationX,
    materialColor: project.model3dMaterialColor,
    offsetY: project.model3dOffsetY,
    animationProgress: project.model3dAnimationProgress,
  };
}

/**
 * Builds the ordered list of media assets that the project modal can swap between.
 * When a project adds an embedded Live viewer (`htmlPath` while `type !== 'html'`), that HTML
 * slide opens first; otherwise the primary medium (video, audio, or html-first project) leads.
 */
export function buildModalAssets(project: Project): ModalAsset[] {
  const fallbackThumb = project.thumbnail ?? '';
  const assets: ModalAsset[] = [];

  /** Interactive `/projects/.../index.html` when primary type is not `html` but `htmlPath` is set. */
  const embeddedHtmlPath = project.htmlPath?.trim() ?? '';
  const prependLiveHtml = Boolean(embeddedHtmlPath && project.type !== 'html');

  if (project.type === 'html' && (project.htmlPath || project.slug)) {
    const tpm = thumbModelPreviewForProject(project);
    assets.push({
      kind: 'html',
      src: project.htmlPath || `/projects/${project.slug}/index.html`,
      thumb: fallbackThumb,
      title: project.title,
      ...(tpm ? { thumbModelPreview: tpm } : {}),
    });
  } else {
    if (prependLiveHtml) {
      const tpm = thumbModelPreviewForProject(project);
      assets.push({
        kind: 'html',
        src: embeddedHtmlPath,
        thumb: fallbackThumb,
        title: 'Live 3D',
        ...(tpm ? { thumbModelPreview: tpm } : {}),
      });
    }
    if (project.type === 'video' && project.videoUrl) {
      assets.push({
        kind: 'video',
        src: project.videoUrl,
        poster: project.thumbnail,
        thumb: fallbackThumb,
        title: project.title,
      });
    } else if (project.type === 'audio' && project.audioUrl) {
      assets.push({
        kind: 'audio',
        src: project.audioUrl,
        thumb: fallbackThumb,
        title: project.title,
      });
    }
  }

  // Default: when a Live HTML viewer (`htmlPath`) is available, skip the static
  // model3d slide so the modal only shows the interactive viewer. Projects can
  // opt back in via `showModel3dInModal: true`.
  const hasLiveHtmlViewer = Boolean(embeddedHtmlPath) || project.type === 'html';
  const includeModal3d = project.showModel3dInModal ?? !hasLiveHtmlViewer;
  if (includeModal3d && project.model3dPath) {
    assets.push({
      kind: 'model3d',
      src: project.model3dPath,
      thumb: fallbackThumb,
      title: '3D model',
    });
  }

  if (project.images && project.images.length > 0) {
    for (const src of project.images) {
      assets.push({ kind: 'image', src, thumb: src });
    }
  } else if (project.type === 'image' && project.thumbnail) {
    assets.push({
      kind: 'image',
      src: project.thumbnail,
      thumb: project.thumbnail,
    });
  }

  if (project.gallery) {
    for (const media of project.gallery) {
      if (!includeModal3d && media.type === 'model3d') continue;
      if (prependLiveHtml && media.type === 'html' && media.src === embeddedHtmlPath) continue;
      assets.push({
        kind: media.type,
        src: media.src,
        thumb: media.type === 'image' ? media.src : fallbackThumb,
        title: media.title,
      });
    }
  }

  if (assets.length === 0 && project.thumbnail) {
    assets.push({
      kind: 'image',
      src: project.thumbnail,
      thumb: project.thumbnail,
    });
  }

  return assets;
}

interface ProjectMediaCanvasProps {
  asset: ModalAsset;
  projectTitle: string;
  onImageZoom?: (src: string) => void;
  /** Passed through when asset.kind === 'model3d' */
  model3dRotationX?: number;
  model3dMaterialColor?: string;
  model3dOffsetY?: number;
  model3dPoster?: string | null;
  model3dAnimationProgress?: number;
}

export function ProjectMediaCanvas({
  asset,
  projectTitle,
  onImageZoom,
  model3dRotationX,
  model3dMaterialColor,
  model3dOffsetY,
  model3dPoster,
  model3dAnimationProgress,
}: ProjectMediaCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelMouseNdc, setModelMouseNdc] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (asset.kind !== 'video') return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [asset.kind, asset.src]);

  useEffect(() => {
    setModelMouseNdc({ x: 0.5, y: 0.5 });
  }, [asset.src, asset.kind]);

  useEffect(() => {
    setIsPlaying(false);
  }, [asset.src]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const requestFullscreen = () => {
    const target = containerRef.current;
    if (!target) return;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-[10px] bg-[#FAFAFA]"
    >
      {asset.kind === 'image' && (
        <button
          type="button"
          onClick={() => onImageZoom?.(asset.src)}
          className="group block h-full w-full cursor-zoom-in"
          aria-label="Zoom image"
        >
          <img
            src={asset.src}
            alt={asset.title || projectTitle}
            className="h-full w-full object-contain"
          />
        </button>
      )}

      {asset.kind === 'video' && (
        <>
          <video
            ref={videoRef}
            src={asset.src}
            poster={asset.poster}
            controls
            autoPlay
            muted
            playsInline
            loop
            className="h-full w-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
          <button
            type="button"
            onClick={requestFullscreen}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,28,28,0.1)] bg-white/90 text-mk-text shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </>
      )}

      {asset.kind === 'html' && (
        <>
          <iframe
            src={asset.src}
            title={projectTitle}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin"
            allow="fullscreen"
          />
          <button
            type="button"
            onClick={requestFullscreen}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,28,28,0.1)] bg-white/90 text-mk-text shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </>
      )}

      {asset.kind === 'audio' && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-[rgba(20,184,166,0.08)] via-white to-[rgba(139,92,246,0.08)] p-8">
          <div className="flex h-24 items-end gap-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-accent-cyan to-accent-violet"
                style={{ height: `${isPlaying ? 30 + ((i * 13) % 60) : 18}px`, transition: 'height 200ms ease' }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              const el = audioRef.current;
              if (!el) return;
              if (el.paused) {
                el.play().then(() => setIsPlaying(true)).catch(() => {});
              } else {
                el.pause();
                setIsPlaying(false);
              }
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(28,28,28,0.08)] text-mk-text transition hover:bg-[rgba(28,28,28,0.16)]"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <audio
            ref={audioRef}
            src={asset.src}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}

      {asset.kind === 'model3d' && (
        <>
          <div
            className="relative h-full min-h-[260px] w-full"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const w = Math.max(r.width, 1);
              const h = Math.max(r.height, 1);
              setModelMouseNdc({
                x: (e.clientX - r.left) / w,
                y: (e.clientY - r.top) / h,
              });
            }}
            onMouseLeave={() => setModelMouseNdc({ x: 0.5, y: 0.5 })}
          >
            <Project3DPreview
              modelPath={asset.src}
              isHovered
              mousePosition={modelMouseNdc}
              rotationX={model3dRotationX}
              materialColor={model3dMaterialColor}
              offsetY={model3dOffsetY}
              fallbackPoster={model3dPoster ?? asset.thumb ?? null}
              showMeshStatsOverlay
              animationProgress={model3dAnimationProgress}
            />
          </div>
          <button
            type="button"
            onClick={requestFullscreen}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,28,28,0.1)] bg-white/90 text-mk-text shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

interface ProjectMediaThumbsProps {
  assets: ModalAsset[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ProjectMediaThumbs({ assets, activeIndex, onSelect }: ProjectMediaThumbsProps) {
  if (assets.length <= 1) return null;

  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1">
      {assets.map((asset, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={`${asset.src}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`relative flex-shrink-0 overflow-hidden rounded-[10px] border bg-white transition ${
              isActive
                ? 'border-system-blue shadow-[0_0_0_3px_rgba(0,122,255,0.22)]'
                : 'border-[rgba(60,60,67,0.18)] hover:border-[rgba(60,60,67,0.32)] shadow-sm'
            }`}
            style={{ width: 96, height: 64 }}
            aria-label={`Asset ${index + 1}`}
            aria-current={isActive}
          >
            {asset.thumbModelPreview ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_100%)]">
                <Project3DPreview
                  modelPath={asset.thumbModelPreview.src}
                  isHovered={false}
                  mousePosition={{ x: 0.5, y: 0.5 }}
                  rotationX={asset.thumbModelPreview.rotationX}
                  materialColor={asset.thumbModelPreview.materialColor}
                  offsetY={asset.thumbModelPreview.offsetY}
                  animationProgress={asset.thumbModelPreview.animationProgress ?? 0}
                  fallbackPoster={asset.thumb || null}
                  showMeshStatsOverlay={false}
                />
              </div>
            ) : asset.thumb ? (
              <img
                src={asset.thumb}
                alt={asset.title || ''}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[rgba(28,28,28,0.06)] text-[10px] uppercase tracking-wide text-mk-text-muted">
                {asset.kind}
              </div>
            )}
            {asset.kind === 'video' && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
            {asset.kind === 'html' && (
              <span className="pointer-events-none absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                Live
              </span>
            )}
            {asset.kind === 'model3d' && (
              <span className="pointer-events-none absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                3D
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
