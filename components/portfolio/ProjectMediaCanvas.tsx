'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import type { Project } from '@/lib/types';
import { Project3DPreview } from '../Project3DPreview';
import {
  assignGroupKey,
  isUnrealBlueprintAsset,
  type ProjectMediaGroupsConfig,
} from '@/lib/projectMediaGroups';

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
  /** Visible description under the main viewer in the project modal. */
  caption?: string;
  /** When set, `ProjectMediaThumbs` renders a tiny Three.js preview instead of `thumb`. */
  thumbModelPreview?: ModalThumbModelPreview;
  /** Optional group bucket assigned by `lib/projectMediaGroups` for the project. */
  groupKey?: string;
}

function resolveAssetCaption(
  project: Project,
  src: string,
  explicit?: string,
): string | undefined {
  const fromExplicit = explicit?.trim();
  if (fromExplicit) return fromExplicit;
  const fromMap = project.mediaCaptions?.[src.trim()]?.trim();
  return fromMap || undefined;
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

/** First still image for the modal (thumbnail or gallery), never a video file path. */
function pickFirstImageSrc(project: Project): string | undefined {
  const thumb = project.thumbnail?.trim();
  if (thumb && !/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(thumb)) return thumb;
  const fromImages = project.images?.map((s) => s.trim()).find(Boolean);
  if (fromImages) return fromImages;
  const fromGallery = project.gallery?.find((m) => m.type === 'image')?.src?.trim();
  if (fromGallery) return fromGallery;
  if (project.type === 'image' && thumb) return thumb;
  return undefined;
}

/**
 * Builds the ordered list of media assets that the project modal can swap between.
 * Order: video (if any) → first still image → live HTML 3D → remaining media.
 */
export function buildModalAssets(project: Project): ModalAsset[] {
  const fallbackThumb = project.thumbnail ?? '';
  const assets: ModalAsset[] = [];
  const pushedSrc = new Set<string>();

  const embeddedHtmlPath = project.htmlPath?.trim() ?? '';
  const primaryVideoUrl = project.videoUrl?.trim() ?? '';
  const primaryAudioUrl = project.audioUrl?.trim() ?? '';
  const hasLiveHtmlViewer = Boolean(embeddedHtmlPath) || project.type === 'html';
  const includeModal3d = project.showModel3dInModal ?? !hasLiveHtmlViewer;

  const push = (asset: ModalAsset) => {
    const key = asset.src.trim();
    if (pushedSrc.has(key)) return;
    pushedSrc.add(key);
    assets.push(asset);
  };

  // 1. Video first when available (any project type)
  if (primaryVideoUrl) {
    push({
      kind: 'video',
      src: primaryVideoUrl,
      poster: project.thumbnail,
      thumb: fallbackThumb,
      title: project.title,
      caption: resolveAssetCaption(project, primaryVideoUrl),
    });
  }

  // 2. Primary audio when there is no video
  if (!primaryVideoUrl && primaryAudioUrl) {
    push({
      kind: 'audio',
      src: primaryAudioUrl,
      thumb: fallbackThumb,
      title: project.title,
      caption: resolveAssetCaption(project, primaryAudioUrl),
    });
  }

  // 3. First still image (after video, or leads when no video/audio)
  const firstImageSrc = pickFirstImageSrc(project);
  if (firstImageSrc) {
    push({
      kind: 'image',
      src: firstImageSrc,
      thumb: firstImageSrc,
      caption: resolveAssetCaption(project, firstImageSrc),
    });
  }

  // 4. Live / embedded HTML 3D viewer (lazy-loaded inside iframe)
  const pushLiveHtml = (htmlSrc: string, title: string) => {
    const tpm = thumbModelPreviewForProject(project);
    push({
      kind: 'html',
      src: htmlSrc,
      thumb: fallbackThumb,
      title,
      caption: resolveAssetCaption(project, htmlSrc),
      ...(tpm ? { thumbModelPreview: tpm } : {}),
    });
  };

  if (project.type === 'html' && (project.htmlPath || project.slug)) {
    pushLiveHtml(
      project.htmlPath || `/projects/${project.slug}/index.html`,
      project.title,
    );
  } else if (embeddedHtmlPath) {
    pushLiveHtml(embeddedHtmlPath, 'Live 3D');
  }

  // 5. Optional static model3d slide
  if (includeModal3d && project.model3dPath) {
    push({
      kind: 'model3d',
      src: project.model3dPath,
      thumb: fallbackThumb,
      title: '3D model',
      caption: resolveAssetCaption(project, project.model3dPath),
    });
  }

  // 6. Remaining images
  if (project.images?.length) {
    for (const src of project.images) {
      const trimmed = src.trim();
      if (!trimmed || trimmed === firstImageSrc) continue;
      push({
        kind: 'image',
        src: trimmed,
        thumb: trimmed,
        caption: resolveAssetCaption(project, trimmed),
      });
    }
  } else if (
    project.type === 'image' &&
    project.thumbnail?.trim() &&
    project.thumbnail.trim() !== firstImageSrc
  ) {
    const src = project.thumbnail.trim();
    push({
      kind: 'image',
      src,
      thumb: src,
      caption: resolveAssetCaption(project, src),
    });
  }

  // 7. Gallery (skip duplicates already pushed)
  if (project.gallery?.length) {
    for (const media of project.gallery) {
      if (!includeModal3d && media.type === 'model3d') continue;
      const src = media.src.trim();
      if (!src) continue;
      if (pushedSrc.has(src)) continue;
      if (media.type === 'html' && src === embeddedHtmlPath) continue;
      if (media.type === 'video' && src === primaryVideoUrl) continue;
      if (media.type === 'image' && src === firstImageSrc) continue;

      push({
        kind: media.type,
        src,
        thumb: media.type === 'image' ? src : fallbackThumb,
        title: media.title,
        caption: resolveAssetCaption(project, src, media.caption),
      });
    }
  }

  // 8. Unreal blueprint embeds
  if (project.unrealBlueprints?.length) {
    for (const bp of project.unrealBlueprints) {
      const url = bp.url?.trim();
      if (!url) continue;
      const titleBase = bp.title?.trim() || 'Unreal Blueprint';
      const preview = bp.previewImage?.trim();
      const thumb = preview || fallbackThumb;
      const bpCaption = resolveAssetCaption(project, url, bp.caption);

      if (preview && !pushedSrc.has(preview)) {
        push({
          kind: 'image',
          src: preview,
          thumb: preview,
          title: `${titleBase} — Editor view`,
          caption: bpCaption ?? resolveAssetCaption(project, preview),
        });
      }

      if (!pushedSrc.has(url)) {
        push({
          kind: 'html',
          src: url,
          thumb,
          title: titleBase,
          caption: bpCaption,
        });
      }
    }
  }

  if (assets.length === 0 && project.thumbnail?.trim()) {
    push({
      kind: 'image',
      src: project.thumbnail,
      thumb: project.thumbnail,
      caption: resolveAssetCaption(project, project.thumbnail),
    });
  }

  return assets;
}

/** Attach `groupKey` to assets in place when a project has a grouping config. */
export function applyMediaGroupAssignment(
  assets: ModalAsset[],
  config: ProjectMediaGroupsConfig | undefined,
): void {
  if (!config) return;
  for (const a of assets) {
    a.groupKey = assignGroupKey(a, config);
  }
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
            title={asset.title || projectTitle}
            className="h-full w-full border-0"
            sandbox={
              /^https?:\/\//i.test(asset.src)
                ? 'allow-scripts allow-popups'
                : 'allow-scripts allow-same-origin'
            }
            allow="fullscreen"
            scrolling="no"
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

interface MediaThumbButtonProps {
  asset: ModalAsset;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}

/** Single asset thumbnail button used by both the linear strip and grouped strip. */
function MediaThumbButton({ asset, index, isActive, onSelect }: MediaThumbButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={clsx(
        'relative flex-shrink-0 overflow-hidden rounded-[10px] border bg-white transition',
        isActive
          ? 'border-system-blue shadow-[0_0_0_3px_rgba(0,122,255,0.22)]'
          : 'border-[rgba(60,60,67,0.18)] hover:border-[rgba(60,60,67,0.32)] shadow-sm',
      )}
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
          {isUnrealBlueprintAsset(asset) ? 'BP' : 'Live'}
        </span>
      )}
      {asset.kind === 'model3d' && (
        <span className="pointer-events-none absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
          3D
        </span>
      )}
    </button>
  );
}

interface ProjectMediaThumbsProps {
  assets: ModalAsset[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** When provided, renders collapsible group tiles instead of the linear strip. */
  groupsConfig?: ProjectMediaGroupsConfig;
}

export function ProjectMediaThumbs({
  assets,
  activeIndex,
  onSelect,
  groupsConfig,
}: ProjectMediaThumbsProps) {
  if (assets.length <= 1) return null;

  if (groupsConfig) {
    return (
      <GroupedMediaThumbs
        assets={assets}
        activeIndex={activeIndex}
        onSelect={onSelect}
        groupsConfig={groupsConfig}
      />
    );
  }

  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1">
      {assets.map((asset, index) => (
        <MediaThumbButton
          key={`${asset.src}-${index}`}
          asset={asset}
          index={index}
          isActive={index === activeIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface GroupedMediaThumbsProps {
  assets: ModalAsset[];
  activeIndex: number;
  onSelect: (index: number) => void;
  groupsConfig: ProjectMediaGroupsConfig;
}

/**
 * Collapsible group strip — N tiles up front, each with a faded preview image
 * hinting at more content. Clicking a tile makes the others vanish and reveals
 * its assets inline; clicking the open tile again restores all tiles.
 * Asset selection still uses the original `assets` index, so the main canvas
 * stays in sync with the linear strip behavior.
 */
function GroupedMediaThumbs({
  assets,
  activeIndex,
  onSelect,
  groupsConfig,
}: GroupedMediaThumbsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const buckets = useMemo(() => {
    const map = new Map<string, Array<{ asset: ModalAsset; index: number }>>();
    for (const g of groupsConfig.groups) map.set(g.key, []);
    assets.forEach((asset, index) => {
      const key = asset.groupKey;
      if (key && map.has(key)) {
        map.get(key)!.push({ asset, index });
      }
    });
    return map;
  }, [assets, groupsConfig]);

  /** First usable thumb per group — used as the faded preview behind the tile label. */
  const previewByGroup = useMemo(() => {
    const map = new Map<string, string>();
    for (const [key, list] of buckets.entries()) {
      const withThumb = list.find(({ asset }) => Boolean(asset.thumb));
      if (withThumb?.asset.thumb) map.set(key, withThumb.asset.thumb);
    }
    return map;
  }, [buckets]);

  const toggle = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <div className="flex w-full items-stretch gap-2 overflow-x-auto pb-1">
      {groupsConfig.groups.map((group) => {
        const items = buckets.get(group.key) ?? [];
        const isOpen = expanded === group.key;
        const isHidden = expanded !== null && !isOpen;
        const activeIsHere = items.some(({ index }) => index === activeIndex);
        const previewSrc = previewByGroup.get(group.key);

        return (
          <Fragment key={group.key}>
            <AnimatePresence initial={false} mode="popLayout">
              {!isHidden && (
                <motion.button
                  layout
                  key={`tile-${group.key}`}
                  type="button"
                  onClick={() => toggle(group.key)}
                  aria-expanded={isOpen}
                  aria-label={`${group.label} (${items.length})`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className={clsx(
                    'relative flex flex-shrink-0 flex-col items-start justify-between overflow-hidden rounded-[10px] border bg-white px-2.5 py-1.5 text-left transition-colors',
                    isOpen
                      ? 'border-system-blue shadow-[0_0_0_3px_rgba(0,122,255,0.22)]'
                      : 'border-[rgba(60,60,67,0.18)] hover:border-[rgba(60,60,67,0.32)] shadow-sm',
                  )}
                  style={{ width: 152, height: 64 }}
                >
                  {previewSrc && (
                    <>
                      <img
                        src={previewSrc}
                        alt=""
                        loading="lazy"
                        aria-hidden
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.78)_55%,rgba(255,255,255,0.32)_100%)]"
                      />
                    </>
                  )}

                  <span className="relative flex w-full items-start gap-1.5">
                    <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-mk-text drop-shadow-[0_1px_0_rgba(255,255,255,0.55)]">
                      {group.label}
                    </span>
                    {activeIsHere && (
                      <span
                        className="ml-auto mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-system-blue"
                        aria-hidden
                      />
                    )}
                  </span>
                  <span className="relative flex w-full items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-mk-text-muted">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                    <svg
                      className={clsx(
                        'h-3.5 w-3.5 text-system-blue transition-transform duration-200',
                        isOpen && 'rotate-90',
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.25}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false} mode="popLayout">
              {isOpen &&
                items.map(({ asset, index }) => (
                  <motion.div
                    layout
                    key={`${asset.src}-${index}`}
                    initial={{ opacity: 0, x: -8, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex-shrink-0"
                  >
                    <MediaThumbButton
                      asset={asset}
                      index={index}
                      isActive={index === activeIndex}
                      onSelect={onSelect}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </Fragment>
        );
      })}
    </div>
  );
}
