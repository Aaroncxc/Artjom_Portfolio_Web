'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import { ProjectBoardAccordion } from './ProjectBoardAccordion';
import { Project, ProjectType } from '@/lib/types';

interface ProjectSlideProps {
  project: Project;
  isActive: boolean;
}

export function ProjectSlide({ project, isActive }: ProjectSlideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'toggle-enlarge') {
        setIsEnlarged(event.data.enlarged);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const typeIcons: Record<ProjectType, JSX.Element> = {
    html: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    video: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    audio: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    image: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  // Calculate container height based on width for 16:9 aspect ratio
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (mediaContainerRef.current) {
        const width = mediaContainerRef.current.offsetWidth;
        // 16:9 aspect ratio
        setContainerHeight(width * (9 / 16));
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const renderMedia = () => {
    switch (project.type) {
      case 'html':
        const targetHeight = isEnlarged 
          ? Math.min(window.innerHeight * 0.8, 800) 
          : (containerHeight || 400);
        
        return (
          <div 
            ref={mediaContainerRef}
            className="media-container w-full overflow-hidden rounded-2xl"
            style={{
              height: `${targetHeight}px`,
              transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <iframe
              ref={iframeRef}
              src={project.htmlPath || `/projects/${project.slug}/index.html`}
              className="w-full h-full border-0 rounded-2xl"
              title={project.title}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        );

      case 'video':
        return (
          <div className="media-container aspect-video w-full">
            <video
              src={project.videoUrl}
              controls
              poster={project.thumbnail}
              className="w-full h-full object-cover rounded-2xl"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'audio':
        return (
          <div className="media-container aspect-video w-full flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-2xl">
            {/* Animated gradient background - using CSS class */}
            <div className="absolute inset-0 audio-gradient-bg" />
            
            {/* Animated orbs */}
            <div className="absolute w-48 h-48 rounded-full opacity-30 orb-cyan" 
                 style={{ top: '-20%', left: '-10%' }} />
            <div className="absolute w-40 h-40 rounded-full opacity-30 orb-violet" 
                 style={{ bottom: '-15%', right: '-10%' }} />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-end justify-center gap-1 h-24 mb-8">
                {[...Array(32)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-accent-cyan to-accent-violet rounded-full"
                    animate={isPlaying ? {
                      height: [20, 40 + Math.random() * 40, 20],
                    } : { height: 20 }}
                    transition={{
                      duration: 0.4 + Math.random() * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
              
              <button
                onClick={toggleAudio}
                className="w-16 h-16 rounded-full bg-[rgba(28,28,28,0.08)] border border-[rgba(28,28,28,0.12)] flex items-center justify-center hover:bg-[rgba(28,28,28,0.12)] transition-colors text-[#1C1C1C]"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              
              <audio ref={audioRef} src={project.audioUrl} onEnded={() => setIsPlaying(false)} />
            </div>
          </div>
        );

      case 'image':
        const images = project.images || (project.thumbnail ? [project.thumbnail] : []);
        return (
          <div className="vignette aspect-video w-full rounded-2xl overflow-hidden">
            {images[0] && (
              <img
                src={images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="snap-section flex flex-col justify-center px-6 py-24 min-h-screen">
      <div className="max-w-7xl w-full mx-auto">
        <div
          style={{ 
            opacity: isActive ? 1 : 0.3,
            transition: 'opacity 0.5s ease',
          }}
        >
          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Info panel */}
            <div className="order-2 lg:order-1">
              <GlassPanel variant="default" padding="lg">
                {/* Type badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                    {typeIcons[project.type]}
                    <span className="capitalize">{project.type === 'html' ? 'Interactive' : project.type}</span>
                  </span>
                  <span className="text-xs text-mk-text-muted">
                    {formatDate(project.date)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4 text-mk-text">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-mk-text-secondary leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] text-mk-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author */}
                {project.author && (
                  <div className="pt-4 border-t border-[rgba(28,28,28,0.08)]">
                    <p className="text-sm text-mk-text-muted">
                      Created by <span className="text-mk-text">{project.author}</span>
                    </p>
                  </div>
                )}
              </GlassPanel>

              {/* Board / References Accordion */}
              <ProjectBoardAccordion slug={project.slug} />
            </div>

            {/* Media */}
            <div className="order-1 lg:order-2">
              {renderMedia()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
