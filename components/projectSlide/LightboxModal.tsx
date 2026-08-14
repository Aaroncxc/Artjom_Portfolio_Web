'use client';

import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo } from 'react';
import type { ModalAsset } from '@/components/portfolio/ProjectMediaCanvas';
import { useHorizontalSwipe } from '@/lib/useHorizontalSwipe';

interface MediaGalleryLightboxProps {
  assets: ModalAsset[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  alt?: string;
}

/** Fullscreen gallery for modal images/videos — swipe or arrow to step through assets. */
export function MediaGalleryLightbox({
  assets,
  activeIndex,
  onClose,
  onNavigate,
  alt = 'Gallery view',
}: MediaGalleryLightboxProps) {
  const open = activeIndex !== null && activeIndex >= 0 && activeIndex < assets.length;
  const asset = open ? assets[activeIndex!] : null;

  const navigableIndices = useMemo(
    () =>
      assets
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => a.kind === 'image' || a.kind === 'video')
        .map(({ i }) => i),
    [assets],
  );

  const step = useCallback(
    (dir: 'prev' | 'next') => {
      if (activeIndex === null || navigableIndices.length <= 1) return;
      const pos = navigableIndices.indexOf(activeIndex);
      if (pos < 0) return;
      const nextPos =
        dir === 'next'
          ? (pos + 1) % navigableIndices.length
          : (pos - 1 + navigableIndices.length) % navigableIndices.length;
      onNavigate(navigableIndices[nextPos]);
    },
    [activeIndex, navigableIndices, onNavigate],
  );

  const swipe = useHorizontalSwipe(
    () => step('next'),
    () => step('prev'),
    open && navigableIndices.length > 1,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step('prev');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step('next');
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, step]);

  const posInGallery =
    activeIndex !== null ? navigableIndices.indexOf(activeIndex) : -1;
  const hasPrev = posInGallery > 0;
  const hasNext = posInGallery >= 0 && posInGallery < navigableIndices.length - 1;

  return (
    <AnimatePresence>
      {open && asset && (asset.kind === 'image' || asset.kind === 'video') ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex touch-pan-y flex-col bg-black/92"
          onClick={onClose}
          onTouchStart={swipe.onTouchStart}
          onTouchEnd={swipe.onTouchEnd}
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-[210] flex h-12 w-12 items-center justify-center rounded-full bg-white/18 text-white shadow-lg backdrop-blur-md transition hover:bg-white/28 sm:right-5 sm:top-5"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 pt-16 pb-16 sm:p-6">
            {asset.kind === 'image' ? (
              <motion.img
                key={asset.src}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                src={asset.src}
                alt={alt}
                className="max-h-[min(78dvh,900px)] w-auto max-w-full cursor-zoom-out object-contain"
                draggable={false}
                onClick={onClose}
              />
            ) : (
              <motion.video
                key={asset.src}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                src={asset.src}
                poster={asset.poster}
                controls
                autoPlay
                muted
                playsInline
                className="max-h-[min(78dvh,900px)] w-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {navigableIndices.length > 1 ? (
              <>
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={(e) => {
                    e.stopPropagation();
                    step('prev');
                  }}
                  aria-label="Previous"
                  className={clsx(
                    'absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
                    'bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/20',
                    'disabled:pointer-events-none disabled:opacity-30 sm:left-4',
                  )}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={(e) => {
                    e.stopPropagation();
                    step('next');
                  }}
                  aria-label="Next"
                  className={clsx(
                    'absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
                    'bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/20',
                    'disabled:pointer-events-none disabled:opacity-30 sm:right-4',
                  )}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>

          {navigableIndices.length > 1 ? (
            <p className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-xs text-white/55">
              Esc to close · Swipe for next · {posInGallery + 1} / {navigableIndices.length}
            </p>
          ) : (
            <p className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-xs text-white/55">
              Esc or click outside to close
            </p>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** @deprecated Use MediaGalleryLightbox — kept for any legacy single-image usage. */
export function LightboxModal({
  image,
  onClose,
  alt,
}: {
  image: string | null;
  onClose: () => void;
  alt?: string;
}) {
  const assets = image ? [{ kind: 'image' as const, src: image, thumb: image }] : [];
  return (
    <MediaGalleryLightbox
      assets={assets}
      activeIndex={image ? 0 : null}
      onClose={onClose}
      onNavigate={() => {}}
      alt={alt}
    />
  );
}
