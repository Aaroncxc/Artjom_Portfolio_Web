'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Project } from '@/lib/types';
import { buildHireMailto, CONTACT_MAILTO } from '@/lib/contact';
import { RichText } from '@/lib/formatRichText';
import { formatProjectMonthYear, normalizeMediaKey, resolveCaseSections } from '@/lib/caseStudy';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { SkyhavenHighlightDetail } from '@/components/highlights/SkyhavenHighlightDetail';
import { SkyhavenWebsitePanel } from '@/components/highlights/SkyhavenWebsitePanel';
import { highlightById } from '@/lib/highlightProjects';
import { getCaseStudyBanner } from '@/lib/caseStudyBanners';
import { CaseStudyBanner } from '@/components/caseStudy/CaseStudyBanner';
import { CaseStudySectionBlock } from '@/components/caseStudy/CaseStudySection';
import { MediaGalleryLightbox } from '@/components/projectSlide/LightboxModal';
import type { ModalAsset } from '@/components/portfolio/ProjectMediaCanvas';
import { isExternalHref } from '@/lib/toolLinks';

interface SkyhavenCaseStudyPageProps {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

function FactRow({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium leading-snug text-mk-text md:text-[15px]">{children}</dd>
    </div>
  );
}

export function SkyhavenCaseStudyPage({ project, prev, next }: SkyhavenCaseStudyPageProps) {
  const highlight = highlightById('skyhaven');
  const banner = getCaseStudyBanner('skyhaven');
  const monthYear = formatProjectMonthYear(project.date);
  const hireHref = buildHireMailto(`Hire me — ${project.title}`);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sections = useMemo(() => resolveCaseSections(project), [project]);

  const lightboxAssets = useMemo<ModalAsset[]>(() => {
    const imgs: ModalAsset[] = [];
    const seen = new Set<string>();
    sections.forEach((s) =>
      (s.media ?? []).forEach((m) => {
        if (m.kind !== 'image' || !m.src) return;
        const key = normalizeMediaKey(m.src);
        if (seen.has(key)) return;
        seen.add(key);
        imgs.push({ kind: 'image', src: m.src, thumb: m.src, caption: m.caption });
      }),
    );
    return imgs;
  }, [sections]);

  const openLightbox = (src: string) => {
    const idx = lightboxAssets.findIndex((a) => a.src === src);
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <>
      <LightLeaksBackground />

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/?skipHero=1#highlights-skyhaven"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-xs font-semibold text-mk-text-secondary transition-colors hover:text-mk-text"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            Highlights
          </Link>
          <Link href="/" className="brand-tight text-sm font-semibold tracking-tight text-mk-text">
            Artjom Naninjan
          </Link>
          <a
            href={hireHref}
            className="inline-flex min-h-[40px] items-center rounded-full bg-system-blue px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0077ED]"
          >
            Hire Me
          </a>
        </div>
      </header>

      <main className="relative z-[5] pb-24">
        {banner ? <CaseStudyBanner project={project} config={banner} /> : null}

        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start lg:gap-10">
            <div className="rounded-[20px] border border-black/[0.08] bg-white/85 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-7 lg:sticky lg:top-20">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
                Project facts
              </p>
              <dl className="grid gap-5 sm:grid-cols-2">
                <FactRow label="Role">{project.role}</FactRow>
                <FactRow label="Client / context">{project.client}</FactRow>
                <FactRow label="Timeframe">{project.timeframe || monthYear}</FactRow>
                <FactRow label="Team">{project.team}</FactRow>
                <FactRow label="Toolbox">
                  {project.tools?.length ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tools.map((t) => (
                        <li
                          key={t.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold"
                        >
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </FactRow>
                <FactRow label="References">
                  {project.references?.filter((r) => r.url?.trim()).length ? (
                    <ul className="space-y-1.5">
                      {project.references
                        .filter((r) => r.url?.trim())
                        .map((r) => (
                          <li key={r.url}>
                            <a
                              href={r.url}
                              {...(isExternalHref(r.url) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                              className="text-system-blue underline-offset-2 hover:underline"
                            >
                              {r.label || r.url}
                            </a>
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </FactRow>
              </dl>
            </div>

            {project.outcomes?.length ? (
              <div className="rounded-[20px] border border-black/[0.08] bg-[linear-gradient(180deg,rgba(28,28,28,0.03)_0%,rgba(255,255,255,0.9)_100%)] p-5 sm:p-7">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
                  Outcomes
                </p>
                <ul className="space-y-3">
                  {project.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[15px] leading-relaxed text-mk-text">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-system-blue" aria-hidden />
                      <span>
                        <RichText>{o}</RichText>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        {sections.length ? (
          <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-24">
            {sections.map((section, i) => (
              <CaseStudySectionBlock
                key={`${section.heading ?? 'section'}-${i}`}
                section={section}
                index={i}
                project={project}
                onOpenLightbox={openLightbox}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-12 sm:mt-16">
          <SkyhavenWebsitePanel />
        </div>

        {highlight ? (
          <section className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16 sm:px-6">
            <SkyhavenHighlightDetail highlight={highlight} variant="page" />
          </section>
        ) : null}

        <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6">
          <div className="rounded-[24px] border border-black/[0.08] bg-white/90 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] sm:p-10">
            <h2 className="brand-tight text-2xl font-semibold tracking-tight text-mk-text sm:text-3xl">
              Want to work together?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-mk-text-secondary sm:text-base">
              I lead production, 3D, and interactive builds from brief to release.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {project.references
                ?.filter((r) => r.url?.trim())
                .map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    {...(isExternalHref(r.url) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                    className="inline-flex min-h-[48px] items-center rounded-full border border-black/[0.1] bg-white px-6 text-sm font-semibold text-mk-text hover:bg-[#F2F2F7]"
                  >
                    {r.label || 'Open live'}
                  </a>
                ))}
              <a
                href={hireHref}
                className="inline-flex min-h-[48px] items-center rounded-full bg-system-blue px-6 text-sm font-semibold text-white hover:bg-[#0077ED]"
              >
                Hire Me
              </a>
              <a
                href={CONTACT_MAILTO}
                className="inline-flex min-h-[48px] items-center rounded-full border border-black/[0.1] bg-white px-6 text-sm font-semibold text-mk-text hover:bg-[#F2F2F7]"
              >
                Email
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/project/${prev.slug}`}
                className={clsx(
                  'group rounded-2xl border border-black/[0.08] bg-white/80 p-5 transition-colors hover:bg-white',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mk-text-muted">
                  Previous
                </p>
                <p className="mt-2 text-base font-semibold text-mk-text group-hover:text-system-blue">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/project/${next.slug}`}
                className={clsx(
                  'group rounded-2xl border border-black/[0.08] bg-white/80 p-5 text-right transition-colors hover:bg-white',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mk-text-muted">
                  Next
                </p>
                <p className="mt-2 text-base font-semibold text-mk-text group-hover:text-system-blue">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/?skipHero=1#highlights-skyhaven"
              className="text-sm font-semibold text-system-blue hover:opacity-80"
            >
              ← Back to Skyhaven highlight
            </Link>
          </div>
        </section>
      </main>

      <MediaGalleryLightbox
        assets={lightboxAssets}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(index) => setLightboxIndex(index)}
        alt={project.title}
      />
    </>
  );
}
