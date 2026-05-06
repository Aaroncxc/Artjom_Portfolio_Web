'use client';

import { useEffect, useMemo, useRef } from 'react';
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
 * Service hero/sample video. When `mp4Src` is set alongside a WebM `src`, only one format is
 * loaded: the browser picks the first `<source>` it can play (WebM in Chromium/Firefox, MP4 on Safari).
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
    const list: Array<{ src: string; type: string }> = [
      { src: media.src, type: mimeForVideoSrc(media.src) },
    ];
    if (media.mp4Src && media.mp4Src !== media.src) {
      list.push({ src: media.mp4Src, type: 'video/mp4' });
    }
    return list;
  }, [media.mp4Src, media.src]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (autoPlay) {
      video.play().catch(() => {});
    }
  }, [sources, autoPlay]);

  return (
    <video
      key={`${media.src}|${media.mp4Src ?? ''}`}
      ref={videoRef}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={controls ? 'metadata' : 'auto'}
      poster={poster}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
