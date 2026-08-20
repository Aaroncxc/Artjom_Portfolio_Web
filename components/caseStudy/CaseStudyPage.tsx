'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Project } from '@/lib/types';
import { buildHireMailto, CONTACT_MAILTO } from '@/lib/contact';
import { RichParagraphs, RichText, stripBoldMarkers } from '@/lib/formatRichText';
import {
  formatProjectMonthYear,
  normalizeMediaKey,
  projectYear,
  resolveCaseSections,
  resolveHeroMedia,
} from '@/lib/caseStudy';
import { isExternalHref } from '@/lib/toolLinks';
import { MediaGalleryLightbox } from '@/components/projectSlide/LightboxModal';
import type { ModalAsset } from '@/components/portfolio/ProjectMediaCanvas';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { getCaseStudyBanner } from '@/lib/caseStudyBanners';
import { CaseStudyBanner } from './CaseStudyBanner';
import { CaseStudyMedia } from './CaseStudyMedia';
import { CaseStudySectionBlock } from './CaseStudySection';

interface CaseStudyPageProps {
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

export function CaseStudyPage({ project, prev, next }: CaseStudyPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const banner = getCaseStudyBanner(project.slug);
  const sections = useMemo(() => resolveCaseSections(project), [project]);
  const hero = useMemo(() => resolveHeroMedia(project), [project]);
  const year = projectYear(project.date);
  const monthYear = formatProjectMonthYear(project.date);
  const hireHref = buildHireMailto(`Hire me — ${project.title}`);
  const liveRef = project.references?.find((r) => r.url?.trim());
  /** Dark banner pages keep video/media in story sections — no duplicate under the title. */
  const showInlineHero = !banner && Boolean(hero);

  const lightboxAssets = useMemo<ModalAsset[]>(() => {
    const imgs: ModalAsset[] = [];
    const seen = new Set<string>();
    const push = (src: string, caption?: string) => {
      if (!src) return;
      const key = normalizeMediaKey(src);
      if (seen.has(key)) return;
      seen.add(key);
      imgs.push({ kind: 'image', src, thumb: src, caption });
    };

    // Curated case studies: lightbox follows section stills only (avoids gallery dumping near-duplicates).
    const hasCuratedSections = (project.caseSections?.length ?? 0) > 0;
    sections.forEach((s) =>
      (s.media ?? []).forEach((m) => {
        if (m.kind === 'image') push(m.src, m.caption);
      }),
    );
    if (!hasCuratedSections) {
      (project.gallery ?? []).forEach((g) => {
        if (g.type === 'image') push(g.src, g.caption);
      });
      (project.images ?? []).forEach((src) => push(src));
      if (project.thumbnail) push(project.thumbnail);
    }
    return imgs;
  }, [project, sections]);

  const openLightbox = (src: string) => {
    const idx = lightboxAssets.findIndex((a) => a.src === src);
    if (idx >= 0) setLightboxIndex(idx);
  };

  const chip = (text: string) => (
    <span
      key={text}
      className="inline-flex items-center rounded-full border border-black/[0.08] bg-white/90 px-3 py-1 text-xs font-semibold text-mk-text shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
    >
      {text}
    </span>
  );

  return (
    <>
      <LightLeaksBackground />

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/?skipHero=1#projects"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-xs font-semibold text-mk-text-secondary transition-colors hover:text-mk-text"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            All projects
          </Link>
          <Link
            href="/"
            className="brand-tight text-sm font-semibold tracking-tight text-mk-text"
          >
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
        {banner ? (
          <CaseStudyBanner project={project} config={banner} />
        ) : (
          <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                {project.role ? chip(project.role) : null}
                {project.client ? chip(project.client) : null}
                {project.timeframe ? chip(project.timeframe) : year ? chip(year) : null}
              </div>

              <h1 className="brand-tight max-w-4xl text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-mk-text">
                {project.title}
              </h1>

              <div className="max-w-3xl text-base leading-relaxed text-mk-text-secondary md:text-lg md:leading-[1.65]">
                <RichText as="p">{project.description}</RichText>
              </div>
            </motion.div>

            {showInlineHero && hero ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 sm:mt-10"
              >
                <CaseStudyMedia
                  media={{ ...hero, caption: undefined }}
                  tall
                  onOpenLightbox={openLightbox}
                  projectTitle={project.title}
                  model3dPoster={project.thumbnail}
                />
              </motion.div>
            ) : null}
          </section>
        )}

        {/* Facts + Outcomes */}
        <section className={clsx('mx-auto max-w-7xl px-4 sm:px-6', banner && 'pt-10 sm:pt-14')}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start lg:gap-10">
            <div className="rounded-[20px] border border-black/[0.08] bg-white/85 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-7 lg:sticky lg:top-20">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
                Project facts
              </p>
              <dl className="grid gap-5 sm:grid-cols-2">
                <FactRow label="Role">{project.role}</FactRow>
                <FactRow label="Client / context">{project.client}</FactRow>
                <FactRow label="Timeframe">
                  {project.timeframe || monthYear}
                </FactRow>
                <FactRow label="Team">{project.team}</FactRow>
                <FactRow label="Toolbox">
                  {project.tools?.length ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tools.map((t) => (
                        <li
                          key={t.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold"
                        >
                          {t.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.icon} alt="" className="h-4 w-4 object-contain" />
                          ) : null}
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
            ) : (
              <div className="rounded-[20px] border border-black/[0.08] bg-white/70 p-5 sm:p-7">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
                  Overview
                </p>
                <RichParagraphs
                  text={stripBoldMarkers(project.explanation || project.description)}
                  className="space-y-3"
                  paragraphClassName="text-sm leading-relaxed text-mk-text-secondary md:text-[15px]"
                />
              </div>
            )}
          </div>
        </section>

        {/* Story */}
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

        {/* CTA + Prev/Next */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6">
          <div className="rounded-[24px] border border-black/[0.08] bg-white/90 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] sm:p-10">
            <h2 className="brand-tight text-2xl font-semibold tracking-tight text-mk-text sm:text-3xl">
              Want to work together?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-mk-text-secondary sm:text-base">
              I lead production, 3D, and interactive builds from brief to release.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {liveRef ? (
                <a
                  href={liveRef.url}
                  {...(isExternalHref(liveRef.url) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="inline-flex min-h-[48px] items-center rounded-full border border-black/[0.1] bg-white px-6 text-sm font-semibold text-mk-text hover:bg-[#F2F2F7]"
                >
                  {liveRef.label || 'Open live'}
                </a>
              ) : null}
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
                  'group rounded-2xl border border-black/[0.08] bg-white/80 p-5 text-right transition-colors hover:bg-white sm:text-right',
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
              href="/?skipHero=1#projects"
              className="text-sm font-semibold text-system-blue hover:opacity-80"
            >
              ← Back to all projects
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
