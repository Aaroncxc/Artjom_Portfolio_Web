'use client';

import Image from 'next/image';
import clsx from 'clsx';
import type { Project } from '@/lib/types';
import { RichText } from '@/lib/formatRichText';
import { projectYear } from '@/lib/caseStudy';
import {
  caseStudyBannerGlowClass,
  type CaseStudyBannerConfig,
} from '@/lib/caseStudyBanners';

interface CaseStudyBannerProps {
  project: Project;
  config: CaseStudyBannerConfig;
}

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm">
      {text}
    </span>
  );
}

function AgataWordmark() {
  return (
    <div className="mt-8 sm:mt-10">
      <p
        className="brand-tight text-[clamp(2.75rem,9vw,5.5rem)] font-semibold leading-none tracking-tight"
        style={{ color: '#5B9FE8' }}
        aria-hidden
      >
        agata
      </p>
      <p className="mt-3 text-base font-medium tracking-tight text-white/90 sm:text-lg md:text-xl">
        Speak. Reflect. Grow.
      </p>
    </div>
  );
}

export function CaseStudyBanner({ project, config }: CaseStudyBannerProps) {
  const year = projectYear(project.date);
  const chips = [project.role, project.client, project.timeframe || year].filter(Boolean) as string[];
  const hasCutout = Boolean(config.cutoutSrc);

  return (
    <section className="relative overflow-hidden bg-[#0b0d12]">
      <div
        className={clsx('pointer-events-none absolute inset-0', caseStudyBannerGlowClass(config.glow))}
        aria-hidden
      />
      <div
        className={clsx(
          'relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:pb-20',
          hasCutout && 'lg:pb-24',
        )}
      >
        {chips.length ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c} text={c} />
            ))}
          </div>
        ) : null}

        <div
          className={clsx(
            hasCutout && 'grid items-end gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8',
          )}
        >
          <div className="min-w-0">
            {config.mark.kind === 'image' ? (
              <>
                <h1 className="sr-only">{project.title}</h1>
                <Image
                  src={config.mark.src}
                  alt={config.mark.alt}
                  width={config.mark.width}
                  height={config.mark.height}
                  priority
                  className={config.mark.className}
                />
              </>
            ) : config.mark.kind === 'agata-wordmark' ? (
              <>
                <h1 className="sr-only">{project.title}</h1>
                <AgataWordmark />
              </>
            ) : (
              <h1 className="brand-tight mt-8 max-w-4xl text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-white sm:mt-10">
                {project.title}
              </h1>
            )}

            <div className="mt-8 max-w-3xl text-base leading-relaxed text-white/75 md:mt-10 md:text-lg md:leading-[1.65]">
              <RichText as="p">{project.description}</RichText>
            </div>
          </div>

          {config.cutoutSrc ? (
            <div className="relative mx-auto flex w-full max-w-md justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.cutoutSrc}
                alt={config.cutoutAlt || project.title}
                className="h-auto max-h-[min(58vh,520px)] w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)] lg:max-h-[min(62vh,560px)]"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
