'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlassPanel } from '@/components/GlassPanel';
import { PortfolioProjectModal } from '@/components/portfolio/PortfolioProjectModal';
import {
  chipLearningExperienceClass,
  chipTileImmersionClass,
  liveChipClass,
  metaChipClass,
  testNowChipClass,
} from '@/lib/chipClasses';
import {
  highlightById,
  type HighlightProject,
  type HighlightProjectId,
} from '@/lib/highlightProjects';
import { SkyhavenHighlightDetail } from '@/components/highlights/SkyhavenHighlightDetail';
import {
  AI_APP_DEV_HIGHLIGHT_SECTION,
  ARCHITECTURE_HIGHLIGHT_SECTION,
  HIGHLIGHT_GLOW_THEMES,
  MULTIKUNST_HIGHLIGHT_SECTION,
  PRODUCTION_HIGHLIGHT_SECTION,
  SKYHAVEN_HIGHLIGHT_SECTION,
  type HighlightBentoSectionConfig,
} from '@/lib/highlightSections';
import type { Project } from '@/lib/types';
import { useMobilePerformance } from '@/lib/useMobilePerformance';
import { ViewportAutoplayVideo } from '@/components/ViewportAutoplayVideo';

interface HighlightBentoSectionProps {
  visible?: boolean;
  config?: HighlightBentoSectionConfig;
}

function layoutSpring(reduceMotion: boolean) {
  if (reduceMotion) return { duration: 0.01 };
  return { type: 'spring' as const, stiffness: 280, damping: 32, mass: 0.85 };
}

function TileAvailabilityPill({ status }: { status: 'live' | 'test' | 'demo-live' }) {
  const label =
    status === 'live' ? 'Live' : status === 'demo-live' ? 'Demo Live' : 'Test now';
  const useLiveStyle = status === 'live' || status === 'demo-live';

  return (
    <span className={clsx('shrink-0', useLiveStyle ? liveChipClass : testNowChipClass)}>
      {useLiveStyle ? (
        <>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/95" aria-hidden />
          {label}
        </>
      ) : (
        label
      )}
    </span>
  );
}

/** Matches absolute badge inset on tiles that only show availability (e.g. Occupied). */
const TILE_AVAILABILITY_INSET =
  'bottom-2 right-2 sm:bottom-2.5 sm:right-2.5' as const;
const TILE_FOOTER_BADGE_PADDING = 'pb-2 pr-2 sm:pb-2.5 sm:pr-2.5' as const;
const TILE_FOOTER_TITLE_PADDING = 'pb-2 pl-3 sm:pb-2.5 sm:pl-4 md:pl-5' as const;

function TileAvailabilityBadge({ status }: { status: 'live' | 'test' | 'demo-live' }) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute z-30',
        TILE_AVAILABILITY_INSET,
      )}
    >
      <TileAvailabilityPill status={status} />
    </div>
  );
}

function TileTitleWithAvailabilityRow({
  project,
  variant,
}: {
  project: HighlightProject;
  variant: 'featured' | 'prominent';
}) {
  const isProminent = variant === 'prominent';

  return (
    <div className="pointer-events-none relative z-10 mt-auto w-full">
      <div className="flex w-full items-end justify-between gap-2 sm:gap-3">
        <p
          className={clsx(
            'brand-tight min-w-0 flex-1 text-left font-semibold leading-[1.06] tracking-tight',
            TILE_FOOTER_TITLE_PADDING,
            isProminent
              ? 'text-[1.2rem] sm:text-[1.65rem] md:text-[1.85rem] lg:text-[2rem]'
              : 'text-[1.25rem] sm:text-2xl md:text-3xl xl:text-[2.1rem]',
            project.tileFeaturedLightTitle
              ? 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_14px_rgba(0,0,0,0.75)]'
              : 'text-mk-text [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_2px_14px_rgba(255,255,255,0.65),0_2px_18px_rgba(0,0,0,0.12)]',
          )}
        >
          {project.title}
        </p>
        {project.tileAvailability ? (
          <div className={clsx('shrink-0', TILE_FOOTER_BADGE_PADDING)}>
            <TileAvailabilityPill status={project.tileAvailability} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Tile chips: tags first, then content tags, then VR/AR/3D immersion (always last). */
function TileBadgeRow({ project }: { project: HighlightProject }) {
  const badges = project.tileBadges ?? [];
  const isImmersion = (b: (typeof badges)[number]) => b === '3D' || b === 'VR' || b === 'AR';
  const contentBadges = badges.filter((b) => !isImmersion(b));
  const immersionBadges = badges.filter(isImmersion);

  return (
    <div className="pointer-events-none absolute left-1.5 top-1.5 right-1.5 z-20 flex flex-wrap items-center gap-1 sm:left-2 sm:top-2 sm:right-2">
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

function TileTitleOverlay({
  project,
  variant,
}: {
  project: HighlightProject;
  variant: 'featured' | 'prominent';
}) {
  const titleWords = project.title.trim().split(/\s+/);
  const [firstWord, ...restWords] = titleWords;
  const isProminent = variant === 'prominent';

  return (
    <div
      className={clsx(
        'pointer-events-none relative z-10 mt-auto',
        isProminent ? 'p-3 sm:p-3.5 md:p-4' : 'p-3 sm:p-4 md:p-5',
      )}
    >
      <div
        className={clsx(
          'brand-tight max-w-full text-left font-semibold leading-[1.06] tracking-tight',
          isProminent
            ? 'text-[1.2rem] sm:text-[1.65rem] md:text-[1.85rem] lg:text-[2rem]'
            : 'max-w-[18rem] text-[1.25rem] sm:text-2xl md:text-3xl xl:text-[2.1rem]',
          project.tileFeaturedLightTitle
            ? 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_14px_rgba(0,0,0,0.75)]'
            : 'text-mk-text [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_2px_14px_rgba(255,255,255,0.65),0_2px_18px_rgba(0,0,0,0.12)]',
        )}
      >
        <span className="block">{firstWord}</span>
        {restWords.length > 0 ? (
          <span
            className={clsx(
              'block pt-0.5 sm:pt-1',
              isProminent ? 'pl-4 sm:pl-6 md:pl-7' : 'pl-5 sm:pl-7',
            )}
          >
            {restWords.join(' ')}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function TileFace({
  project,
  registerTileRef,
  onPick,
  reduceMotion,
  preferStaticTileVideo,
}: {
  project: HighlightProject;
  registerTileRef: (id: HighlightProjectId, el: HTMLButtonElement | null) => void;
  onPick: (id: HighlightProjectId) => void;
  reduceMotion: boolean;
  preferStaticTileVideo: boolean;
}) {
  const isFeatured = project.span === 'featured';
  const showTileTitle = isFeatured || project.tileShowTitle;
  const showTitleWash =
    showTileTitle &&
    !project.tileHideFeaturedFade &&
    !project.tileFeaturedLightTitle;
  const titleVariant =
    isFeatured || project.tileTitleSize === 'featured' ? 'featured' : 'prominent';
  const inlineTitleWithAvailability =
    showTileTitle &&
    isFeatured &&
    project.tileFeaturedLightTitle &&
    Boolean(project.tileAvailability);

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
        {project.tileVideo ? (
          <ViewportAutoplayVideo
            src={project.tileVideo}
            poster={project.thumb}
            title={project.title}
            staticOnly={reduceMotion || preferStaticTileVideo}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : project.thumb ? (
          <img
            src={project.thumb}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_52%,rgba(0,122,255,0.06)_100%)]" />
        )}
        {showTitleWash ? (
          <div
            className={clsx(
              'absolute inset-0 bg-gradient-to-t to-transparent',
              isFeatured
                ? 'from-white/[0.6] via-white/[0.22]'
                : 'from-white/[0.72] via-white/[0.28]',
            )}
            aria-hidden
          />
        ) : null}
      </div>

      <TileBadgeRow project={project} />

      {project.tileAvailability && !inlineTitleWithAvailability ? (
        <TileAvailabilityBadge status={project.tileAvailability} />
      ) : null}

      {inlineTitleWithAvailability ? (
        <TileTitleWithAvailabilityRow project={project} variant={titleVariant} />
      ) : showTileTitle ? (
        <TileTitleOverlay project={project} variant={titleVariant} />
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
  tileCellClass,
  preferStaticTileVideo,
}: {
  project: HighlightProject;
  onPick: (id: HighlightProjectId) => void;
  reduceMotion: boolean;
  registerTileRef: (id: HighlightProjectId, el: HTMLButtonElement | null) => void;
  tileCellClass: (project: HighlightProject) => string;
  preferStaticTileVideo: boolean;
}) {
  return (
    <div className={clsx(tileCellClass(project), 'h-full')}>
      <TileFace
        project={project}
        registerTileRef={registerTileRef}
        onPick={onPick}
        reduceMotion={reduceMotion}
        preferStaticTileVideo={preferStaticTileVideo}
      />
    </div>
  );
}

/** Adapter: HighlightProject → Project for tool tiles without a case-study page. */
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
    thumbnail: h.gallery?.[0] ?? h.thumb,
    images: h.gallery,
    gallery: galleryMedia.length > 0 ? galleryMedia : undefined,
    explanation: `${(h.explanation?.trim() || h.description).trim()}\n\nMy role: ${h.role}`,
    ctaHref: h.toolExternalUrl,
    references: h.toolExternalUrl
      ? [{ url: h.toolExternalUrl, label: h.id === 'agata-journal' ? 'agatajournal.com' : 'Open Tool' }]
      : undefined,
  };
}

function SyntheticProjectView({
  highlight,
  onBack,
  backLabel,
}: {
  highlight: HighlightProject;
  onBack: () => void;
  backLabel: string;
}) {
  const project = React.useMemo(() => highlightAsProject(highlight), [highlight]);
  return (
    <div className="px-px">
      <PortfolioProjectModal project={project} onClose={onBack} variant="inline" backLabel={backLabel} />
    </div>
  );
}

export function HighlightBentoSection({
  visible = true,
  config = PRODUCTION_HIGHLIGHT_SECTION,
}: HighlightBentoSectionProps) {
  const router = useRouter();
  const [activeId, setActiveId] = React.useState<HighlightProjectId | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { limitContinuousEffects, preferStaticTileVideo } = useMobilePerformance();
  const tileRefs = React.useRef(new Map<HighlightProjectId, HTMLButtonElement>());
  const glow = HIGHLIGHT_GLOW_THEMES[config.glow];
  const backLabel = config.backLabel ?? 'Back to highlights';
  const useStaticGlow = reduceMotion || limitContinuousEffects;

  const registerTileRef = React.useCallback((id: HighlightProjectId, el: HTMLButtonElement | null) => {
    if (el) tileRefs.current.set(id, el);
    else tileRefs.current.delete(id);
  }, []);

  /** Case-study projects navigate immediately; Skyhaven / tools stay inline. */
  const onPick = React.useCallback(
    (id: HighlightProjectId) => {
      const project = highlightById(id);
      if (!project) return;
      if (project.detailMode === 'skyhaven') {
        setActiveId(id);
        return;
      }
      if (project.projectSlug) {
        router.push(`/project/${project.projectSlug}`);
        return;
      }
      setActiveId(id);
    },
    [router],
  );

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
    if (activeId !== null && !config.projects.some((p) => p.id === activeId)) setActiveId(null);
  }, [activeId, config.projects]);

  const spring = layoutSpring(reduceMotion);

  if (!visible) return null;

  const isActive = activeId !== null;
  const activeProject = activeId ? highlightById(activeId) : undefined;
  const fade = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.24, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <section
      id={config.id}
      className="overflow-x-clip pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 md:pt-16"
    >
      <div className={clsx('relative mx-auto max-w-7xl rounded-2xl p-px sm:rounded-3xl', glow.wrapperShadow)}>
        {!useStaticGlow ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 isolate overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <div className={glow.conicGradient} />
          </div>
        ) : (
          <div aria-hidden className={glow.reducedMotionBg} />
        )}
        <GlassPanel
          variant="heavy"
          padding="lg"
          rounded="2xl"
          className="relative z-[1] rounded-[calc(1rem-1px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:rounded-[calc(1.5rem-1px)] !p-5 sm:!p-6 lg:!p-8"
        >
          <motion.div layout={!limitContinuousEffects} transition={spring}>
            <AnimatePresence mode="wait" initial={false}>
              {!isActive ? (
                <motion.div
                  key={`${config.id}-grid`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.16 } }}
                  transition={fade}
                  className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,2.12fr)] lg:gap-10"
                >
                  <div className="flex flex-col gap-3 sm:gap-4 lg:sticky lg:top-28 lg:self-start">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
                      {config.eyebrow ?? 'Highlights'}
                    </span>
                    <h2
                      aria-label={config.sectionTitle}
                      className="brand-tight max-w-[min(100%,26rem)] text-[clamp(1.35rem,4.2vw,1.72rem)] font-semibold leading-[1] tracking-tight text-mk-text sm:text-[clamp(1.6rem,2.8vw,2rem)] sm:leading-[1.02] md:text-[clamp(2rem,2.4vw,2.35rem)] lg:text-[2.25rem]"
                    >
                      <span className="block">{config.headlineStairs[0]}</span>
                      <span className="block pl-[2rem] pt-[0.2em] sm:pl-[2.5rem] md:pl-[3rem] lg:pl-[3.25rem]">
                        {config.headlineStairs[1]}
                      </span>
                      <div className="flex flex-row flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pt-[0.2em] pl-[4rem] sm:pl-[5.25rem] md:pl-[6.25rem] lg:pl-[6.75rem]">
                        <span className="min-w-0">{config.headlineStairs[2]}</span>
                        <span className="shrink-0 text-[0.6875rem] font-medium tabular-nums tracking-normal text-mk-text sm:text-[0.8125rem] md:text-sm">
                          {config.subtitle}
                        </span>
                      </div>
                    </h2>
                    <div className="max-w-none space-y-2 text-[0.9375rem] leading-relaxed text-mk-text-secondary sm:max-w-md sm:text-[15px] sm:leading-relaxed lg:text-base">
                      <p>{config.bodyP1}</p>
                      <p>{config.bodyP2}</p>
                      {config.tryBuildLink ? (
                        <p>
                          <a
                            href={config.tryBuildLink.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-semibold text-system-blue underline decoration-system-blue/35 underline-offset-2 transition-colors hover:text-[#0077ED]"
                          >
                            {config.tryBuildLink.label}
                          </a>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className={clsx('grid gap-2.5 sm:gap-3 md:gap-5', config.gridClass)}>
                    {config.projects.map((project) => (
                      <BentoGridCell
                        key={project.id}
                        project={project}
                        onPick={onPick}
                        reduceMotion={reduceMotion}
                        registerTileRef={registerTileRef}
                        tileCellClass={config.tileCellClass}
                        preferStaticTileVideo={preferStaticTileVideo}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : activeProject ? (
                <motion.div
                  key={`${config.id}-detail-${activeProject.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.16 } }}
                  transition={fade}
                  className={clsx(
                    'rounded-xl bg-white text-left sm:rounded-2xl',
                    'border border-black/[0.06] shadow-[0_8px_32px_rgba(28,28,28,0.08)] ring-1 ring-black/[0.04]',
                  )}
                >
                  {activeProject.detailMode === 'skyhaven' ? (
                    <div className="px-px">
                      <SkyhavenHighlightDetail
                        highlight={activeProject}
                        onBack={onClose}
                        backLabel={backLabel}
                      />
                    </div>
                  ) : (
                    <SyntheticProjectView
                      highlight={activeProject}
                      onBack={onClose}
                      backLabel={backLabel}
                    />
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

export {
  AI_APP_DEV_HIGHLIGHT_SECTION,
  ARCHITECTURE_HIGHLIGHT_SECTION,
  MULTIKUNST_HIGHLIGHT_SECTION,
  PRODUCTION_HIGHLIGHT_SECTION,
  SKYHAVEN_HIGHLIGHT_SECTION,
};
