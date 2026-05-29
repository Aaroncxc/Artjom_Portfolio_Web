'use client';

import * as React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { RichParagraphs } from '@/lib/formatRichText';
import { buildHireMailto } from '@/lib/contact';
import {
  SKYHAVEN_ASSET_CATEGORIES,
  SKYHAVEN_ASSET_COUNT,
  SKYHAVEN_CODEX_PREVIEW_COUNT,
  skyhavenAssetBlurb,
  skyhavenAssetLabel,
  skyhavenAssetSrc,
  skyhavenCategoryPreviewAssets,
  type SkyhavenAssetCategory,
  type SkyhavenAssetCategoryId,
} from '@/lib/skyhavenAssets';
import type { HighlightProject } from '@/lib/highlightProjects';
import { SKYHAVEN_TILE_POSTER, SKYHAVEN_TILE_VIDEO } from '@/lib/skyhavenVideos';
import { ViewportAutoplayVideo } from '@/components/ViewportAutoplayVideo';
import { SkyhavenVideosPanel } from '@/components/highlights/SkyhavenVideosPanel';
import { metaChipClass } from '@/lib/chipClasses';

type TabId = 'private' | 'videos' | 'explanation';

const TABS: { id: TabId; label: string }[] = [
  { id: 'private', label: 'Private' },
  { id: 'videos', label: 'Videos' },
  { id: 'explanation', label: 'Description' },
];

interface SkyhavenHighlightDetailProps {
  highlight: HighlightProject;
  onBack: () => void;
  backLabel: string;
}

function AssetCard({ id, compact = false }: { id: string; compact?: boolean }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return null;

  const label = skyhavenAssetLabel(id);
  const blurb = skyhavenAssetBlurb(id);

  return (
    <article className="overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div
        className={clsx(
          'flex items-center justify-center px-3 py-4',
          compact ? 'min-h-[7.5rem] sm:min-h-[8rem]' : 'min-h-[10rem] px-4 py-5 sm:min-h-[11.5rem] sm:py-6',
        )}
      >
        <img
          src={skyhavenAssetSrc(id)}
          alt={label}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={clsx(
            'w-full object-contain',
            compact
              ? 'max-h-[5.75rem] max-w-full sm:max-h-[6.5rem]'
              : 'max-h-[8.5rem] max-w-[14rem] sm:max-h-[10rem] sm:max-w-[17rem]',
          )}
        />
      </div>
      <div className="border-t border-black/[0.06] px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
        <h4 className="text-sm font-semibold leading-tight text-mk-text">{label}</h4>
        <p className="mt-1.5 text-xs leading-relaxed text-mk-text-secondary">{blurb}</p>
      </div>
    </article>
  );
}

function CategoryPreviewGrid({ cat, compact }: { cat: SkyhavenAssetCategory; compact?: boolean }) {
  const assets = skyhavenCategoryPreviewAssets(cat);

  return (
    <ul className="grid grid-cols-1 gap-2.5">
      {assets.map((id) => (
        <li key={id} className="min-w-0">
          <AssetCard id={id} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

function AssetCodex() {
  const [category, setCategory] = React.useState<SkyhavenAssetCategoryId | 'all'>('all');

  const activeCategory = React.useMemo(
    () => (category === 'all' ? null : SKYHAVEN_ASSET_CATEGORIES.find((c) => c.id === category)),
    [category],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={clsx(
            'rounded-full px-2.5 py-1 text-[10px] font-semibold transition sm:text-[11px]',
            category === 'all'
              ? 'bg-system-blue text-white shadow-sm'
              : 'border border-black/[0.08] bg-white text-mk-text-secondary hover:text-mk-text',
          )}
        >
          Overview · {SKYHAVEN_CODEX_PREVIEW_COUNT}
        </button>
        {SKYHAVEN_ASSET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={clsx(
              'rounded-full px-2.5 py-1 text-[10px] font-semibold transition sm:text-[11px]',
              category === cat.id
                ? 'bg-system-blue text-white shadow-sm'
                : 'border border-black/[0.08] bg-white text-mk-text-secondary hover:text-mk-text',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mk-scroll max-h-[min(58vh,520px)] overflow-y-auto rounded-2xl border border-black/[0.06] bg-white/60 p-2 sm:p-2.5">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16 }}
          className="flex flex-col gap-4"
        >
          {activeCategory ? (
            <CategoryPreviewGrid cat={activeCategory} compact />
          ) : (
            SKYHAVEN_ASSET_CATEGORIES.map((cat) => (
              <section key={cat.id} className="flex flex-col gap-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mk-text-muted">
                  {cat.label}
                </h4>
                <CategoryPreviewGrid cat={cat} compact />
              </section>
            ))
          )}
        </motion.div>
      </div>

      <p className="text-xs leading-relaxed text-mk-text-muted">
        {SKYHAVEN_ASSET_COUNT} in-game 3D assets in total — two previews per category here; full set in the build.
      </p>
    </div>
  );
}

export function SkyhavenHighlightDetail({ highlight, onBack, backLabel }: SkyhavenHighlightDetailProps) {
  const backBtnRef = React.useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = React.useState<TabId>('private');
  const explanation =
    highlight.explanation?.trim() ||
    `${highlight.description}\n\nMy role: ${highlight.role}`;
  const hireHref = buildHireMailto(`Hire me — ${highlight.title}`);
  const heroVideo = highlight.tileVideo ?? SKYHAVEN_TILE_VIDEO;
  const heroStill = highlight.thumb ?? SKYHAVEN_TILE_POSTER;

  React.useEffect(() => {
    const t = window.setTimeout(() => backBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-none flex-col font-sans text-mk-text antialiased">
      <div className="flex flex-col overflow-visible rounded-[20px] border border-black/[0.10] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.08] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-5 md:py-3.5">
          <button
            ref={backBtnRef}
            type="button"
            onClick={onBack}
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

          <div
            className="inline-flex shrink-0 rounded-[9px] bg-[rgba(118,118,128,0.12)] p-0.5"
            role="tablist"
            aria-label="Project information"
          >
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'inline-flex min-w-[5.125rem] items-center justify-center rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-[color,background,box-shadow] duration-175 sm:min-w-[6.75rem] sm:px-4 sm:text-sm',
                    isActive
                      ? 'bg-white text-mk-text shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                      : 'text-mk-text-secondary hover:text-mk-text',
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col px-2 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3.5">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'private' ? (
              <motion.div
                key="private"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
                  <div className="flex flex-col gap-3">
                    <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-[#0d1117] ring-1 ring-black/[0.08]">
                      <div className="relative aspect-video w-full">
                        <ViewportAutoplayVideo
                          src={heroVideo}
                          poster={heroStill}
                          title={highlight.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-mk-text-secondary md:text-[15px]">
                      {highlight.description}
                    </p>
                    {highlight.toolExternalUrl ? (
                      <p>
                        <a
                          href={highlight.toolExternalUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm font-semibold text-system-blue underline decoration-system-blue/35 underline-offset-2 transition-colors hover:text-[#0077ED] md:text-[15px]"
                        >
                          Try v0.2.0 on GitHub Releases
                        </a>
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-1.5">
                      {highlight.tools.map((t) => (
                        <span key={t} className={metaChipClass}>
                          {t}
                        </span>
                      ))}
                      <span className={metaChipClass}>{highlight.year}</span>
                      <span className={metaChipClass}>Solo · Side project</span>
                    </div>
                  </div>

                  <div className="min-w-0 lg:sticky lg:top-0">
                    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-mk-text-muted">
                      Asset codex
                    </h3>
                    <AssetCodex />
                  </div>
                </div>

                <div className="flex justify-end">
                  <a
                    href={hireHref}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-system-blue px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0077ED] sm:h-16 sm:min-w-[152px]"
                  >
                    Hire Me !
                  </a>
                </div>
              </motion.div>
            ) : activeTab === 'videos' ? (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-5"
              >
                <SkyhavenVideosPanel hireHref={hireHref} />
              </motion.div>
            ) : (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-6"
              >
                <div className="space-y-3">
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-mk-text-muted">
                    Description
                  </span>
                  <h2 className="brand-tight text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.06] tracking-tight text-mk-text">
                    {highlight.title}
                  </h2>
                </div>
                <RichParagraphs
                  text={explanation}
                  className="max-w-3xl space-y-5"
                  paragraphClassName="text-base font-normal leading-relaxed text-mk-text-secondary md:text-lg"
                />
                <div className="flex justify-end">
                  <a
                    href={hireHref}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-system-blue px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0077ED] sm:h-16 sm:min-w-[152px]"
                  >
                    Hire Me !
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
