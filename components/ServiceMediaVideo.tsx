'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ServiceMedia } from '@/lib/services';

function mimeForVideoSrc(src: string): string {
  const lower = src.toLowerCase();
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

function defaultPoster(media: ServiceMedia): string | undefined {
  if (media.poster) return media.poster;
  if (media.type !== 'video') return undefined;
  if (!/\.(webm|mp4|mov)$/i.test(media.src)) return undefined;
  return media.src.replace(/\.(webm|mp4|mov)$/i, '.png');
}

interface ServiceMediaVideoProps {
  media: ServiceMedia;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

/**
 * Renders service hero/sample video with optional H.264 MP4 first for Safari / iOS
 * (WebM VP9 often shows a black player there).
 */
export function ServiceMediaVideo({
  media,
  className,
  controls,
  autoPlay,
  muted,
  loop,
  playsInline,
}: ServiceMediaVideoProps) {
  if (media.type !== 'video') return null;

  const poster = defaultPoster(media);
  const sources = useMemo(() => {
    const ordered = [
      media.mp4Src ? { src: media.mp4Src, type: 'video/mp4' } : null,
      { src: media.src, type: mimeForVideoSrc(media.src) },
    ].filter(Boolean) as Array<{ src: string; type: string }>;
    return ordered;
  }, [media.mp4Src, media.src]);
  const [activeSrc, setActiveSrc] = useState(sources[0]?.src ?? media.src);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActiveSrc(sources[0]?.src ?? media.src);
  }, [sources, media.src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (autoPlay) {
      video.play().catch(() => {});
    }
  }, [activeSrc, autoPlay]);

  const handleError = () => {
    const idx = sources.findIndex((source) => source.src === activeSrc);
    const next = sources[idx + 1];
    if (next && next.src !== activeSrc) {
      setActiveSrc(next.src);
    }
  };

  return (
    <video
      key={activeSrc}
      ref={videoRef}
      className={className}
      src={activeSrc}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={controls ? 'metadata' : 'auto'}
      poster={poster}
      onError={handleError}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
