'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Project3DPreview } from './Project3DPreview';
import { CollapsibleSectionBar } from './CollapsibleSectionBar';
import { Project, ProjectType } from '@/lib/types';
import { projectMatchesPortfolioOwner } from '@/lib/portfolioOwnerFilter';
import { useMobilePerformance } from '@/lib/useMobilePerformance';
import { projectYear, sortProjectsForPortfolio } from '@/lib/caseStudy';
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
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile, isCoarsePointer } = useMobilePerformance();
  const [selectedType, setSelectedType] = useState<ProjectType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Record<string, { x: number; y: number }>>({});

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
    () =>
      sortProjectsForPortfolio(
        (Array.isArray(projects) ? projects : []).filter(projectMatchesPortfolioOwner),
      ),
    [projects],
  );

  // Filter projects (only listings attributed to Artjom / AaronCxC)
  const filteredProjects = useMemo(() => {
    let result = portfolioOwnerProjects;

    if (selectedType !== 'all') {
      result = result.filter((p) => p.type === selectedType);
    }

    if (selectedTag !== 'all') {
      const needle = selectedTag.toLowerCase();
      result = result.filter((p) =>
        (p.tags ?? []).some((t) => t.toLowerCase() === needle),
      );
    }

    return result;
  }, [portfolioOwnerProjects, selectedType, selectedTag]);

  /** Curated tag chips — recruiter-friendly subset of available tags. */
  const featuredTags = useMemo(() => {
    const preferred = [
      'Learning Experience',
      'VR',
      'AR',
      '3D',
      'architecture',
      'project management',
      'education',
      'product design',
      'interactive',
    ];
    return preferred.filter((tag) =>
      portfolioOwnerProjects.some((p) =>
        (p.tags ?? []).some((t) => t.toLowerCase() === tag.toLowerCase()),
      ),
    );
  }, [portfolioOwnerProjects]);

  // Warm visible tile assets in idle time — desktop only, avoids decode storms on phones.
  useEffect(() => {
    if (!visible || !isExpanded || isMobile || filteredProjects.length === 0) return;
    const warm = () => {
      filteredProjects.slice(0, 6).forEach((project) => {
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
  }, [visible, isExpanded, isMobile, filteredProjects]);

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

  /** Open dedicated case-study page (shareable URL). */
  const openProject = useCallback(
    (project: Project) => {
      router.push(`/project/${project.slug}`);
    },
    [router],
  );

  // Listen for external open-project events (e.g. from in-page links)
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail?.slug as string | undefined;
      if (!slug) return;
      router.push(`/project/${slug}`);
    };
    window.addEventListener('open-project', handler);
    return () => window.removeEventListener('open-project', handler);
  }, [router]);

  // Deep-link #projects — expand when user navigates here explicitly.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromHash = () => {
      if (window.location.hash === '#projects') setIsExpanded(true);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

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

  if (!visible) return null;

  return (
    <div
      id="projects"
      className={clsx(
        'relative scroll-mt-20 px-4 pt-8 sm:scroll-mt-[5.5rem] sm:px-6 sm:pt-10 md:scroll-mt-24 md:pt-12',
        isExpanded ? 'min-h-screen pb-12' : 'pb-3',
      )}
    >
      {/* Expand / collapse bar */}
      <div className={clsx('mx-auto max-w-7xl', isExpanded ? 'mb-6 sm:mb-8' : 'mb-0')}>
        <CollapsibleSectionBar
          eyebrow="Portfolio"
          headlineStairs={['Project', 'Archive', '2020 — today']}
          description="A **curated selection** of my chosen work — **interactive experiences**, **film**, **3D**, **education**, and **architecture projects** from **2020 to today**."
          meta={
            !loading && portfolioOwnerProjects.length > 0
              ? `${portfolioOwnerProjects.length} project${portfolioOwnerProjects.length === 1 ? '' : 's'} · tap to ${isExpanded ? 'collapse' : 'browse the full grid'}`
              : undefined
          }
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((v) => !v)}
          ariaControls="projects-expandable"
          accent="cyan"
          expandLabel="Show all projects"
          collapseLabel="Hide projects"
        />
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="projects-expandable"
            key="projects-expandable"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            {/* Filters */}
            <div className="mx-auto mb-8 max-w-7xl space-y-3">
              <div className="flex flex-wrap gap-2">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleTypeChange(filter.value)}
                    className={`min-h-[44px] rounded-full px-3 py-2.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                      selectedType === filter.value
                        ? 'border border-accent-cyan bg-[rgba(20,184,166,0.15)] text-accent-cyan'
                        : 'border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.6)] text-mk-text-secondary hover:bg-[rgba(255,255,255,0.9)] hover:text-mk-text'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {featuredTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTagChange('all')}
                    className={`min-h-[40px] rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                      selectedTag === 'all'
                        ? 'border border-mk-text bg-mk-text text-white'
                        : 'border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.6)] text-mk-text-secondary hover:bg-[rgba(255,255,255,0.9)]'
                    }`}
                  >
                    All topics
                  </button>
                  {featuredTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagChange(tag)}
                      className={`min-h-[40px] rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                        selectedTag.toLowerCase() === tag.toLowerCase()
                          ? 'border border-accent-cyan bg-[rgba(20,184,166,0.15)] text-accent-cyan'
                          : 'border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.6)] text-mk-text-secondary hover:bg-[rgba(255,255,255,0.9)]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Grid */}
            <div className="mx-auto max-w-7xl">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="text-mk-text-secondary">Loading projects...</div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <p className="mb-4 text-mk-text-secondary">No projects match your filters.</p>
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
                <motion.div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-2 lg:grid-cols-4" layout={!isMobile}>
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => {
                /** When false (`showTile3dHover`), tile behaves like plain video/thumbnail hover even if modal has a separate 3D asset. */
                const tileUses3dHover =
                  Boolean(project.model3dPath && project.showTile3dHover !== false) && !isCoarsePointer;
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
                  layout={!isMobile}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: isMobile ? 0.15 : 0.3, delay: isMobile ? 0 : index * 0.03 }}
                  className="relative aspect-square cursor-pointer group overflow-hidden bg-[rgba(28,28,28,0.03)] rounded-sm md:rounded-lg"
                  role="link"
                  tabIndex={0}
                  aria-label={`Open case study: ${project.title}`}
                  onClick={() => openProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openProject(project);
                    }
                  }}
                  onMouseEnter={() => !isCoarsePointer && handleProjectHoverStart(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onMouseMove={(e) => tileUses3dHover && handleTileMouseMove(e, project.id)}
                  onTouchStart={() => {
                    if (tileUses3dHover) handleTileTouchStart(project.id);
                    if (!isCoarsePointer) handleProjectHoverStart(project);
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
                      {hoveredProject === project.id && !isCoarsePointer && (
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
                  
                  {project.tileOverlayTitle &&
                    (() => {
                      const words = project.tileOverlayTitle.trim().split(/\s+/);
                      const [first, ...rest] = words;
                      return (
                        <div className="pointer-events-none absolute inset-0 z-[15] flex flex-col items-start justify-end p-3 sm:justify-center sm:p-4 md:p-5">
                          <div className="brand-tight max-w-[min(100%,19rem)] text-left text-xl font-semibold leading-[1.06] tracking-tight text-mk-text [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_2px_14px_rgba(255,255,255,0.65),0_2px_18px_rgba(0,0,0,0.12)] sm:max-w-[min(100%,26rem)] sm:text-2xl md:text-3xl lg:text-4xl">
                            <span className="block">{first}</span>
                            {rest.length > 0 ? (
                              <span className="block pl-4 pt-0.5 sm:pl-6 sm:pt-1">{rest.join(' ')}</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })()}

                  {/* Bottom meta: role + year for recruiters scanning the grid */}
                  {(project.role || projectYear(project.date)) && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[18] bg-gradient-to-t from-black/55 via-black/25 to-transparent px-2 pb-2 pt-8 sm:px-2.5 sm:pb-2.5">
                      <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-white/90 sm:text-[11px]">
                        {[project.role, projectYear(project.date)].filter(Boolean).join(' · ')}
                      </p>
                      {!project.tileOverlayTitle ? (
                        <p className="mt-0.5 truncate text-xs font-semibold text-white sm:text-sm">
                          {project.title}
                        </p>
                      ) : null}
                    </div>
                  )}

                  {/* Tag chips: medium, tools, optional 3D — replaces hover text + author/type/3D badges */}
                  {/*
                    On mobile (<sm) the tile is ~50vw so we hide tool-name chips
                    and only keep the type chip + immersion chips + the green
                    Learning-Experience pill so the artwork is not buried.
                  */}
                  <div className="pointer-events-none absolute left-1.5 top-1.5 right-1.5 z-20 flex flex-wrap items-center gap-1 sm:left-2 sm:top-2 sm:right-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
