'use client';

import { useState, useCallback, useEffect, useRef, useMemo, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { toolMatchesPortfolioOwner } from '@/lib/portfolioOwnerFilter';
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
}

// Static data for tools and games
const toolsGamesData: ToolGame[] = [
  {
    id: 'coincraft',
    title: 'CoinCraft',
    description: 'A colorful match-3 puzzle game with addictive gameplay mechanics. Combine coins, unlock power-ups, and climb the leaderboards!',
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
    id: 'occupiedvfx',
    title: 'OCCUPIEDVFX',
    description: 'Digital Art VFX showcase featuring stunning visual effects and motion graphics. Explore our collection of experimental visual works.',
    url: 'https://occupiedvfx-v3-30-01-2026-2c75.vercel.app',
    type: 'tool',
    thumbnail: '/tools/occupiedvfx-video.mp4',
    thumbnailVideo: '/tools/occupiedvfx-video.mp4',
    screenshots: [],
    tags: ['vfx', 'art', 'visual'],
    author: 'oxxupe',
  },
  {
    id: 'ryuk-pp',
    title: 'Ryuk PP',
    description: 'A pixel-art 2D platformer built with Godot. Run, jump and collect bones while exploring hand-crafted levels. Use WASD or arrow keys to play!',
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
      "Internal production-analytics dashboard I coded in Cursor while leading the DADB course production. Project managers logged status into Excel sheets, and the tool synced them every day at 06:00 and 18:00 — so team, stakeholders, shareholders and the CEO could watch the entire content pipeline live: courses, modules, team workloads, delays, completion rates and weekly KPIs.",
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
      '/tools/dadb-course-overview/team-1.jpg',
      '/tools/dadb-course-overview/team-2.jpg',
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
    
    const totalScreenshots = selectedTool.screenshots.length;
    if (totalScreenshots === 0) return;
    
    setCurrentScreenshot(prev => 
      direction === 'next' 
        ? (prev + 1) % totalScreenshots
        : (prev - 1 + totalScreenshots) % totalScreenshots
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
    <div id="tools-games" className="relative min-h-screen px-4 pb-12 pt-24 sm:px-6">
      {/* Section Header */}
      <div className="mx-auto mb-10 max-w-7xl sm:mb-14">
        <div className="max-w-3xl">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
            Playground
          </span>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-mk-text brand-tight leading-[1.05] sm:text-5xl lg:text-6xl">
            Tools & Games
          </h2>
          <p className="text-base leading-relaxed text-mk-text-secondary sm:text-lg">
            Interactive web experiences, games, and tools we've built. Click to explore them live.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                selectedType === filter.value
                  ? 'bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.5)] text-[rgb(99,102,241)]'
                  : 'bg-[rgba(255,255,255,0.6)] border border-[rgba(28,28,28,0.08)] text-mk-text-secondary hover:bg-[rgba(255,255,255,0.9)] hover:text-mk-text'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
                        <video
                          src={item.thumbnailVideo}
                          muted
                          loop
                          playsInline
                          autoPlay
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
                    {item.description}
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
            <p className="text-mk-text-secondary mb-4">No items match your filter.</p>
            <button
              onClick={() => setSelectedType('all')}
              className="glass-button"
            >
              Show all
            </button>
          </div>
        )}
      </div>

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
            <div className="fixed inset-0 bg-[rgba(250,250,255,0.9)] backdrop-blur-md" />
            
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
                {/* Media Preview - Embedded Game, Video, or Screenshot Carousel */}
                {selectedTool.embeddable ? (
                  <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src={selectedTool.url}
                      className="w-full h-full border-0"
                      title={selectedTool.title}
                      allow="autoplay; fullscreen; gamepad"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-[rgba(20,184,166,0.1)]">
                    {/* Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-[rgba(99,102,241,0.2)] flex items-center justify-center mx-auto mb-4">
                          {typeIcons[selectedTool.type]}
                        </div>
                        <p className="text-mk-text-muted text-sm">
                          {selectedTool.thumbnailVideo ? 'Video Preview' : `Screenshot ${currentScreenshot + 1}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Video Preview */}
                    {selectedTool.thumbnailVideo ? (
                      <video
                        src={selectedTool.thumbnailVideo}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {/* Screenshot Image */}
                        {selectedTool.screenshots[currentScreenshot] && (
                          <img
                            src={selectedTool.screenshots[currentScreenshot]}
                            alt={`${selectedTool.title} screenshot ${currentScreenshot + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}

                        {/* Screenshot Navigation */}
                        {selectedTool.screenshots.length > 1 && (
                          <>
                            <button
                              onClick={() => navigateScreenshot('prev')}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                            >
                              <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => navigateScreenshot('next')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                            >
                              <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            
                            {/* Screenshot Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {selectedTool.screenshots.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentScreenshot(i)}
                                  className={`w-3 h-3 rounded-full transition-all p-0 min-w-[24px] min-h-[24px] flex items-center justify-center ${
                                    i === currentScreenshot 
                                      ? 'bg-white w-6' 
                                      : 'bg-white/50 hover:bg-white/80'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
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
                    {selectedTool.description}
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
