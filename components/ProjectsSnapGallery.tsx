'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FiltersBar } from './FiltersBar';
import { ProjectSlide } from './ProjectSlide';
import { Project, ProjectType } from '@/lib/types';

interface ProjectsSnapGalleryProps {
  visible: boolean;
}

export function ProjectsSnapGallery({ visible }: ProjectsSnapGalleryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ProjectType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle filter changes - reset to first item
  const handleTypeChange = useCallback((type: ProjectType | 'all') => {
    setSelectedType(type);
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTagChange = useCallback((tag: string) => {
    setSelectedTag(tag);
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Track current slide via scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const slideHeight = window.innerHeight;
      const index = Math.round(scrollTop / slideHeight);
      setCurrentIndex(Math.min(index, filteredProjects.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [filteredProjects.length]);

  if (!visible) return null;

  return (
    <div id="projects" className="relative">
      {/* Filters */}
      <FiltersBar
        types={typeFilters}
        tags={allTags}
        selectedType={selectedType}
        selectedTag={selectedTag}
        onTypeChange={handleTypeChange}
        onTagChange={handleTagChange}
        projectCount={filteredProjects.length}
        currentIndex={currentIndex}
      />

      {/* Snap scroll container */}
      <div
        ref={containerRef}
        className="snap-container"
        style={{ scrollBehavior: 'smooth' }}
      >
        {loading ? (
          <div className="snap-section flex items-center justify-center">
            <div className="text-mk-text-secondary">Loading projects...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="snap-section flex items-center justify-center">
            <div className="text-center">
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
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <ProjectSlide
              key={project.id}
              project={project}
              isActive={index === currentIndex}
            />
          ))
        )}
      </div>

      {/* Scroll indicator dots (side) */}
      {filteredProjects.length > 1 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
          {filteredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    top: index * window.innerHeight,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-accent-cyan scale-125'
                  : 'bg-[rgba(28,28,28,0.15)] hover:bg-[rgba(28,28,28,0.3)]'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
