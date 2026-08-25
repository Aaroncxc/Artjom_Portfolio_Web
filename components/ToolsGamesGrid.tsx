'use client';

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  type CSSProperties,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { CollapsibleSectionBar } from '@/components/CollapsibleSectionBar';
import { ViewportAutoplayVideo } from '@/components/ViewportAutoplayVideo';
import { toolMatchesPortfolioOwner } from '@/lib/portfolioOwnerFilter';
import { useMobilePerformance } from '@/lib/useMobilePerformance';
import { RichText } from '@/lib/formatRichText';
import { toolGridIdToCaseSlug } from '@/lib/toolProjects';
import {
  contentTagTintAt,
  liveChipClass,
  metaChipClass,
} from '@/lib/chipClasses';

interface ToolGame {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'game' | 'tool' | 'app';
  thumbnail: string;
  thumbnailVideo?: string;
  screenshots: string[];
  tags: string[];
  embeddable?: boolean;
  author?: string;
  tileOverlayTitle?: string;
  tileThumbnailScale?: number;
  modalTrailer?: string;
}

const toolsGamesData: ToolGame[] = [
  {
    id: 'coincraft',
    title: 'CoinCraft',
    description:
      'A colorful **match-3 puzzle game** with addictive gameplay mechanics. Combine coins, unlock **power-ups**, and climb the **leaderboards**!',
    url: 'https://coincraft-main.vercel.app',
    type: 'game',
    thumbnail: '/tools/coincraft-thumb.png',
    screenshots: ['/tools/coincraft-thumb.png'],
    tags: ['Multikunst', 'game', 'puzzle', 'interactive'],
    author: 'Artjom N.',
  },
  {
    id: 'occupied',
    title: 'Occupied VFX',
    description:
      '**Occupied** is a **browser-based visual effects engine** for **real-time creative expression**. Built with **WebGL2**, **Three.js**, and **GLSL**, it routes **videos**, **images**, **webcam feeds**, **audio**, and **3D models** through modular **GPU-powered effects**—made for **VJing**, **projection**, **music visuals**, **experimental media**, and **creative coding**, directly in the **browser** without a heavy setup. Started as a personal passion project and **shipped within one month**; since launch it has reached **40+ users** and keeps growing. A **real-time visual instrument** for artists, performers, and creative technologists.',
    url: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
    type: 'tool',
    thumbnail: '/tools/occupied/thumbnail.webp',
    thumbnailVideo: '/tools/occupied/tile-preview.mp4',
    modalTrailer: '/tools/occupied/trailer.mp4',
    screenshots: [
      '/tools/occupied/workspace.webp',
      '/tools/occupied/login.webp',
      '/tools/occupied/screen-2.webp',
      '/tools/occupied/screen-3.webp',
      '/tools/occupied/screen-4.webp',
      '/tools/occupied/screen-5.webp',
    ],
    tags: ['WebGL2', 'Three.js', 'GLSL', 'VJing', 'real-time', 'creative coding'],
    author: 'Artjom N.',
    tileOverlayTitle: 'Occupied VFX',
    tileThumbnailScale: 1.12,
  },
  {
    id: 'ryuk-pp',
    title: 'Ryuk PP',
    description:
      'A **pixel-art 2D platformer** built with **Godot**. Run, jump and collect bones while exploring **hand-crafted levels**. Use **WASD** or **arrow keys** to play!',
    url: '/tools/ryuk-pp/index.html',
    type: 'game',
    thumbnail: '/tools/ryuk-pp/thumbnail.png',
    screenshots: ['/tools/ryuk-pp/thumbnail.png'],
    tags: ['game', 'platformer', 'pixel-art', 'godot'],
    embeddable: true,
    author: 'oxxupe',
  },
  {
    id: 'dadb-course-overview',
    title: 'Course Overview Tool',
    description:
      "Internal **production-analytics dashboard** I coded in **Cursor** while leading the **DADB course production**. Project managers logged status into **Excel sheets**, and the tool synced them every day at **06:00** and **18:00** — so team, **stakeholders**, **shareholders** and the **CEO** could watch the entire **content pipeline** live: **courses**, **modules**, **team workloads**, **delays**, **completion rates** and weekly **KPIs**.",
    url: 'https://v0-image-analysis-taupe-beta.vercel.app',
    type: 'tool',
    thumbnail: '/tools/dadb-course-overview/thumbnail.jpg',
    screenshots: [
      '/tools/dadb-course-overview/course-1.jpg',
      '/tools/dadb-course-overview/course-2.jpg',
      '/tools/dadb-course-overview/course-3.jpg',
      '/tools/dadb-course-overview/course-4.jpg',
      '/tools/dadb-course-overview/course-5.jpg',
      '/tools/dadb-course-overview/course-6.jpg',
    ],
    tags: [
      'German Academy of Digital Education',
      'production',
      'dashboard',
      'cursor',
      'KPI',
      'DADB',
    ],
    author: 'Artjom N.',
    tileOverlayTitle: 'Course Overview Tool',
    tileThumbnailScale: 1.22,
  },
];

interface ToolsGamesGridProps {
  visible: boolean;
}

export function ToolsGamesGrid({ visible }: ToolsGamesGridProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { preferStaticTileVideo, isMobile } = useMobilePerformance();
  const [selectedType, setSelectedType] = useState<'all' | 'game' | 'tool' | 'app'>('all');

  const typeFilters: { value: 'all' | 'game' | 'tool' | 'app'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'game', label: 'Games' },
    { value: 'tool', label: 'Tools' },
    { value: 'app', label: 'Apps' },
  ];

  const toolsGamesForOwner = useMemo(
    () => toolsGamesData.filter(toolMatchesPortfolioOwner),
    [],
  );

  const filteredItems = useMemo(() => {
    return selectedType === 'all'
      ? toolsGamesForOwner
      : toolsGamesForOwner.filter((item) => item.type === selectedType);
  }, [toolsGamesForOwner, selectedType]);

  const openTool = useCallback(
    (tool: ToolGame) => {
      router.push(`/project/${toolGridIdToCaseSlug(tool.id)}`);
    },
    [router],
  );

  /** Legacy deep link `?tool=<id>#tools-games` → case study page. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const openToolFromUrl = () => {
      const url = new URL(window.location.href);
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'tools-games') setIsExpanded(true);

      const toolId = url.searchParams.get('tool')?.trim();
      if (!toolId) return;

      const tool = toolsGamesForOwner.find((t) => t.id === toolId);
      if (!tool) return;

      url.searchParams.delete('tool');
      const clean = `${url.pathname}${url.search}`;
      window.history.replaceState(null, '', clean);
      router.push(`/project/${toolGridIdToCaseSlug(tool.id)}`);
    };

    openToolFromUrl();
    window.addEventListener('popstate', openToolFromUrl);
    window.addEventListener('hashchange', openToolFromUrl);
    return () => {
      window.removeEventListener('popstate', openToolFromUrl);
      window.removeEventListener('hashchange', openToolFromUrl);
    };
  }, [toolsGamesForOwner, router]);

  const typeIcons: Record<'game' | 'tool' | 'app', JSX.Element> = {
    game: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tool: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    app: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  if (!visible) return null;

  return (
    <div
      id="tools-games"
      data-nav-key="tools-games"
      className={clsx(
        'relative px-4 sm:px-6',
        isExpanded ? 'pb-8 pt-8' : 'pb-3 pt-3',
      )}
    >
      <div className={clsx('mx-auto max-w-7xl', isExpanded ? 'mb-6 sm:mb-8' : 'mb-0')}>
        <CollapsibleSectionBar
          eyebrow="Playground"
          headlineStairs={['Tools', '& Games', 'Live builds']}
          description="**Interactive web tools** and **games** I've built and shipped — **playable demos**, **dashboards**, and **realtime experiments**."
          meta={
            toolsGamesForOwner.length > 0
              ? `${toolsGamesForOwner.length} item${toolsGamesForOwner.length === 1 ? '' : 's'} · tap to ${isExpanded ? 'collapse' : 'explore the playground'}`
              : undefined
          }
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((v) => !v)}
          ariaControls="tools-games-expandable"
          accent="purple"
          expandLabel="Show all tools and games"
          collapseLabel="Hide tools and games"
        />
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="tools-games-expandable"
            key="tools-games-expandable"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-auto mb-8 max-w-7xl">
              <div className="flex flex-wrap gap-2">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedType(filter.value)}
                    className={`min-h-[44px] rounded-full px-3 py-2.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                      selectedType === filter.value
                        ? 'border border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.15)] text-[rgb(99,102,241)]'
                        : 'border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.6)] text-mk-text-secondary hover:bg-[rgba(255,255,255,0.9)] hover:text-mk-text'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-7xl">
              <motion.div
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
                layout={!isMobile}
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout={!isMobile}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: isMobile ? 0.15 : 0.3, delay: isMobile ? 0 : index * 0.05 }}
                      className="relative cursor-pointer group overflow-hidden bg-[rgba(28,28,28,0.03)] rounded-xl border border-[rgba(28,28,28,0.08)] hover:border-[rgba(99,102,241,0.3)] transition-all duration-300"
                      onClick={() => openTool(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openTool(item);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open case study: ${item.title}`}
                    >
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-[rgba(20,184,166,0.1)]">
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(99,102,241,0.2)]">
                              <svg className="h-8 w-8 text-[rgb(99,102,241)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {item.type === 'game' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                )}
                              </svg>
                            </div>
                          </div>

                          <div
                            className={clsx(
                              'absolute inset-0 h-full w-full transition-transform duration-500 ease-out will-change-transform',
                              item.tileThumbnailScale && item.tileThumbnailScale > 1
                                ? 'origin-center [transform:scale(var(--tile-zoom))] group-hover:[transform:scale(calc(var(--tile-zoom)*1.065))]'
                                : 'group-hover:scale-105',
                            )}
                            style={
                              item.tileThumbnailScale && item.tileThumbnailScale > 1
                                ? ({ ['--tile-zoom' as string]: String(item.tileThumbnailScale) } as CSSProperties)
                                : undefined
                            }
                          >
                            {item.thumbnailVideo ? (
                              <ViewportAutoplayVideo
                                src={item.thumbnailVideo}
                                poster={item.thumbnail}
                                title={item.title}
                                staticOnly={preferStaticTileVideo || !isExpanded}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {item.tileOverlayTitle &&
                          (() => {
                            const words = item.tileOverlayTitle.trim().split(/\s+/);
                            const [first, ...rest] = words;
                            return (
                              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-start justify-end p-4 sm:justify-center sm:p-5 md:p-6">
                                <div className="brand-tight max-w-[min(100%,19rem)] text-left text-2xl font-semibold leading-[1.06] tracking-tight text-mk-text [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_2px_14px_rgba(255,255,255,0.65),0_2px_18px_rgba(0,0,0,0.12)] sm:max-w-[min(100%,26rem)] sm:text-3xl md:text-4xl lg:text-5xl">
                                  <span className="block">{first}</span>
                                  {rest.length > 0 ? (
                                    <span className="block pl-5 pt-0.5 sm:pl-8 sm:pt-1">{rest.join(' ')}</span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })()}

                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[rgba(28,28,28,0.9)] via-[rgba(28,28,28,0.3)] to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center md:inset-0">
                            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-base font-medium text-mk-text shadow-lg">
                              <span>View case study</span>
                              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.9)] text-mk-text shadow-lg backdrop-blur-sm md:h-10 md:w-10">
                          {typeIcons[item.type]}
                        </div>

                        <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
                          <span className={liveChipClass}>
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live
                          </span>
                          {item.author && (
                            <span className={metaChipClass}>
                              {/\s/.test(item.author) ? item.author : `@${item.author}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        <h3 className="brand-tight mb-2 line-clamp-1 text-xl font-semibold text-mk-text sm:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-base leading-relaxed text-mk-text-secondary sm:text-lg">
                          <RichText>{item.description}</RichText>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span key={tag} className={contentTagTintAt(i)}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24">
                  <p className="mb-4 text-mk-text-secondary">No items match your filter.</p>
                  <button onClick={() => setSelectedType('all')} className="glass-button">
                    Show all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
