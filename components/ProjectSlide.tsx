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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Autoplay video when opening/switching to video project (muted for browser policy)
  useEffect(() => {
    if (project.type === 'video' && videoRef.current) {
      if (isActive) {
        videoRef.current.muted = true; // required for autoplay
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [project.type, project.id, isActive]);

  // Toggle fullscreen for media container
  const toggleFullscreen = (element: HTMLElement | null) => {
    if (!element) return;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
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
            className="media-container w-full overflow-hidden rounded-2xl relative h-full min-h-[350px] group/html bg-black"
          >
            <iframe
              ref={iframeRef}
              src={project.htmlPath || `/projects/${project.slug}/index.html`}
              className="w-full h-full border-0 rounded-2xl"
              title={project.title}
              sandbox="allow-scripts allow-same-origin"
            />
            {/* Fullscreen Button - always visible for mobile */}
            <button
              onClick={() => toggleFullscreen(mediaContainerRef.current)}
              className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
              aria-label={isFullscreen ? "Vollbild beenden" : "Vollbild"}
            >
              {isFullscreen ? (
                // Exit fullscreen icon - arrows pointing inward
                <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/>
                </svg>
              ) : (
                // Enter fullscreen icon - arrows pointing outward
                <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                </svg>
              )}
            </button>
          </div>
        );

      case 'video':
        return (
          <div 
            className="media-container w-full relative group/video rounded-2xl overflow-hidden bg-black h-full min-h-[350px]"
          >
            <video
              ref={videoRef}
              src={project.videoUrl}
              controls
              poster={project.thumbnail}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain rounded-2xl"
            >
              Your browser does not support the video tag.
            </video>
            {/* Fullscreen Button - always visible for mobile */}
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
              aria-label="Vollbild"
            >
              <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
              </svg>
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

  // Special layout for video projects - horizontal info bar + centered video
  if (project.type === 'video') {
    return (
      <div className="snap-section flex flex-col justify-center px-6 py-8 lg:py-16 min-h-screen">
        <div className="max-w-5xl w-full mx-auto">
          <motion.div
            style={{ opacity: isActive ? 1 : 0.3 }}
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {/* Horizontal Info Bar */}
            <GlassPanel variant="default" padding="md" className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left side - Type, Date, Title */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                    {typeIcons[project.type]}
                    <span className="capitalize">Video</span>
                  </span>
                  <span className="text-xs text-mk-text-muted">
                    {formatDate(project.date)}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-mk-text">
                    {project.title}
                  </h2>
                </div>
                
                {/* Right side - Author and Tags */}
                <div className="flex items-center gap-3 flex-wrap">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] text-mk-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.author && (
                    <span className="text-xs text-mk-text-muted">
                      by <span className="text-mk-text">{project.author}</span>
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description - collapsible on mobile */}
              <p className="text-mk-text-secondary text-sm leading-relaxed mt-3 hidden md:block">
                {project.description}
              </p>
            </GlassPanel>

            {/* Video Player - same width as info box */}
            <div 
              className="w-full relative group/video rounded-2xl overflow-hidden bg-black/5"
              style={{
                aspectRatio: '16/9',
              }}
            >
              <video
                ref={videoRef}
                src={project.videoUrl}
                controls
                poster={project.thumbnail}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain rounded-2xl"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* 3D Viewer - same size as video, only for projects with htmlPath */}
            {project.htmlPath && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-mk-text mb-4">3D Modell</h3>
                <div 
                  className="w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
                  style={{
                    aspectRatio: '16/9',
                  }}
                >
                  <iframe
                    src={project.htmlPath}
                    className="w-full h-full border-0"
                    title={`${project.title} - 3D Viewer`}
                    allow="fullscreen"
                  />
                </div>
              </div>
            )}

            {/* Gallery - additional media */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-mk-text mb-4">Weitere Ansichten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.map((media, index) => (
                    <div 
                      key={index}
                      className="relative rounded-2xl overflow-hidden bg-black/5 group"
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          controls
                          autoPlay
                          muted
                          playsInline
                          loop
                          className="w-full h-full object-contain"
                          style={{ aspectRatio: '16/9' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={media.src}
                          alt={media.title || `Gallery image ${index + 1}`}
                          className="w-full h-auto object-contain"
                        />
                      )}
                      {media.title && (
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-medium">{media.title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Board / References Accordion - same width as info box */}
            <div className="mt-6">
              <ProjectBoardAccordion slug={project.slug} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Layout for HTML/3D projects - similar to video but with side-by-side boxes
  if (project.type === 'html') {
    return (
      <div className="snap-section flex flex-col justify-center px-6 py-8 lg:py-16 min-h-screen">
        <div className="max-w-6xl w-full mx-auto">
          <motion.div
            style={{ opacity: isActive ? 1 : 0.3 }}
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {/* Two equal columns: Info and 3D */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              {/* Info Panel */}
              <GlassPanel variant="default" padding="lg" className="h-full">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                    {typeIcons[project.type]}
                    <span className="capitalize">Interactive</span>
                  </span>
                  <span className="text-xs text-mk-text-muted">
                    {formatDate(project.date)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3 text-mk-text">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-mk-text-secondary text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] text-mk-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author */}
                {project.author && (
                  <div className="pt-3 border-t border-[rgba(28,28,28,0.08)]">
                    <p className="text-sm text-mk-text-muted">
                      Created by <span className="text-mk-text">{project.author}</span>
                    </p>
                  </div>
                )}
              </GlassPanel>

              {/* 3D/Interactive Preview */}
              <div className="h-full min-h-[350px] lg:min-h-[400px]">
                {renderMedia()}
              </div>
            </div>

            {/* Gallery - additional media for HTML projects */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-mk-text mb-4">Renders</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.gallery.map((media, index) => (
                    <div 
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden border border-[rgba(28,28,28,0.1)] group cursor-pointer hover:border-[rgba(28,28,28,0.25)] transition-colors"
                      onClick={() => media.type === 'image' && setLightboxImage(media.src)}
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          controls
                          autoPlay
                          muted
                          playsInline
                          loop
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={media.src}
                          alt={media.title || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {media.title && (
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium">{media.title}</span>
                        </div>
                      )}
                      {/* Zoom icon overlay */}
                      {media.type === 'image' && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-3 h-3 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
              {lightboxImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                  onClick={() => setLightboxImage(null)}
                >
                  <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    src={lightboxImage}
                    alt="Enlarged view"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    onClick={() => setLightboxImage(null)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Board / References - Full Width */}
            <ProjectBoardAccordion slug={project.slug} />
          </motion.div>
        </div>
      </div>
    );
  }

  // Layout for image projects - similar to video with gallery support
  if (project.type === 'image') {
    const mainImage = project.images?.[0] || project.thumbnail;
    return (
      <div className="snap-section flex flex-col justify-center px-6 py-8 lg:py-16 min-h-screen">
        <div className="max-w-5xl w-full mx-auto">
          <motion.div
            style={{ opacity: isActive ? 1 : 0.3 }}
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {/* Horizontal Info Bar */}
            <GlassPanel variant="default" padding="md" className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left side - Type, Date, Title */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                    {typeIcons[project.type]}
                    <span className="capitalize">Image</span>
                  </span>
                  <span className="text-xs text-mk-text-muted">
                    {formatDate(project.date)}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-mk-text">
                    {project.title}
                  </h2>
                </div>
                
                {/* Right side - Author and Tags */}
                <div className="flex items-center gap-3 flex-wrap">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] text-mk-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.author && (
                    <span className="text-xs text-mk-text-muted">
                      by <span className="text-mk-text">{project.author}</span>
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-mk-text-secondary text-sm leading-relaxed mt-3 hidden md:block">
                {project.description}
              </p>
            </GlassPanel>

            {/* Main Image */}
            {mainImage && (
              <div className="w-full relative rounded-2xl overflow-hidden bg-black/5 mb-6">
                <img
                  src={mainImage}
                  alt={project.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Gallery - additional images */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-mk-text mb-4">Weitere Ansichten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.map((media, index) => (
                    <div 
                      key={index}
                      className="relative rounded-2xl overflow-hidden bg-black/5 group"
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          controls
                          autoPlay
                          muted
                          playsInline
                          loop
                          className="w-full h-full object-contain"
                          style={{ aspectRatio: '16/9' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={media.src}
                          alt={media.title || `Gallery image ${index + 1}`}
                          className="w-full h-auto object-contain"
                        />
                      )}
                      {media.title && (
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-medium">{media.title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Board / References Accordion */}
            <div className="mt-6">
              <ProjectBoardAccordion slug={project.slug} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Default layout for other project types (audio)
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
          {/* Main content - 2 column grid, always same layout */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-stretch">
            {/* Media */}
            <div className="order-1 lg:order-2 h-full">
              {renderMedia()}
            </div>

            {/* Info panel */}
            <div className="order-2 lg:order-1">
              <GlassPanel variant="default" padding="lg">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                    {typeIcons[project.type]}
                    <span className="capitalize">{project.type}</span>
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
              <div className="mt-6">
                <ProjectBoardAccordion slug={project.slug} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
