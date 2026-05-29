'use client';

import clsx from 'clsx';
import { RichParagraphs, RichText, stripBoldMarkers } from '@/lib/formatRichText';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project, ProjectReference, ProjectTool } from '@/lib/types';
import { buildHireMailto } from '@/lib/contact';
import {
  applyMediaGroupAssignment,
  buildModalAssets,
  ProjectMediaCanvas,
  ProjectMediaThumbs,
  type ModalAsset,
} from './ProjectMediaCanvas';
import { getProjectMediaGroupsConfig } from '@/lib/projectMediaGroups';
import { MediaGalleryLightbox } from '../projectSlide/LightboxModal';
import { useHorizontalSwipe } from '@/lib/useHorizontalSwipe';

type TabId = 'private' | 'explanation';

export type PortfolioProjectModalVariant = 'modal' | 'inline';

interface PortfolioProjectModalProps {
  project: Project;
  slideKey?: string;
  onClose?: () => void;
  /** Embedded in Highlight bento — fixed height parent, scroll inside; back control instead of ×. */
  variant?: PortfolioProjectModalVariant;
  /** Inline variant back button label (defaults to “Back to highlights”). */
  backLabel?: string;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'private', label: 'Private' },
  { id: 'explanation', label: 'Description' },
];

/** `yyyy-mm` or full ISO — stable local calendar month/year for display */
function formatProjectMonthYear(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = m[3] ? Number(m[3]) : 1;
  if (!Number.isFinite(y) || mo < 1 || mo > 12) return null;
  const d = new Date(y, mo - 1, day);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(d);
}

function ToolboxRow({ tools }: { tools: ProjectTool[] }) {
  if (!tools.length) return null;
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
        Toolbox
      </p>
      <ul className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <li
            key={t.name}
            className={clsx(
              'inline-flex max-w-full items-center gap-2 rounded-full border border-black/[0.08]',
              'bg-white/90 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
            )}
          >
            {t.icon ? (
              <img
                src={t.icon}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] shrink-0 object-contain"
              />
            ) : (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mk-text-muted" aria-hidden />
            )}
            <span className="text-xs font-semibold text-mk-text">{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReferencesRow({ references }: { references: ProjectReference[] }) {
  const list = references.filter((r) => r?.url?.trim());
  if (!list.length) return null;
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
        Reference
      </p>
      <ul className="flex flex-col gap-2">
        {list.map((r) => {
          let host = '';
          try {
            host = new URL(r.url).host.replace(/^www\./, '');
          } catch {
            /* keep host empty for malformed URLs */
          }
          return (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer noopener"
                className={clsx(
                  'inline-flex max-w-full items-center gap-2 rounded-full border border-black/[0.08]',
                  'bg-white/90 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
                  'transition-colors hover:bg-white'
                )}
              >
                <svg className="h-3.5 w-3.5 shrink-0 text-mk-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5M9 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5A2.25 2.25 0 0 0 6.75 19.5h10.5A2.25 2.25 0 0 0 19.5 17.25V15" />
                </svg>
                <span className="truncate text-xs font-semibold text-mk-text">
                  {r.label || host || r.url}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Date + toolbox + references — fills the info column visually without crowding body copy */
function ModalProjectFacts({ date, tools, references }: Pick<Project, 'date' | 'tools' | 'references'>) {
  const formatted = formatProjectMonthYear(date);
  const toolList = tools?.filter((t) => t?.name?.trim()) ?? [];
  const refList = references?.filter((r) => r?.url?.trim()) ?? [];
  if (!formatted && !toolList.length && !refList.length) return null;

  return (
    <section
      className={clsx(
        'space-y-4 rounded-2xl border border-black/[0.07]',
        'bg-[linear-gradient(180deg,rgba(28,28,28,0.03)_0%,rgba(255,255,255,0.72)_100%)]',
        'px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
      )}
      aria-label="Project facts"
    >
      {formatted && (
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
            Created
          </p>
          <time
            dateTime={date}
            className="text-lg font-semibold tabular-nums tracking-tight text-mk-text"
          >
            {formatted}
          </time>
        </div>
      )}
      <ToolboxRow tools={toolList} />
      <ReferencesRow references={refList} />
    </section>
  );
}

/** One–two sentences under the active medium; omitted when empty (no layout jump). */
function MediaCaption({ caption, plainText }: { caption?: string; plainText?: boolean }) {
  const text = caption?.trim();
  if (!text) return null;
  const display = plainText ? stripBoldMarkers(text) : text;
  return (
    <p className="min-h-0 px-0.5 text-sm leading-relaxed text-mk-text-secondary md:text-[15px] md:leading-[1.55]">
      {plainText ? display : <RichText>{display}</RichText>}
    </p>
  );
}

/** Title block — matches site headings (Arial / brand-tight rhythm). */
function StaircaseTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  const [first, ...rest] = words;
  return (
    <h2 className="brand-tight text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.06] tracking-tight text-mk-text">
      <span className="block">{first}</span>
      {rest.length > 0 ? (
        <span className="block pl-5 pt-1 sm:pl-8">{rest.join(' ')}</span>
      ) : null}
    </h2>
  );
}

export function PortfolioProjectModal({
  project,
  slideKey,
  onClose,
  variant = 'modal',
  backLabel = 'Back to highlights',
}: PortfolioProjectModalProps) {
  const inline = variant === 'inline';
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>('private');
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [lightboxAssetIndex, setLightboxAssetIndex] = useState<number | null>(null);
  /** Once the user opens Description we drop the attention dot on its tab button. */
  const [hasSeenExplanation, setHasSeenExplanation] = useState(false);

  useEffect(() => {
    if (!inline || !onClose) return;
    const t = window.setTimeout(() => backBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [inline, onClose, project.id]);

  const groupsConfig = useMemo(
    () => getProjectMediaGroupsConfig(project.slug),
    [project.slug],
  );
  const assets = useMemo<ModalAsset[]>(() => {
    const built = buildModalAssets(project);
    applyMediaGroupAssignment(built, groupsConfig);
    return built;
  }, [project, groupsConfig]);
  const activeAsset = assets[Math.min(activeAssetIndex, Math.max(assets.length - 1, 0))];


  const explanation = project.explanation?.trim() || project.description;
  const hireHref = project.ctaHref || buildHireMailto(`Hire me — ${project.title}`);

  const stepAsset = useCallback(
    (dir: 'prev' | 'next') => {
      if (assets.length <= 1) return;
      setActiveAssetIndex((i) =>
        dir === 'next' ? (i + 1) % assets.length : (i - 1 + assets.length) % assets.length,
      );
    },
    [assets.length],
  );

  const mediaSwipe = useHorizontalSwipe(
    () => stepAsset('next'),
    () => stepAsset('prev'),
    assets.length > 1 && activeTab === 'private',
  );

  const openGalleryAt = useCallback(
    (src: string) => {
      const idx = assets.findIndex((a) => a.src === src);
      if (idx < 0) return;
      const kind = assets[idx]?.kind;
      if (kind !== 'image' && kind !== 'video') return;
      setLightboxAssetIndex(idx);
      setActiveAssetIndex(idx);
    },
    [assets],
  );

  /**
   * Hire Me button — on mobile we render a full-width pill below the thumb strip
   * (matches the height of a thumb tile), on `sm:` and up we lock back to the
   * 152×64 box so it visually aligns with the grouped thumb tiles on desktop.
   */
  const hireButton = (
    <a
      href={hireHref}
      className={clsx(
        'inline-flex w-full items-center justify-center gap-2 rounded-[10px]',
        'h-14 sm:h-16',
        'sm:w-[152px] sm:shrink-0',
        'bg-system-blue text-sm font-semibold text-white',
        'shadow-sm transition-[transform,opacity,background-color] duration-200',
        'hover:bg-[#0077ED] active:bg-system-blue-pressed active:opacity-95',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue'
      )}
    >
      Hire Me !
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
      </svg>
    </a>
  );

  return (
    <div
      key={slideKey ?? project.id}
      className={clsx(
        'relative mx-auto w-full font-sans text-mk-text antialiased',
        inline ? 'flex h-full min-h-0 max-w-none flex-col' : 'max-w-7xl',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={clsx(
          'flex flex-col rounded-[20px]',
          inline ? 'overflow-visible' : 'overflow-hidden max-h-[calc(100dvh-0.5rem)]',
          'border border-black/[0.10]',
          'bg-white',
          'shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]',
        )}
      >
        {/* Header: back (inline) + segmented tabs + close (modal) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.08] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-5 md:py-3.5">
          {inline && onClose ? (
            <button
              ref={backBtnRef}
              type="button"
              onClick={onClose}
              aria-label={backLabel}
              className={clsx(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/92 px-2.5 py-2 text-xs font-semibold text-mk-text-secondary shadow-sm sm:px-3',
                'transition-colors hover:bg-white hover:text-mk-text',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
              )}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
              <span className="max-sm:hidden">{backLabel}</span>
              <span className="sm:hidden">Back</span>
            </button>
          ) : null}
          <div
            className="inline-flex shrink-0 rounded-[9px] bg-[rgba(118,118,128,0.12)] p-0.5"
            role="tablist"
            aria-label="Projektinformationen"
          >
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              const showAttentionDot =
                tab.id === 'explanation' && !isActive && !hasSeenExplanation;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'explanation') setHasSeenExplanation(true);
                  }}
                  className={clsx(
                    'relative inline-flex min-w-[5.125rem] items-center justify-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-[color,background,box-shadow] duration-175 sm:min-w-[6.75rem] sm:px-4 sm:text-sm',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
                    isActive
                      ? 'bg-white text-mk-text shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_1px_rgba(0,0,0,0.04)]'
                      : 'text-mk-text-secondary hover:text-mk-text'
                  )}
                >
                  <span>{tab.label}</span>
                  {showAttentionDot && (
                    <span
                      className="relative inline-flex h-1.5 w-1.5"
                      aria-label="More info available"
                    >
                      <span className="absolute inline-flex h-full w-full rounded-full bg-system-blue opacity-70 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-system-blue" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center shrink-0">
            {onClose && !inline && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Schließen"
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'text-mk-text-secondary transition-colors hover:bg-black/[0.06] active:bg-black/[0.08]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
                )}
              >
                <svg className="h-[17px] w-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Body — media + copy share one visual row (items-start: no stretch gap under thumbnails). */}
        <div
          className={clsx(
            'relative flex flex-1 flex-col px-2 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3.5',
            inline ? '' : 'overflow-y-auto lg:min-h-0 lg:overflow-hidden',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'private' ? (
              <motion.div
                key="private"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 lg:gap-8"
              >
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.68fr)_minmax(300px,1fr)] lg:items-start lg:gap-10 xl:gap-12">
                  <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2 lg:gap-3">
                    <div
                      className={clsx(
                        'relative w-full overflow-hidden rounded-xl sm:rounded-2xl lg:aspect-[16/10]',
                        'max-lg:aspect-[4/3] max-lg:min-h-[min(52dvh,380px)]',
                        'bg-[#F2F2F7] max-lg:bg-black',
                        'max-lg:p-0 p-1 sm:p-2 lg:p-2.5',
                        'ring-1 ring-black/[0.06] max-lg:ring-0',
                        'touch-pan-y select-none',
                      )}
                      onTouchStartCapture={mediaSwipe.onTouchStart}
                      onTouchEndCapture={mediaSwipe.onTouchEnd}
                    >
                      {activeAsset && (
                        <div className="h-full w-full overflow-hidden max-lg:rounded-none max-lg:bg-transparent max-lg:shadow-none rounded-[10px] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] sm:rounded-[12px]">
                          <ProjectMediaCanvas
                            asset={activeAsset}
                            projectTitle={project.title}
                            fillFrame
                            onImageZoom={openGalleryAt}
                            model3dRotationX={project.model3dRotationX}
                            model3dMaterialColor={project.model3dMaterialColor}
                            model3dOffsetY={project.model3dOffsetY}
                            model3dPoster={project.thumbnail}
                            model3dAnimationProgress={project.model3dAnimationProgress}
                          />
                        </div>
                      )}
                      {assets.length > 1 ? (
                        <p className="pointer-events-none absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-medium tracking-wide text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] lg:hidden">
                          Swipe for next media
                        </p>
                      ) : null}
                    </div>
                    <MediaCaption caption={activeAsset?.caption} plainText={inline} />

                    {assets.length > 1 ? (
                      <div className="lg:hidden">
                        <ProjectMediaThumbs
                          assets={assets}
                          activeIndex={activeAssetIndex}
                          onSelect={setActiveAssetIndex}
                          groupsConfig={groupsConfig}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:gap-6">
                    <div className="space-y-3">
                      <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-mk-text-muted">
                        Overview
                      </span>
                      <StaircaseTitle title={project.title} />
                    </div>

                    <ModalProjectFacts
                      date={project.date}
                      tools={project.tools}
                      references={project.references}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('explanation');
                        setHasSeenExplanation(true);
                      }}
                      className={clsx(
                        'group inline-flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.18em] text-system-blue',
                        'transition-opacity hover:opacity-80',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue'
                      )}
                    >
                      Read full story
                      <svg
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.25}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14m0 0l-6-6m6 6l-6 6"
                        />
                      </svg>
                    </button>

                  </div>
                </div>

                <div className="hidden flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 lg:flex">
                  <div className="min-w-0 sm:flex-1">
                    <ProjectMediaThumbs
                      assets={assets}
                      activeIndex={activeAssetIndex}
                      onSelect={setActiveAssetIndex}
                      groupsConfig={groupsConfig}
                    />
                  </div>
                  <div className="flex w-full justify-end sm:w-auto sm:shrink-0">{hireButton}</div>
                </div>

                <div className="flex justify-end lg:hidden">{hireButton}</div>
              </motion.div>
            ) : (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col gap-6 lg:min-h-0 lg:flex-1"
              >
                <div className="space-y-3">
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-mk-text-muted">
                    Description
                  </span>
                  <StaircaseTitle title={project.title} />
                </div>
                <div className="mk-scroll pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                  {inline ? (
                    <div className="max-w-3xl space-y-5 text-base font-normal leading-relaxed text-mk-text-secondary md:text-lg">
                      {stripBoldMarkers(explanation)
                        .split(/\n{2,}/)
                        .map((paragraph, i) => (
                          <p key={i}>{paragraph.replace(/\n/g, ' ')}</p>
                        ))}
                    </div>
                  ) : (
                    <RichParagraphs
                      text={explanation}
                      className="max-w-3xl space-y-5"
                      paragraphClassName="text-base font-normal leading-relaxed text-mk-text-secondary md:text-lg"
                    />
                  )}
                </div>
                <div className="flex w-full shrink-0 justify-end sm:w-auto">{hireButton}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MediaGalleryLightbox
        assets={assets}
        activeIndex={lightboxAssetIndex}
        onClose={() => setLightboxAssetIndex(null)}
        onNavigate={(index) => {
          setLightboxAssetIndex(index);
          setActiveAssetIndex(index);
        }}
        alt={project.title}
      />
    </div>
  );
}
