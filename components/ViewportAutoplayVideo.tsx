'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface ViewportAutoplayVideoProps {
  src: string;
  poster?: string;
  title: string;
  /** Never mount decoder — poster only (mobile / reduced motion). */
  staticOnly?: boolean;
  className?: string;
}

/**
 * Looping tile preview: poster visible immediately, decodes/plays only while intersecting.
 */
export function ViewportAutoplayVideo({
  src,
  poster,
  title,
  staticOnly = false,
  className = 'h-full w-full object-cover',
}: ViewportAutoplayVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (staticOnly) return;
    const root = rootRef.current;
    if (!root) return;

    const syncFromRect = () => {
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      setInView(r.bottom > 0 && r.top < vh && r.width > 0 && r.height > 0);
    };

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '64px 0px' },
    );
    io.observe(root);
    syncFromRect();

    return () => io.disconnect();
  }, [staticOnly]);

  useEffect(() => {
    if (staticOnly) return;
    const v = videoRef.current;
    if (!v) return;

    const onPlaying = () => setPlaying(true);
    const onPause = () => {
      if (v.readyState < 2) setPlaying(false);
    };
    const onEmptied = () => setPlaying(false);

    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('emptied', onEmptied);

    if (!inView) {
      v.pause();
      setPlaying(false);
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    } else {
      v.preload = 'auto';
      v.play().catch(() => {});
    }

    return () => {
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('emptied', onEmptied);
      v.pause();
    };
  }, [inView, staticOnly, src]);

  if (staticOnly) {
    return poster ? (
      <img src={poster} alt={title} loading="eager" decoding="async" className={clsx('absolute inset-0', className)} />
    ) : (
      <div className={clsx('absolute inset-0', className, 'bg-[rgba(28,28,28,0.06)]')} aria-hidden />
    );
  }

  return (
    <div ref={rootRef} className="absolute inset-0">
      {poster ? (
        <img
          src={poster}
          alt={title}
          loading="eager"
          decoding="async"
          className={clsx(
            'absolute inset-0',
            className,
            'transition-opacity duration-500',
            playing ? 'opacity-0' : 'opacity-100',
          )}
        />
      ) : null}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={inView ? 'auto' : 'none'}
        aria-label={title}
        className={clsx(
          'absolute inset-0',
          className,
          'transition-opacity duration-500',
          playing ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
