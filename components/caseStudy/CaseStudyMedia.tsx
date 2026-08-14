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
  projectTitle?: string;
  model3dRotationX?: number;
  model3dMaterialColor?: string;
  model3dOffsetY?: number;
  model3dPoster?: string | null;
  model3dAnimationProgress?: number;
}

export function CaseStudyMedia({
  media,
  className,
  onOpenLightbox,
  tall,
  projectTitle,
  model3dRotationX,
  model3dMaterialColor,
  model3dOffsetY,
  model3dPoster,
  model3dAnimationProgress,
}: CaseStudyMediaProps) {
  const [modelMouse, setModelMouse] = useState({ x: 0.5, y: 0.5 });

  if (media.kind === 'video') {
    return (
      <figure className={clsx('overflow-hidden rounded-2xl bg-black ring-1 ring-black/[0.06]', className)}>
        <video
          src={media.src}
          controls
          playsInline
          preload="metadata"
          poster={model3dPoster ?? undefined}
          className={clsx('w-full object-contain', tall ? 'min-h-[50vh]' : 'max-h-[78vh]')}
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

  // image
  return (
    <figure className={clsx('overflow-hidden rounded-2xl bg-[#F2F2F7] ring-1 ring-black/[0.06]', className)}>
      <button
        type="button"
        className="block w-full cursor-zoom-in text-left"
        onClick={() => onOpenLightbox?.(media.src)}
        aria-label={media.title ? `Enlarge ${media.title}` : 'Enlarge image'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.title || projectTitle || ''}
          className={clsx('w-full object-cover', tall ? 'max-h-[85vh] object-contain' : 'max-h-[78vh]')}
          loading="lazy"
        />
      </button>
      {(media.caption || media.title) && (
        <figcaption className="px-4 py-3 text-sm text-mk-text-secondary">
          {media.caption ? <RichText>{media.caption}</RichText> : media.title}
        </figcaption>
      )}
    </figure>
  );
}
