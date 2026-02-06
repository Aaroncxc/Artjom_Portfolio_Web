'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectSlide } from './ProjectSlide';
import { Project3DPreview } from './Project3DPreview';
import { Project, ProjectType } from '@/lib/types';

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
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Touch swipe state
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/posts.json');
        const data = await response.json();
        setProjects(data.posts);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let result = projects;
    
    if (selectedType !== 'all') {
      result = result.filter(p => p.type === selectedType);
    }
    
    if (selectedTag !== 'all') {
      result = result.filter(p => p.tags.includes(selectedTag));
    }
    
    return result;
  }, [projects, selectedType, selectedTag]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [projects]);

  // Type filter options
  const typeFilters: { value: ProjectType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'html', label: 'Interactive' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Image' },
  ];

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

  // Navigate to next/previous project
  const navigateProject = useCallback((direction: 'prev' | 'next') => {
    if (selectedIndex === -1) return;
    
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % filteredProjects.length
      : (selectedIndex - 1 + filteredProjects.length) % filteredProjects.length;
    
    setSlideDirection(direction === 'next' ? 'right' : 'left');
    setSelectedProject(filteredProjects[newIndex]);
    setSelectedIndex(newIndex);
    setShowSwipeHint(false); // Hide hint after first navigation
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

  const typeIcons: Record<ProjectType, JSX.Element> = {
    html: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    video: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
    audio: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    image: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  if (!visible) return null;

  return (
    <div id="projects" className="relative min-h-screen pt-24 pb-8 px-6">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-mk-text">
          Projects
        </h2>
        <p className="text-mk-text-secondary text-lg max-w-2xl">
          A collection of interactive experiences, visual explorations, and sonic experiments.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleTypeChange(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="relative aspect-square cursor-pointer group overflow-hidden bg-[rgba(28,28,28,0.03)] rounded-sm md:rounded-lg"
                  onClick={() => openProject(project, index)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onMouseMove={(e) => project.model3dPath && handleTileMouseMove(e, project.id)}
                  onTouchStart={() => project.model3dPath && handleTileTouchStart(project.id)}
                  onTouchMove={(e) => project.model3dPath && handleTileTouchMove(e, project.id)}
                  onTouchEnd={() => project.model3dPath && handleTileTouchEnd()}
                >
                  {/* Video Preview for video projects - starts at 1 second */}
                  {project.type === 'video' && project.videoUrl && (
                    <video
                      src={`${project.videoUrl}#t=1`}
                      muted
                      loop
                      playsInline
                      autoPlay
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        if (video.currentTime < 1) {
                          video.currentTime = 1;
                        }
                      }}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Thumbnail - hide for 3D and video projects */}
                  {!project.model3dPath && project.type !== 'video' && (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {/* 3D Preview for projects with model3dPath - always visible */}
                  {project.model3dPath && (
                    <Project3DPreview
                      modelPath={project.model3dPath}
                      isHovered={hoveredProject === project.id}
                      mousePosition={mousePos[project.id] || { x: 0.5, y: 0.5 }}
                      rotationX={project.model3dRotationX}
                      materialColor={project.model3dMaterialColor}
                      offsetY={project.model3dOffsetY}
                    />
                  )}
                  
                  {/* Hover Overlay - always on top */}
                  <div className={`absolute inset-0 z-20 bg-gradient-to-t from-[rgba(28,28,28,0.8)] via-[rgba(28,28,28,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-medium text-sm md:text-base mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm line-clamp-2 hidden md:block">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Type Icon Badge */}
                  <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[rgba(255,255,255,0.9)] backdrop-blur-sm flex items-center justify-center text-mk-text opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    {typeIcons[project.type]}
                  </div>

                  {/* 3D Badge for models */}
                  {project.model3dPath && (
                    <div className="absolute top-3 left-12 z-20">
                      <span className="px-2 py-1 rounded-full bg-[rgba(99,102,241,0.9)] text-white text-[10px] font-medium uppercase tracking-wider">
                        3D
                      </span>
                    </div>
                  )}

                  {/* Artist Badge */}
                  {project.author && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2 py-1 rounded-full bg-[rgba(28,28,28,0.7)] backdrop-blur-sm text-white text-[10px] font-medium tracking-wide">
                        {project.author}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
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
            <div className="fixed inset-0 bg-[rgba(250,250,255,0.85)] backdrop-blur-md" />
            
            {/* Close Button */}
            <button
              onClick={() => { setSelectedProject(null); setSelectedIndex(-1); }}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="Close project"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Project Button - hidden on mobile */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateProject('prev'); }}
              className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-[60] w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg group"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6 text-mk-text group-hover:text-accent-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Project Button - hidden on mobile */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateProject('next'); }}
              className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[60] w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg group"
              aria-label="Next project"
            >
              <svg className="w-6 h-6 text-mk-text group-hover:text-accent-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Project Counter with Swipe Hint on mobile */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
              {/* Swipe hint - only on mobile, disappears after first swipe */}
              <AnimatePresence>
                {showSwipeHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan text-xs font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m-12 5h12m-12 5h12M4 7h.01M4 12h.01M4 17h.01" />
                    </svg>
                    Wischen zum Wechseln
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] shadow-lg">
                <span className="text-sm font-medium text-mk-text">
                  {selectedIndex + 1} / {filteredProjects.length}
                </span>
              </div>
            </div>

            {/* Modal Content with Slide Animation */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedProject.id}
                initial={{ 
                  opacity: 0, 
                  x: slideDirection === 'right' ? 100 : -100 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0 
                }}
                exit={{ 
                  opacity: 0, 
                  x: slideDirection === 'right' ? -100 : 100 
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[55] w-full max-w-7xl mx-auto my-4 md:my-16 px-4 md:px-24"
                onClick={(e) => e.stopPropagation()}
              >
                <ProjectSlide project={selectedProject} isActive={true} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
