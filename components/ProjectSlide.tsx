'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Listen for messages from iframe (for HTML projects)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'toggle-enlarge') {
        setIsEnlarged(event.data.enlarged);
        setInfoPanelOpen(!event.data.enlarged);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Toggle enlarge for video/media
  const toggleEnlarge = () => {
    setIsEnlarged(!isEnlarged);
    setInfoPanelOpen(isEnlarged); // When enlarging, close panel; when shrinking, open panel
  };

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

  // Reference for media container
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const renderMedia = () => {
    switch (project.type) {
      case 'html':
        return (
          <div 
            ref={mediaContainerRef}
            className={`media-container w-full overflow-hidden rounded-2xl relative group/html ${
              isEnlarged ? '' : 'h-full min-h-[350px]'
            }`}
            style={isEnlarged ? {
              height: `${Math.min(window.innerHeight * 0.7, 700)}px`,
              transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
            } : {
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
            {/* Enlarge Button - outside iframe for consistent control */}
            <button
              onClick={toggleEnlarge}
              className="absolute top-3 left-3 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover/html:opacity-100"
              aria-label={isEnlarged ? "Verkleinern" : "Vergrößern"}
            >
              {isEnlarged ? (
                <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9L4 4m0 0v4m0-4h4m6 0l5-5m0 0v4m0-4h-4m-6 11l-5 5m0 0v-4m0 4h4m6 0l5 5m0 0v-4m0 4h-4"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
              )}
            </button>
          </div>
        );

      case 'video':
        return (
          <div 
            className={`media-container w-full relative group/video rounded-2xl overflow-hidden bg-black/5 ${
              isEnlarged ? '' : 'h-full min-h-[350px]'
            }`}
            style={isEnlarged ? {
              height: `${Math.min(window.innerHeight * 0.7, 700)}px`,
              transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
            } : {
              transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <video
              ref={videoRef}
              src={project.videoUrl}
              controls
              poster={project.thumbnail}
              className="w-full h-full object-contain rounded-2xl"
            >
              Your browser does not support the video tag.
            </video>
            {/* Enlarge Button */}
            <button
              onClick={toggleEnlarge}
              className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover/video:opacity-100"
              aria-label={isEnlarged ? "Verkleinern" : "Vergrößern"}
            >
              {isEnlarged ? (
                <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9L4 4m0 0v4m0-4h4m6 0l5-5m0 0v4m0-4h-4m-6 11l-5 5m0 0v-4m0 4h4m6 0l5 5m0 0v-4m0 4h-4"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
              )}
            </button>
          </div>
        );

      case 'audio':
        return (
          <div className="media-container h-full min-h-[350px] w-full flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-2xl">
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
          <div className="vignette h-full min-h-[350px] w-full rounded-2xl overflow-hidden">
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
    <div className="snap-section flex flex-col justify-center px-6 py-8 lg:py-24 min-h-screen">
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          style={{ 
            opacity: isActive ? 1 : 0.3,
          }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main content - dynamic grid based on enlarged state */}
          <motion.div 
            className={`grid gap-6 lg:gap-8 ${
              isEnlarged 
                ? 'grid-cols-1 items-start' 
                : 'lg:grid-cols-2 items-stretch'
            }`}
            layout
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Media - full width when enlarged */}
            <motion.div 
              className={isEnlarged ? 'order-1' : 'order-1 lg:order-2 h-full'}
              layout
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              {renderMedia()}
            </motion.div>

            {/* Info panel - collapsible */}
            <motion.div 
              className={isEnlarged ? 'order-2' : 'order-2 lg:order-1'}
              layout
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Collapsible Info Panel Header */}
              <motion.div
                layout
                className="overflow-hidden"
              >
                <button
                  onClick={() => setInfoPanelOpen(!infoPanelOpen)}
                  className={`w-full text-left transition-all duration-300 ${
                    isEnlarged ? 'cursor-pointer' : 'cursor-default pointer-events-none'
                  }`}
                >
                  <GlassPanel variant="default" padding={infoPanelOpen ? "lg" : "md"}>
                    {/* Header row - always visible */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                          {typeIcons[project.type]}
                          <span className="capitalize">{project.type === 'html' ? 'Interactive' : project.type}</span>
                        </span>
                        <span className="text-xs text-mk-text-muted">
                          {formatDate(project.date)}
                        </span>
                      </div>
                      {isEnlarged && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-sm font-medium text-mk-text">{project.title}</span>
                          <svg 
                            className={`w-5 h-5 text-mk-text-muted transition-transform duration-300 ${infoPanelOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence initial={false}>
                      {infoPanelOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                          className="overflow-hidden"
                        >
                          {/* Title */}
                          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4 mt-6 text-mk-text">
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassPanel>
                </button>
              </motion.div>

              {/* Board / References Accordion - also animated */}
              <AnimatePresence>
                {infoPanelOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
                  >
                    <ProjectBoardAccordion slug={project.slug} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
