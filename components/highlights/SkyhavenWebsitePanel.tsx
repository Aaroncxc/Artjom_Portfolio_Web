'use client';

import { SKYHAVEN_SITE_URL } from '@/lib/toolLinks';
import {
  SKYHAVEN_CINEMATIC_POSTER,
  SKYHAVEN_CINEMATIC_VIDEO,
} from '@/lib/skyhavenVideos';
import { ViewportAutoplayVideo } from '@/components/ViewportAutoplayVideo';

const SITE_HOST = 'coincraft-skyhaven.vercel.app';

export function SkyhavenWebsitePanel() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-12">
        <a
          href={SKYHAVEN_SITE_URL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open the Skyhaven website"
          className="group block overflow-hidden rounded-[20px] border border-black/[0.10] bg-[#0b0d12] shadow-[0_8px_32px_rgba(0,0,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-[#16181f] px-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5f57]" aria-hidden />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#febc2e]" aria-hidden />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28c840]" aria-hidden />
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/70">
              {SITE_HOST}
            </span>
          </div>
          <div className="relative aspect-video overflow-hidden">
            <ViewportAutoplayVideo
              src={SKYHAVEN_CINEMATIC_VIDEO}
              poster={SKYHAVEN_CINEMATIC_POSTER}
              title="Skyhaven cinematic"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-end bg-gradient-to-t from-black/55 to-transparent p-4">
              <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-mk-text shadow-sm">
                Open website →
              </span>
            </span>
          </div>
        </a>

        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
            Official website
          </p>
          <h2 className="brand-tight text-2xl font-semibold tracking-tight text-mk-text sm:text-3xl">
            The Skyhaven website
          </h2>
          <p className="text-base leading-relaxed text-mk-text-secondary md:text-lg md:leading-[1.65]">
            I designed and shipped the public site as part of this project: arena roster with a live
            3D inspector, the build-mode loop, wiki, FAQ, and Windows / macOS downloads.
          </p>
          <a
            href={SKYHAVEN_SITE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-[44px] items-center rounded-full bg-system-blue px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0077ED]"
          >
            Open website
          </a>
        </div>
      </div>
    </section>
  );
}
