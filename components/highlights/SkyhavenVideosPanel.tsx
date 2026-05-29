'use client';

import * as React from 'react';
import clsx from 'clsx';
import { SKYHAVEN_VIDEO_CLIPS, type SkyhavenVideoClip } from '@/lib/skyhavenVideos';

interface SkyhavenVideosPanelProps {
  hireHref: string;
}

export function SkyhavenVideosPanel({ hireHref }: SkyhavenVideosPanelProps) {
  const [activeId, setActiveId] = React.useState(SKYHAVEN_VIDEO_CLIPS[0]?.id ?? '');
  const active =
    SKYHAVEN_VIDEO_CLIPS.find((c) => c.id === activeId) ?? SKYHAVEN_VIDEO_CLIPS[0];

  if (!active) return null;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="space-y-2">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-mk-text-muted">
          Gameplay clips
        </span>
        <p className="max-w-2xl text-sm leading-relaxed text-mk-text-secondary md:text-[15px]">
          Switch between captures from the prototype — intro, combat, farming, and the desktop widget shell.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-1.5"
        role="tablist"
        aria-label="Skyhaven video clips"
      >
        {SKYHAVEN_VIDEO_CLIPS.map((clip) => {
          const isActive = clip.id === active.id;
          return (
            <button
              key={clip.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(clip.id)}
              className={clsx(
                'rounded-full px-2.5 py-1 text-[10px] font-semibold transition sm:text-[11px]',
                isActive
                  ? 'bg-system-blue text-white shadow-sm'
                  : 'border border-black/[0.08] bg-white text-mk-text-secondary hover:text-mk-text',
              )}
            >
              {clip.title}
            </button>
          );
        })}
      </div>

      <VideoPlayer clip={active} hireHref={hireHref} />
    </div>
  );
}

function VideoPlayer({ clip, hireHref }: { clip: SkyhavenVideoClip; hireHref: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.load();
  }, [clip.src]);

  return (
    <article className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl bg-[#0d1117] ring-1 ring-black/[0.08] sm:rounded-2xl">
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            key={clip.src}
            src={clip.src}
            poster={clip.poster}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain bg-[#0d1117]"
          >
            <track kind="captions" />
          </video>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-semibold text-mk-text sm:text-lg">{clip.title}</h3>
          <p className="text-sm leading-relaxed text-mk-text-secondary">{clip.description}</p>
        </div>
        <a
          href={hireHref}
          className="inline-flex h-14 shrink-0 items-center justify-center self-start rounded-[10px] bg-system-blue px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0077ED] sm:h-16 sm:min-w-[152px] sm:self-center"
        >
          Hire Me !
        </a>
      </div>
    </article>
  );
}
