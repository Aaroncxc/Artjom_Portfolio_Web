'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { PortfolioProjectModal } from './portfolio/PortfolioProjectModal';
import { Project3DPreview } from './Project3DPreview';
import { Project, ProjectType } from '@/lib/types';
import { projectMatchesPortfolioOwner } from '@/lib/portfolioOwnerFilter';
import {
  chipLearningExperienceClass,
  chipTileImmersionClass,
  metaChipClass,
} from '@/lib/chipClasses';

const warmedVideoUrls = new Set<string>();
const warmedModelUrls = new Set<string>();

function warmVideoAsset(src?: string) {
  if (!src || warmedVideoUrls.has(src) || typeof document === 'undefined') return;
  warmedVideoUrls.add(src);
  const probe = document.createElement('video');
  probe.preload = 'auto';
  probe.muted = true;
  probe.playsInline = true;
  probe.src = src;
  probe.load();
}

function warmModelAsset(src?: string) {
  if (!src || warmedModelUrls.has(src) || typeof window === 'undefined') return;
  warmedModelUrls.add(src);
  fetch(src, { cache: 'force-cache' }).catch(() => {
    /* best effort warmup */
  });
}

/** Only mounted while tile is hovered — plays preview video and fades itself in once playable. */
function HoverPlayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
    return () => {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      onCanPlay={() => setReady(true)}
      onLoadedData={() => setReady(true)}
      className={`${className ?? ''} transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`.trim()}
    />
  );
}

interface ProjectsGridProps {
  visible: boolean;
}

export function ProjectsGrid({ visible }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ProjectType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Record<string, { x: number; y: number }>>({});
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  // Touch swipe state
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/posts.json', { cache: 'no-store' });
        if (!response.ok) {
          console.error('Failed to load projects:', response.status, response.statusText);
          setProjects([]);
          return;
        }
        const data: unknown = await response.json();
        const rawPosts =
          data && typeof data === 'object' && 'posts' in data
            ? (data as { posts?: unknown }).posts
            : data;
        const list = Array.isArray(rawPosts) ? rawPosts : [];
        setProjects(list as Project[]);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const portfolioOwnerProjects = useMemo(
    () => (Array.isArray(projects) ? projects : []).filter(projectMatchesPortfolioOwner),
    [projects]
  );

  // Filter projects (only listings attributed to Artjom / AaronCxC)
  const filteredProjects = useMemo(() => {
    let result = portfolioOwnerProjects;

    if (selectedType !== 'all') {
      result = result.filter((p) => p.type === selectedType);
    }

    if (selectedTag !== 'all') {
      result = result.filter((p) => (p.tags ?? []).includes(selectedTag));
    }

    return result;
  }, [portfolioOwnerProjects, selectedType, selectedTag]);

  // Get all unique tags from the owner-filtered set
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    portfolioOwnerProjects.forEach((p) =>
      (p.tags ?? []).forEach((t) => tagSet.add(t))
    );
    return Array.from(tagSet).sort();
  }, [portfolioOwnerProjects]);

  // Warm visible tile assets in idle time for snappier hover transitions.
  useEffect(() => {
    if (!visible || filteredProjects.length === 0) return;
    const warm = () => {
      filteredProjects.slice(0, 12).forEach((project) => {
        if (project.type === 'video' && project.videoUrl) warmVideoAsset(project.videoUrl);
        if (project.model3dPath && project.showTile3dHover !== false) warmModelAsset(project.model3dPath);
      });
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) {
      const id = ric(warm);
      return () => {
        if ((window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback) {
          (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
        }
      };
    }
    const timeoutId = window.setTimeout(warm, 200);
    return () => window.clearTimeout(timeoutId);
  }, [visible, filteredProjects]);

  // Type filter options
  const typeFilters: { value: ProjectType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'html', label: 'Interactive' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Image' },
  ];

  // Medium chip label per project type — kept in sync with `typeFilters`.
  const typeChipLabel: Record<ProjectType, string> = {
    html: 'Interactive',
    video: 'Video',
    audio: 'Audio',
    image: 'Image',
  };

  // Handle filter changes
  const handleTypeChange = useCallback((type: ProjectType | 'all') => {
    setSelectedType(type);
  }, []);

  const handleTagChange = useCallback((tag: string) => {
    setSelectedTag(tag);
  }, []);

  // Navigate to project and set index
  const openProject = useCallback((project: Project, index: number) => {
    setSelectedProject(project);
    setSelectedIndex(index);
  }, []);

  // Listen for external open-project events (e.g. from in-page links)
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail?.slug;
      if (!slug) return;
      const idx = filteredProjects.findIndex((p) => p.slug === slug);
      if (idx >= 0) openProject(filteredProjects[idx], idx);
    };
    window.addEventListener('open-project', handler);
    return () => window.removeEventListener('open-project', handler);
  }, [filteredProjects, openProject]);

  // Navigate to next/previous project
  const navigateProject = useCallback((direction: 'prev' | 'next') => {
    if (selectedIndex === -1 || filteredProjects.length === 0) return;

    const newIndex = direction === 'next'
      ? (selectedIndex + 1) % filteredProjects.length
      : (selectedIndex - 1 + filteredProjects.length) % filteredProjects.length;
    
    setSlideDirection(direction === 'next' ? 'right' : 'left');
    setSelectedProject(filteredProjects[newIndex]);
    setSelectedIndex(newIndex);
  }, [selectedIndex, filteredProjects]);

  // Touch swipe handlers for mobile navigation
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
        // Swiped left -> next
        navigateProject('next');
      } else {
        // Swiped right -> prev
        navigateProject('prev');
      }
    }
  }, [navigateProject]);

  // Handle mouse move on tile for 3D rotation
  const handleTileMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, projectId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos(prev => ({ ...prev, [projectId]: { x, y } }));
  }, []);

  // Handle touch move on tile for 3D rotation (mobile)
  const handleTileTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>, projectId: string) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      setMousePos(prev => ({ ...prev, [projectId]: { x, y } }));
      setHoveredProject(projectId);
    }
  }, []);

  const handleTileTouchStart = useCallback((projectId: string) => {
    setHoveredProject(projectId);
  }, []);

  const handleProjectHoverStart = useCallback((project: Project) => {
    setHoveredProject(project.id);
    if (project.type === 'video' && project.videoUrl) warmVideoAsset(project.videoUrl);
    if (project.model3dPath && project.showTile3dHover !== false) warmModelAsset(project.model3dPath);
  }, []);

  const handleTileTouchEnd = useCallback(() => {
    // Small delay to allow effect to be visible before hover ends
    setTimeout(() => {
      setHoveredProject(null);
    }, 300);
  }, []);

  // Close modal on escape, arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setSelectedIndex(-1);
      } else if (e.key === 'ArrowRight' && selectedProject) {
        navigateProject('next');
      } else if (e.key === 'ArrowLeft' && selectedProject) {
        navigateProject('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, navigateProject]);

  // Lock body scroll and hide navigation when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-modal-open');
    };
  }, [selectedProject]);

  if (!visible) return null;

  return (
    <div id="projects" className="relative min-h-screen scroll-mt-20 px-4 pb-12 pt-8 sm:scroll-mt-[5.5rem] sm:px-6 sm:pt-10 md:scroll-mt-24 md:pt-12">
      {/* Section Header */}
      <div className="mx-auto mb-8 max-w-7xl sm:mb-10">
        <div className="max-w-3xl">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
            Portfolio
          </span>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-mk-text brand-tight leading-[1.05] sm:text-5xl lg:text-6xl">
            Projects
          </h2>
          <p className="text-base leading-relaxed text-mk-text-secondary sm:text-lg">
            A collection of interactive experiences, visual explorations, and sonic experiments.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleTypeChange(filter.value)}
              className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                selectedType === filter.value
                  ? 'bg-[rgba(20,184,166,0.15)] border border-accent-cyan text-accent-cyan'
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
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-mk-text-secondary">Loading projects...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-mk-text-secondary mb-4">No projects match your filters.</p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedTag('all');
              }}
              className="glass-button"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                /** When false (`showTile3dHover`), tile behaves like plain video/thumbnail hover even if modal has a separate 3D asset. */
                const tileUses3dHover = Boolean(project.model3dPath && project.showTile3dHover !== false);
                const modalOnly3dBadge =
                  Boolean(project.model3dPath?.trim()) &&
                  project.showTile3dHover === false;
                const grayRenderOnly3dBadge = project.tile3dBadge === true && !project.model3dPath?.trim();
                const showTile3dChip =
                  tileUses3dHover || modalOnly3dBadge || grayRenderOnly3dBadge;
                const normalizedTags = (project.tags ?? []).map((t) => t.trim().toUpperCase());
                const showVrChip = normalizedTags.includes('VR');
                const showArChip = normalizedTags.includes('AR');
                const tileContentTags = new Set(['LEARNING EXPERIENCE']);
                const contentTagChips = (project.tags ?? []).filter((tag) =>
                  tileContentTags.has(tag.trim().toUpperCase()),
                );
                return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="relative aspect-square cursor-pointer group overflow-hidden bg-[rgba(28,28,28,0.03)] rounded-sm md:rounded-lg"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${project.title}`}
                  onClick={() => openProject(project, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openProject(project, index);
                    }
                  }}
                  onMouseEnter={() => handleProjectHoverStart(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onMouseMove={(e) => tileUses3dHover && handleTileMouseMove(e, project.id)}
                  onTouchStart={() => {
                    if (tileUses3dHover) handleTileTouchStart(project.id);
                    handleProjectHoverStart(project);
                  }}
                  onTouchMove={(e) => tileUses3dHover && handleTileTouchMove(e, project.id)}
                  onTouchEnd={() => tileUses3dHover && handleTileTouchEnd()}
                >
                  {/* Video hover when no interactive 3D on the tile (or 3D is modal-only via showTile3dHover:false) */}
                  {project.type === 'video' && project.videoUrl && !tileUses3dHover && (
                    <>
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 z-[1] bg-[rgba(28,28,28,0.08)]" aria-hidden />
                      )}
                      {hoveredProject === project.id && (
                        <HoverPlayVideo
                          src={project.videoUrl}
                          className="absolute inset-0 z-[2] h-full w-full object-cover group-hover:scale-105"
                        />
                      )}
                    </>
                  )}

                  {/* Thumbnail - non-video, non-tile-3D projects */}
                  {!tileUses3dHover && project.type !== 'video' && (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {/* 3D on tile hover when enabled */}
                  {tileUses3dHover && project.model3dPath && (
                    <>
                      {project.thumbnail && (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      {hoveredProject === project.id && (
                        <Project3DPreview
                          modelPath={project.model3dPath}
                          isHovered={true}
                          mousePosition={mousePos[project.id] || { x: 0.5, y: 0.5 }}
                          rotationX={project.model3dRotationX}
                          materialColor={project.model3dMaterialColor}
                          offsetY={project.model3dOffsetY}
                          fallbackPoster={project.thumbnail}
                          animationProgress={project.model3dAnimationProgress}
                        />
                      )}
                    </>
                  )}
                  
                  {/* Tag chips: medium, tools, optional 3D — replaces hover text + author/type/3D badges */}
                  {/*
                    On mobile (<sm) the tile is ~50vw so we hide tool-name chips
                    and only keep the type chip + immersion chips + the green
                    Learning-Experience pill so the artwork is not buried.
                  */}
                  <div className="pointer-events-none absolute left-1.5 top-1.5 right-1.5 z-20 flex flex-wrap gap-1 sm:left-2 sm:top-2 sm:right-2">
                    <span className={metaChipClass}>{typeChipLabel[project.type]}</span>
                    {project.tools?.map((tool) => (
                      <span key={tool.name} className={clsx(metaChipClass, 'hidden sm:inline-flex')}>
                        {tool.name}
                      </span>
                    ))}
                    {contentTagChips.map((tag) => (
                      <span key={tag} className={chipLearningExperienceClass}>
                        {tag}
                      </span>
                    ))}
                    {showArChip && <span className={chipTileImmersionClass}>AR</span>}
                    {showTile3dChip && (
                      <span className={chipTileImmersionClass}>3D</span>
                    )}
                    {showVrChip && <span className={chipTileImmersionClass}>VR</span>}
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto touch-pan-y"
            onClick={() => { setSelectedProject(null); setSelectedIndex(-1); }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/25 backdrop-blur-md" aria-hidden />

            {/* Previous Project Button - hidden on mobile */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateProject('prev'); }}
              className="group fixed left-6 top-1/2 z-[60] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.08] bg-white/92 text-[#3C3C43] shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md transition-[background,box-shadow,color] hover:bg-white hover:text-[#1D1D1F] hover:shadow-md md:flex"
              aria-label="Previous project"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Project Button - hidden on mobile */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateProject('next'); }}
              className="group fixed right-6 top-1/2 z-[60] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.08] bg-white/92 text-[#3C3C43] shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md transition-[background,box-shadow,color] hover:bg-white hover:text-[#1D1D1F] hover:shadow-md md:flex"
              aria-label="Next project"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Project counter — desktop only (mobile uses swipe + arrow buttons hidden, so no counter overlay). */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] hidden md:block">
              <div className="rounded-full border border-black/[0.08] bg-white/92 px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] text-[#48484A] shadow-[0_2px_10px_rgba(0,0,0,0.06)] backdrop-blur-md">
                {selectedIndex + 1} / {filteredProjects.length}
              </div>
            </div>

            {/* Modal Content with Slide Animation */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedProject.id}
                initial={{
                  opacity: 0,
                  x: slideDirection === 'right' ? 100 : -100,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: slideDirection === 'right' ? -100 : 100,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[55] mx-auto my-2 w-full max-w-[min(92rem,calc(100vw-1.5rem))] px-2 sm:my-10 sm:px-4 md:my-14 md:px-12 lg:px-16 xl:px-20"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                <PortfolioProjectModal
                  project={selectedProject}
                  onClose={() => {
                    setSelectedProject(null);
                    setSelectedIndex(-1);
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
