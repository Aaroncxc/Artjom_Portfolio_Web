'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { CaseSectionMedia } from '@/lib/types';
import { Project3DPreview } from '@/components/Project3DPreview';
import { RichText } from '@/lib/formatRichText';

interface CaseStudyMediaProps {
  media: CaseSectionMedia;
  className?: string;
  onOpenLightbox?: (src: string) => void;
  /** Tall embed for live HTML / 3D */
  tall?: boolean;
  /** Hug frames: pin to an edge when beside copy (default centers). */
  align?: 'center' | 'start' | 'end';
  projectTitle?: string;
  model3dRotationX?: number;
  model3dMaterialColor?: string;
  model3dOffsetY?: number;
  model3dPoster?: string | null;
  model3dAnimationProgress?: number;
}

function frameBg(frame?: CaseSectionMedia['frame']): string {
  if (frame === 'dark') return 'bg-[#0b0d12]';
  if (frame === 'paper') return 'bg-[#F7F5F0]';
  return 'bg-[#F2F2F7]';
}

export function CaseStudyMedia({
  media,
  className,
  onOpenLightbox,
  tall,
  align = 'center',
  projectTitle,
  model3dRotationX,
  model3dMaterialColor,
  model3dOffsetY,
  model3dPoster,
  model3dAnimationProgress,
}: CaseStudyMediaProps) {
  const [modelMouse, setModelMouse] = useState({ x: 0.5, y: 0.5 });
  const portrait = Boolean(media.portrait);
  const fitContain = media.fit === 'contain' || portrait || tall;
  const hugX = align === 'start' ? 'mr-auto' : align === 'end' ? 'ml-auto' : 'mx-auto';

  if (media.kind === 'video') {
    const ambient = Boolean(media.autoplay || media.loop || media.muted);
    const hugVideo = portrait || ambient;
    return (
      <figure
        className={clsx(
          'overflow-hidden rounded-2xl ring-1 ring-black/[0.06]',
          hugVideo ? clsx(hugX, 'w-fit max-w-full') : 'w-full',
          media.frame === 'paper' ? 'bg-[#F7F5F0]' : 'bg-black',
          className,
        )}
      >
        <video
          src={media.src}
          controls={!ambient}
          playsInline
          preload="metadata"
          poster={model3dPoster ?? undefined}
          autoPlay={ambient}
          muted={ambient || media.muted}
          loop={ambient || media.loop}
          className={clsx(
            'block h-auto max-w-full object-contain',
            hugVideo ? 'w-auto max-h-[min(78vh,560px)]' : 'mx-auto w-full max-h-[78vh]',
            tall && !hugVideo && 'min-h-[40vh]',
          )}
        />
        {(media.caption || media.title) && (
          <figcaption className="border-t border-white/10 bg-black/80 px-4 py-3 text-sm text-white/80">
            {media.caption ? <RichText>{media.caption}</RichText> : media.title}
          </figcaption>
        )}
      </figure>
    );
  }

  if (media.kind === 'html') {
    return (
      <figure className={clsx('overflow-hidden rounded-2xl bg-[#F2F2F7] ring-1 ring-black/[0.06]', className)}>
        <div className={clsx('relative w-full', tall ? 'h-[min(72vh,720px)]' : 'aspect-[16/10]')}>
          <iframe
            src={media.src}
            title={media.title || projectTitle || 'Interactive embed'}
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen; xr-spatial-tracking"
            loading="lazy"
          />
        </div>
        {(media.caption || media.title) && (
          <figcaption className="px-4 py-3 text-sm text-mk-text-secondary">
            {media.caption ? <RichText>{media.caption}</RichText> : media.title}
          </figcaption>
        )}
      </figure>
    );
  }

  if (media.kind === 'model3d') {
    return (
      <figure className={clsx('overflow-hidden rounded-2xl bg-[#F2F2F7] ring-1 ring-black/[0.06]', className)}>
        <div
          className={clsx('relative w-full', tall ? 'h-[min(72vh,720px)]' : 'aspect-[16/10] min-h-[320px]')}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setModelMouse({
              x: (e.clientX - r.left) / Math.max(r.width, 1),
              y: (e.clientY - r.top) / Math.max(r.height, 1),
            });
          }}
          onMouseLeave={() => setModelMouse({ x: 0.5, y: 0.5 })}
        >
          <Project3DPreview
            modelPath={media.src}
            isHovered
            mousePosition={modelMouse}
            rotationX={model3dRotationX}
            materialColor={model3dMaterialColor}
            offsetY={model3dOffsetY}
            fallbackPoster={model3dPoster ?? null}
            showMeshStatsOverlay
            animationProgress={model3dAnimationProgress}
          />
        </div>
        {(media.caption || media.title) && (
          <figcaption className="px-4 py-3 text-sm text-mk-text-secondary">
            {media.caption ? <RichText>{media.caption}</RichText> : media.title}
          </figcaption>
        )}
      </figure>
    );
  }

  // image — contain/portrait: hug the bitmap so rounded corners wrap the frame (no side gutters)
  const captionOnDark = media.frame === 'dark';
  const hugFrame = fitContain || portrait;

  return (
    <figure
      className={clsx(
        'overflow-hidden rounded-2xl ring-1 ring-black/[0.06]',
        hugFrame ? clsx(hugX, 'w-fit max-w-full') : 'w-full',
        frameBg(media.frame),
        className,
      )}
    >
      <button
        type="button"
        className={clsx('cursor-zoom-in text-left', hugFrame ? 'block max-w-full' : 'block w-full')}
        onClick={() => onOpenLightbox?.(media.src)}
        aria-label={media.title ? `Enlarge ${media.title}` : 'Enlarge image'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.title || projectTitle || ''}
          className={clsx(
            'block',
            hugFrame
              ? 'h-auto w-auto max-h-[min(78vh,820px)] max-w-full'
              : 'h-auto w-full max-h-[78vh] object-cover',
            tall && !hugFrame && 'max-h-[85vh] object-contain',
          )}
          loading="lazy"
        />
      </button>
      {(media.caption || media.title) && (
        <figcaption
          className={clsx(
            'px-4 py-3 text-sm',
            captionOnDark ? 'border-t border-white/10 bg-black/80 text-white/80' : 'text-mk-text-secondary',
          )}
        >
          {media.caption ? <RichText>{media.caption}</RichText> : media.title}
        </figcaption>
      )}
    </figure>
  );
}
