'use client';

import * as React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlassPanel } from '@/components/GlassPanel';
import { PortfolioProjectModal } from '@/components/portfolio/PortfolioProjectModal';
import {
  chipLearningExperienceClass,
  chipTileImmersionClass,
  metaChipClass,
} from '@/lib/chipClasses';
import {
  HIGHLIGHT_PROJECTS,
  highlightById,
  type HighlightProject,
  type HighlightProjectId,
} from '@/lib/highlightProjects';
import { findPostBySlug } from '@/lib/loadPosts';
import type { Project } from '@/lib/types';

const SECTION_TITLE = 'Head of Production at DADB';
const SECTION_SUBTITLE = '2021–2025';
const SECTION_BODY_P1 =
  'Highlights from leading production at DADB: aligning stakeholders, then guiding 3D, cinematic, XR, and editorial work from brief through release—so narratives stay clear and delivery stays predictable.';
const SECTION_BODY_P2 =
  'A core part of the role was guarding on-time releases while several course productions ran in parallel—sequencing priorities, dependencies, and handoffs so timelines stayed credible even when workloads stacked or briefs leaned into XR installs, booth loops, and motion-led modules. Internal tooling for pipeline health and KPIs helped keep that multi-track pressure legible for leadership; a few representative projects below.';

interface HighlightBentoSectionProps {
  visible?: boolean;
}

function layoutSpring(reduceMotion: boolean) {
  if (reduceMotion) return { duration: 0.01 };
  return { type: 'spring' as const, stiffness: 280, damping: 32, mass: 0.85 };
}


function InlineSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5" aria-busy="true" aria-label="Loading project">
      <div className="h-9 w-44 animate-pulse rounded-full bg-black/[0.06]" />
      <div className="aspect-video w-full animate-pulse rounded-2xl bg-black/[0.06]" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-black/[0.06]" />
        <div className="h-4 w-1/2 max-w-sm animate-pulse rounded bg-black/[0.06]" />
        <div className="h-4 w-2/3 max-w-lg animate-pulse rounded bg-black/[0.06]" />
      </div>
    </div>
  );
}

function InlineNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 p-4 sm:p-6">
      <p className="text-sm text-mk-text-secondary">Project data could not be loaded.</p>
      <button
        type="button"
        onClick={onBack}
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-mk-text-secondary shadow-sm',
          'hover:bg-white hover:text-mk-text',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
        )}
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
        Back to highlights
      </button>
    </div>
  );
}

function InlineProjectView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [post, setPost] = React.useState<Project | null | 'loading'>('loading');

  React.useEffect(() => {
    let alive = true;
    findPostBySlug(slug).then((p) => {
      if (alive) setPost(p ?? null);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (post === 'loading') return <InlineSkeleton />;
  if (!post) return <InlineNotFound onBack={onBack} />;

  return (
    <div className="px-px">
      <PortfolioProjectModal project={post} onClose={onBack} variant="inline" />
    </div>
  );
}

/** Adapter: HighlightProject → Project, so we can reuse `PortfolioProjectModal` for tool tiles. */
function highlightAsProject(h: HighlightProject): Project {
  const yearMatch = /(\d{4})/.exec(h.year ?? '');
  const yearNum = yearMatch ? yearMatch[1] : '2024';
  const galleryMedia = (h.gallery ?? []).map((src) => ({ type: 'image' as const, src }));
  return {
    id: h.id,
    slug: h.id,
    title: h.title,
    description: h.description,
    date: `${yearNum}-06-01`,
    tools: h.tools.map((name) => ({ name })),
    tags: [h.category, ...(h.tileBadges ?? []).map(String)],
    type: 'image',
    thumbnail: h.thumb,
    images: h.gallery,
    gallery: galleryMedia.length > 0 ? galleryMedia : undefined,
    explanation: `${h.description}\n\nMy role: ${h.role}`,
    ctaHref: h.toolExternalUrl,
    references: h.toolExternalUrl
      ? [{ url: h.toolExternalUrl, label: 'Open Tool' }]
      : undefined,
  };
}

function SyntheticProjectView({ highlight, onBack }: { highlight: HighlightProject; onBack: () => void }) {
  const project = React.useMemo(() => highlightAsProject(highlight), [highlight]);
  return (
    <div className="px-px">
      <PortfolioProjectModal project={project} onClose={onBack} variant="inline" />
    </div>
  );
}

/** Desktop / large screens: screenshot-like bento. Mobile: featured full-width first, then 2×2. */
function tileCellClass(project: HighlightProject): string {
  if (project.span === 'featured') {
    return clsx(
      'relative min-h-[176px]',
      'col-span-2 row-span-1 order-first sm:min-h-[200px]',
      'lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:order-none',
    );
  }
  switch (project.id) {
    case 'lexsolar':
      return clsx('relative min-h-[118px]', 'sm:min-h-[132px] md:min-h-[148px]', 'order-2 lg:col-start-1 lg:row-start-1 lg:order-none lg:min-h-0');
    case 'kigali':
      return clsx('relative min-h-[118px]', 'sm:min-h-[132px] md:min-h-[148px]', 'order-3 lg:col-start-2 lg:row-start-1 lg:order-none lg:min-h-0');
    case 'dakar':
      return clsx('relative min-h-[118px]', 'sm:min-h-[132px] md:min-h-[148px]', 'order-4 lg:col-start-1 lg:row-start-2 lg:order-none lg:min-h-0');
    case 'emobility':
      return clsx('relative min-h-[118px]', 'sm:min-h-[132px] md:min-h-[148px]', 'order-5 lg:col-start-2 lg:row-start-2 lg:order-none lg:min-h-0');
    default:
      return '';
  }
}

/** Tile chips: tags first, then content tags, then VR/AR/3D immersion (always last). */
function TileBadgeRow({ project }: { project: HighlightProject }) {
  const badges = project.tileBadges ?? [];
  const isImmersion = (b: (typeof badges)[number]) => b === '3D' || b === 'VR' || b === 'AR';
  const contentBadges = badges.filter((b) => !isImmersion(b));
  const immersionBadges = badges.filter(isImmersion);

  return (
    <div className="pointer-events-none absolute left-1.5 top-1.5 right-1.5 z-20 flex flex-wrap gap-1 sm:left-2 sm:top-2 sm:right-2">
      {project.tileTags?.map((tag) => (
        <span key={`tag-${tag}`} className={clsx(metaChipClass, 'hidden sm:inline-flex')}>
          {tag}
        </span>
      ))}
      {contentBadges.map((b) => {
        if (b === 'Learning Experience') {
          return (
            <span key={b} className={chipLearningExperienceClass}>
              Learning Experience
            </span>
          );
        }
        return (
          <span key={b} className={metaChipClass}>
            {b}
          </span>
        );
      })}
      {immersionBadges.map((b) => (
        <span key={b} className={chipTileImmersionClass}>
          {b}
        </span>
      ))}
    </div>
  );
}

function TileFace({
  project,
  registerTileRef,
  onPick,
  reduceMotion,
}: {
  project: HighlightProject;
  registerTileRef: (id: HighlightProjectId, el: HTMLButtonElement | null) => void;
  onPick: (id: HighlightProjectId) => void;
  reduceMotion: boolean;
}) {
  const isFeatured = project.span === 'featured';
  const titleWords = project.title.trim().split(/\s+/);
  const [firstWord, ...restWords] = titleWords;

  return (
    <button
      ref={(el) => registerTileRef(project.id, el)}
      type="button"
      onClick={() => onPick(project.id)}
      className={clsx(
        'group relative flex h-full min-h-[124px] w-full flex-col overflow-hidden rounded-xl text-left sm:min-h-[140px] sm:rounded-2xl md:min-h-[148px]',
        'border border-black/[0.06] bg-[rgba(28,28,28,0.03)] shadow-[0_4px_24px_rgba(28,28,28,0.06)] ring-1 ring-black/[0.04]',
        'transition-[transform,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
        'hover:shadow-[0_8px_32px_rgba(0,122,255,0.14)]',
        reduceMotion ? '' : 'sm:hover:scale-[1.012] sm:active:scale-[0.992]',
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        {project.thumb ? (
          <img
            src={project.thumb}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_52%,rgba(0,122,255,0.06)_100%)]" />
        )}
        {isFeatured ? (
          <div
            className="absolute inset-0 bg-gradient-to-t from-white/[0.6] via-white/[0.22] to-transparent"
            aria-hidden
          />
        ) : null}
      </div>

      <TileBadgeRow project={project} />

      {isFeatured ? (
        <div className="pointer-events-none relative z-10 mt-auto p-3 sm:p-4 md:p-5">
          <div className="brand-tight max-w-[18rem] text-left text-[1.25rem] font-semibold leading-[1.06] tracking-tight text-mk-text [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_2px_14px_rgba(255,255,255,0.65),0_2px_18px_rgba(0,0,0,0.12)] sm:text-2xl md:text-3xl xl:text-[2.1rem]">
            <span className="block">{firstWord}</span>
            {restWords.length > 0 ? (
              <span className="block pl-5 pt-0.5 sm:pl-7 sm:pt-1">{restWords.join(' ')}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.35)] transition-opacity duration-300 group-hover:opacity-100 sm:rounded-2xl"
        aria-hidden
      />
    </button>
  );
}

function BentoGridCell({
  project,
  onPick,
  reduceMotion,
  registerTileRef,
}: {
  project: HighlightProject;
  onPick: (id: HighlightProjectId) => void;
  reduceMotion: boolean;
  registerTileRef: (id: HighlightProjectId, el: HTMLButtonElement | null) => void;
}) {
  return (
    <div className={clsx(tileCellClass(project), 'h-full')}>
      <TileFace
        project={project}
        registerTileRef={registerTileRef}
        onPick={onPick}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

export function HighlightBentoSection({ visible = true }: HighlightBentoSectionProps) {
  const [activeId, setActiveId] = React.useState<HighlightProjectId | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const tileRefs = React.useRef(new Map<HighlightProjectId, HTMLButtonElement>());

  const registerTileRef = React.useCallback((id: HighlightProjectId, el: HTMLButtonElement | null) => {
    if (el) tileRefs.current.set(id, el);
    else tileRefs.current.delete(id);
  }, []);

  const onClose = React.useCallback(() => {
    const id = activeId;
    setActiveId(null);
    if (id) {
      queueMicrotask(() => tileRefs.current.get(id)?.focus());
    }
  }, [activeId]);

  React.useEffect(() => {
    if (activeId === null) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [activeId, onClose]);

  React.useEffect(() => {
    if (activeId !== null && !highlightById(activeId)) setActiveId(null);
  }, [activeId]);

  const spring = layoutSpring(reduceMotion);

  if (!visible) return null;

  const isActive = activeId !== null;
  const activeProject = activeId ? highlightById(activeId) : undefined;
  const fade = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.24, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <section
      id="highlights"
      className="overflow-x-clip pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 md:pt-16"
    >
      <div
        className={clsx(
          'relative mx-auto max-w-7xl rounded-2xl p-px sm:rounded-3xl',
          'shadow-[0_0_16px_-16px_rgba(250,204,21,0.22),0_0_0_1px_rgba(250,204,21,0.12)] sm:shadow-[0_0_28px_-12px_rgba(250,204,21,0.28),0_0_0_1px_rgba(250,204,21,0.18)]',
        )}
      >
        {!reduceMotion ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 isolate overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <div
              className={clsx(
                'absolute left-1/2 top-1/2 aspect-square w-auto animate-highlight-bento-glow-spin bg-[conic-gradient(from_0deg,rgba(250,204,21,0)_0deg_282deg,rgba(250,204,21,0.12)_292deg,rgba(254,240,138,0.65)_304deg,rgba(253,224,71,0.88)_312deg,rgba(251,191,36,0.35)_322deg,rgba(250,204,21,0.06)_336deg,rgba(250,204,21,0)_360deg)]',
                'min-h-[min(130vw,520px)] h-[185%]',
                'sm:min-h-[min(115vw,720px)] sm:h-[220%]',
                'md:min-h-[800px]',
              )}
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/[0.06] via-transparent to-amber-200/[0.04] sm:rounded-3xl sm:from-amber-200/[0.07] sm:to-amber-200/[0.05]"
          />
        )}
        <GlassPanel
          variant="heavy"
          padding="lg"
          rounded="2xl"
          className="relative z-[1] rounded-[calc(1rem-1px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:rounded-[calc(1.5rem-1px)] !p-5 sm:!p-6 lg:!p-8"
        >
          <motion.div layout transition={spring}>
            <AnimatePresence mode="wait" initial={false}>
              {!isActive ? (
                <motion.div
                  key="highlights-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.16 } }}
                  transition={fade}
                  className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,2.12fr)] lg:gap-10"
                >
                  <div className="flex flex-col gap-3 sm:gap-4 lg:sticky lg:top-28 lg:self-start">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
                      Highlights
                    </span>
                    <h2 className="brand-tight text-[clamp(1.5rem,4.6vw,1.85rem)] font-semibold leading-[1.12] tracking-tight text-mk-text sm:text-3xl sm:leading-normal md:text-4xl lg:text-[2.2rem]">
                      {SECTION_TITLE}
                    </h2>
                    <p className="text-sm tabular-nums text-mk-text-muted sm:text-[0.9375rem]">{SECTION_SUBTITLE}</p>
                    <div className="max-w-none space-y-2 text-[0.9375rem] leading-relaxed text-mk-text-secondary sm:max-w-md sm:text-[15px] sm:leading-relaxed lg:text-base">
                      <p>{SECTION_BODY_P1}</p>
                      <p>{SECTION_BODY_P2}</p>
                    </div>
                  </div>

                  <div
                    className={clsx(
                      'grid gap-2.5 sm:gap-3 md:gap-5',
                      'grid-cols-2 lg:min-h-[560px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-5',
                    )}
                  >
                    {HIGHLIGHT_PROJECTS.map((project) => (
                      <BentoGridCell
                        key={project.id}
                        project={project}
                        onPick={setActiveId}
                        reduceMotion={reduceMotion}
                        registerTileRef={registerTileRef}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : activeProject ? (
                <motion.div
                  key={`highlights-detail-${activeProject.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.16 } }}
                  transition={fade}
                  className={clsx(
                    'rounded-xl bg-white text-left sm:rounded-2xl',
                    'border border-black/[0.06] shadow-[0_8px_32px_rgba(28,28,28,0.08)] ring-1 ring-black/[0.04]',
                  )}
                >
                  {activeProject.projectSlug ? (
                    <InlineProjectView slug={activeProject.projectSlug} onBack={onClose} />
                  ) : (
                    <SyntheticProjectView highlight={activeProject} onBack={onClose} />
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </GlassPanel>
      </div>
    </section>
  );
}
