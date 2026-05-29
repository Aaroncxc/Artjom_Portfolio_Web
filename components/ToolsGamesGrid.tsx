'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { CollapsibleSectionBar } from '@/components/CollapsibleSectionBar';
import { ViewportAutoplayVideo } from '@/components/ViewportAutoplayVideo';
import { toolMatchesPortfolioOwner } from '@/lib/portfolioOwnerFilter';
import { useMobilePerformance } from '@/lib/useMobilePerformance';
import { RichText } from '@/lib/formatRichText';
import {
  contentTagTintAt,
  liveChipClass,
  metaChipClass,
  toolModalTypeChipClass,
} from '@/lib/chipClasses';

interface ToolGame {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'game' | 'tool' | 'app';
  thumbnail: string;
  thumbnailVideo?: string; // Optional video for thumbnail preview
  screenshots: string[];
  tags: string[];
  embeddable?: boolean; // If true, embed as iframe in detail view instead of external link
  author?: string; // Creator handle
  /** Big brand-tight “staircase” overlay on the tile only (first word, then indented rest — no box). */
  tileOverlayTitle?: string;
  /** >1 zooms the tile image (object-cover + scale) to hide letterboxing / gray gaps; clips inside 16:9. */
  tileThumbnailScale?: number;
  /** Optional trailer in the detail modal — first carousel slide (before screenshots). */
  modalTrailer?: string;
}

function toolModalSlideCount(tool: ToolGame): number {
  return (tool.modalTrailer ? 1 : 0) + tool.screenshots.length;
}

/** Shared dark media shell — rounded inset frame like Occupied VFX detail view. */
function ToolModalMediaShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full bg-[#0d0e11]">
      <div className="relative mx-auto aspect-video w-full min-h-[200px] max-h-[min(52vh,440px)] sm:max-h-[min(58vh,520px)]">
        {children}
      </div>
    </div>
  );
}

function ToolModalMediaFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        'absolute inset-x-2 top-2 bottom-9 sm:inset-x-4 sm:top-3.5 sm:bottom-11',
        'overflow-visible rounded-xl sm:rounded-2xl',
      )}
    >
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-[#050607]',
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] sm:rounded-2xl',
        )}
      />
      <div className="relative z-[1] h-full w-full">{children}</div>
    </div>
  );
}

/** Inset screenshot/video card — rounded corners + drop shadow (all tool slides). */
function ToolModalMediaSlide({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
      <div
        className={clsx(
          'max-h-full max-w-full overflow-hidden rounded-[10px] sm:rounded-xl',
          'shadow-[0_14px_44px_rgba(0,0,0,0.55),0_4px_14px_rgba(0,0,0,0.4)]',
          'ring-1 ring-white/[0.08]',
        )}
      >
        {children}
      </div>
    </div>
  );
}

const toolModalMediaClass =
  'block h-auto max-h-[min(40vh,360px)] w-auto max-w-full object-contain sm:max-h-[min(46vh,420px)]';

function ToolModalEmbedPanel({ tool }: { tool: ToolGame }) {
  return (
    <ToolModalMediaShell>
      <ToolModalMediaFrame>
        <ToolModalMediaSlide>
          <iframe
            src={tool.url}
            className="aspect-video w-[min(100%,720px)] max-w-full border-0"
            title={tool.title}
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
          />
        </ToolModalMediaSlide>
      </ToolModalMediaFrame>
    </ToolModalMediaShell>
  );
}

function ToolModalCarouselPanel({
  tool,
  currentScreenshot,
  onScreenshotChange,
  onNavigateScreenshot,
  fallbackIcon,
  allowVideoAutoplay = true,
}: {
  tool: ToolGame;
  currentScreenshot: number;
  onScreenshotChange: (index: number) => void;
  onNavigateScreenshot: (direction: 'prev' | 'next') => void;
  fallbackIcon: ReactNode;
  /** Off on mobile — user taps play; saves decode/battery. */
  allowVideoAutoplay?: boolean;
}) {
  const slideCount = toolModalSlideCount(tool);
  const hasTrailer = Boolean(tool.modalTrailer);
  const isTrailerSlide = hasTrailer && currentScreenshot === 0;
  const screenshotIndex = hasTrailer ? currentScreenshot - 1 : currentScreenshot;
  const activeScreenshot = tool.screenshots[screenshotIndex];
  const videoOnly =
    Boolean(tool.thumbnailVideo) && tool.screenshots.length === 0 && !tool.modalTrailer;
  const hasVisibleMedia = videoOnly || isTrailerSlide || Boolean(activeScreenshot);

  return (
    <ToolModalMediaShell>
      <ToolModalMediaFrame>
        {!hasVisibleMedia ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0b0d]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] text-mk-text-muted">
              {fallbackIcon}
            </div>
          </div>
        ) : null}

        {videoOnly ? (
          <ToolModalMediaSlide>
            <video
              src={tool.thumbnailVideo}
              controls
              autoPlay={allowVideoAutoplay}
              muted
              loop
              playsInline
              preload={allowVideoAutoplay ? 'metadata' : 'none'}
              className={toolModalMediaClass}
            />
          </ToolModalMediaSlide>
        ) : isTrailerSlide ? (
          <ToolModalMediaSlide>
            <video
              key="modal-trailer"
              src={tool.modalTrailer}
              controls
              autoPlay={allowVideoAutoplay}
              playsInline
              preload={allowVideoAutoplay ? 'metadata' : 'none'}
              className={toolModalMediaClass}
            />
          </ToolModalMediaSlide>
        ) : activeScreenshot ? (
          <ToolModalMediaSlide>
            <img
              key={activeScreenshot}
              src={activeScreenshot}
              alt={`${tool.title} screenshot ${screenshotIndex + 1}`}
              className={toolModalMediaClass}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </ToolModalMediaSlide>
        ) : null}
      </ToolModalMediaFrame>

      {slideCount > 1 ? (
        <>
          <button
            type="button"
            onClick={() => onNavigateScreenshot('prev')}
            aria-label="Previous slide"
            className="absolute left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.06] bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:left-3 sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4 text-mk-text sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onNavigateScreenshot('next')}
            aria-label="Next slide"
            className="absolute right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.06] bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:right-3 sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4 text-mk-text sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <motion.div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-3.5 sm:gap-2">
            {Array.from({ length: slideCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onScreenshotChange(i)}
                aria-label={hasTrailer && i === 0 ? 'Trailer' : `Screenshot ${hasTrailer ? i : i + 1}`}
                className={clsx(
                  'flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full p-0 transition-all sm:min-h-[24px] sm:min-w-[24px]',
                  i === currentScreenshot
                    ? 'w-5 bg-white sm:w-6'
                    : 'h-2 w-2 bg-white/45 hover:bg-white/75 sm:h-3 sm:w-3',
                )}
              />
            ))}
          </motion.div>
        </>
      ) : null}
    </ToolModalMediaShell>
  );
}

// Static data for tools and games
const toolsGamesData: ToolGame[] = [
  {
    id: 'coincraft',
    title: 'CoinCraft',
    description:
      'A colorful **match-3 puzzle game** with addictive gameplay mechanics. Combine coins, unlock **power-ups**, and climb the **leaderboards**!',
    url: 'https://coincraft-main.vercel.app',
    type: 'game',
    thumbnail: '/tools/coincraft-thumb.png',
    screenshots: [
      '/tools/coincraft-thumb.png',
    ],
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
    screenshots: [
      '/tools/ryuk-pp/thumbnail.png',
    ],
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
  const [isExpanded, setIsExpanded] = useState(false);
  const { preferStaticTileVideo, isMobile, limitContinuousEffects } = useMobilePerformance();
  const [selectedTool, setSelectedTool] = useState<ToolGame | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [currentScreenshot, setCurrentScreenshot] = useState<number>(0);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'game' | 'tool' | 'app'>('all');

  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!selectedTool) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedTool]);

  // Touch swipe state for mobile navigation
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const typeFilters: { value: 'all' | 'game' | 'tool' | 'app'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'game', label: 'Games' },
    { value: 'tool', label: 'Tools' },
    { value: 'app', label: 'Apps' },
  ];

  const toolsGamesForOwner = useMemo(
    () => toolsGamesData.filter(toolMatchesPortfolioOwner),
    []
  );

  const filteredItems = useMemo(() => {
    return selectedType === 'all'
      ? toolsGamesForOwner
      : toolsGamesForOwner.filter((item) => item.type === selectedType);
  }, [toolsGamesForOwner, selectedType]);

  const openTool = useCallback((tool: ToolGame, index: number) => {
    setSelectedTool(tool);
    setSelectedIndex(index);
    setCurrentScreenshot(0);
  }, []);

  /** Deep link: `?tool=<id>#tools-games` (e.g. from About → Course Overview Tool). */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const openToolFromUrl = () => {
      const url = new URL(window.location.href);
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'tools-games') setIsExpanded(true);

      const toolId = url.searchParams.get('tool')?.trim();
      if (!toolId || hash !== 'tools-games') return;

      const tool = toolsGamesForOwner.find((t) => t.id === toolId);
      if (!tool) return;

      setIsExpanded(true);
      setSelectedType('all');
      const index = toolsGamesForOwner.findIndex((t) => t.id === toolId);
      openTool(tool, index >= 0 ? index : 0);
    };

    openToolFromUrl();
    window.addEventListener('popstate', openToolFromUrl);
    window.addEventListener('hashchange', openToolFromUrl);
    return () => {
      window.removeEventListener('popstate', openToolFromUrl);
      window.removeEventListener('hashchange', openToolFromUrl);
    };
  }, [toolsGamesForOwner, openTool]);

  const navigateTool = useCallback((direction: 'prev' | 'next') => {
    if (selectedIndex === -1) return;
    
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % filteredItems.length
      : (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    
    setSelectedTool(filteredItems[newIndex]);
    setSelectedIndex(newIndex);
    setCurrentScreenshot(0);
  }, [selectedIndex, filteredItems]);

  const navigateScreenshot = useCallback((direction: 'prev' | 'next') => {
    if (!selectedTool) return;

    const total = toolModalSlideCount(selectedTool);
    if (total === 0) return;

    setCurrentScreenshot((prev) =>
      direction === 'next' ? (prev + 1) % total : (prev - 1 + total) % total,
    );
  }, [selectedTool]);

  // Touch swipe handlers for mobile modal navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        navigateTool('next');
      } else {
        navigateTool('prev');
      }
    }
  }, [navigateTool]);

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
            {/* Filters */}
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

            {/* Grid */}
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
                onClick={() => openTool(item, index)}
                onMouseEnter={() => setHoveredTool(item.id)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                {/* Thumbnail Container - 16:9 aspect ratio */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-[rgba(20,184,166,0.1)]">
                  {/* Inner clip — zoom >1 hides letterboxing / gray side gutters */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Placeholder with icon if no thumbnail */}
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
                          : 'group-hover:scale-105'
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

                  {/* Staircase title on tile only (same rhythm as project stair headings; no glass box) */}
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

                  {/* Hover Overlay — visible by default on touch */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-[rgba(28,28,28,0.9)] via-[rgba(28,28,28,0.3)] to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                    <div className="absolute inset-x-0 bottom-3 flex items-center justify-center md:inset-0">
                      <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-base font-medium text-mk-text shadow-lg">
                        <span>View Details</span>
                        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.9)] text-mk-text shadow-lg backdrop-blur-sm md:h-10 md:w-10">
                    {typeIcons[item.type]}
                  </div>

                  {/* External Link Indicator + Author */}
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

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="brand-tight mb-2 line-clamp-1 text-xl font-semibold text-mk-text sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-base leading-relaxed text-mk-text-secondary sm:text-lg">
                    <RichText>{item.description}</RichText>
                  </p>

                  {/* Tags */}
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

              {/* Empty State */}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto touch-pan-y"
            onClick={() => { setSelectedTool(null); setSelectedIndex(-1); }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[rgba(250,250,255,0.92)] backdrop-blur-md md:backdrop-blur-md max-md:backdrop-blur-none" />
            
            {/* Close Button */}
            <button
              onClick={() => { setSelectedTool(null); setSelectedIndex(-1); }}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="Close"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateTool('prev'); }}
                  className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-[60] w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg group"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6 text-mk-text group-hover:text-[rgb(99,102,241)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateTool('next'); }}
                  className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[60] w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg group"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6 text-mk-text group-hover:text-[rgb(99,102,241)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-[55] mx-auto my-2 w-full max-w-4xl px-2 sm:my-8 sm:px-4"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[rgba(28,28,28,0.08)]">
                {selectedTool.embeddable ? (
                  <ToolModalEmbedPanel tool={selectedTool} />
                ) : (
                  <ToolModalCarouselPanel
                    tool={selectedTool}
                    currentScreenshot={currentScreenshot}
                    onScreenshotChange={setCurrentScreenshot}
                    onNavigateScreenshot={navigateScreenshot}
                    fallbackIcon={typeIcons[selectedTool.type]}
                    allowVideoAutoplay={!limitContinuousEffects}
                  />
                )}

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={toolModalTypeChipClass(selectedTool.type)}>{selectedTool.type}</span>
                      </div>
                      <h2 className="text-2xl font-semibold leading-tight text-mk-text brand-tight md:text-3xl">
                        {selectedTool.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-mk-text-secondary mb-6 leading-relaxed">
                    <RichText>{selectedTool.description}</RichText>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedTool.tags.map((tag, i) => (
                      <span key={tag} className={contentTagTintAt(i)}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {selectedTool.embeddable && (
                      <button
                        onClick={() => {
                          const iframe = document.querySelector<HTMLIFrameElement>(`iframe[title="${selectedTool.title}"]`);
                          if (iframe) {
                            if (iframe.requestFullscreen) {
                              iframe.requestFullscreen();
                            }
                          }
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[rgb(99,102,241)] to-[rgb(139,92,246)] text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
                      >
                        <span>Fullscreen</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                        </svg>
                      </button>
                    )}
                    <a
                      href={selectedTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg ${
                        selectedTool.embeddable
                          ? 'bg-[rgba(28,28,28,0.08)] text-mk-text border border-[rgba(28,28,28,0.1)]'
                          : 'bg-gradient-to-r from-[rgb(99,102,241)] to-[rgb(139,92,246)] text-white'
                      }`}
                    >
                      <span>{selectedTool.embeddable ? 'Open in New Tab' : `Open ${selectedTool.type === 'game' ? 'Game' : selectedTool.type === 'app' ? 'App' : 'Tool'}`}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Counter with swipe hint on mobile */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
              {filteredItems.length > 1 && (
                <span className="text-xs text-mk-text-muted md:hidden">Swipe to navigate</span>
              )}
              <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] shadow-lg">
                <span className="text-sm font-medium text-mk-text">
                  {selectedIndex + 1} / {filteredItems.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
