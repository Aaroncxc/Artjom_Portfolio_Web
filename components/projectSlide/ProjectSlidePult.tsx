'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../GlassPanel';
import { ProjectBoardAccordion } from '../ProjectBoardAccordion';
import { Project } from '@/lib/types';
import { formatDate, typeIcons } from './utils';
import { LightboxModal } from './LightboxModal';

interface ProjectSlidePultProps {
  project: Project;
  isActive: boolean;
}

export function ProjectSlidePult({ project, isActive }: ProjectSlidePultProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);
  const [pultAspectRatios, setPultAspectRatios] = useState<Record<string, number>>({});
  const [pultMediaDimensions, setPultMediaDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewer3DContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => setIs3DFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggle3DFullscreen = () => {
    const el = viewer3DContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const updatePultMediaMeta = (key: string, width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const ratio = width / height;
    setPultAspectRatios((current) => {
      const previous = current[key];
      if (typeof previous === 'number' && Math.abs(previous - ratio) < 0.001) return current;
      return { ...current, [key]: ratio };
    });
    setPultMediaDimensions((current) => {
      const previous = current[key];
      if (previous && previous.width === width && previous.height === height) return current;
      return { ...current, [key]: { width, height } };
    });
  };

  useEffect(() => {
    if (project.type === 'video' && videoRef.current) {
      if (isActive) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [project.type, project.id, isActive]);

  const pultMainVideoRatio = pultAspectRatios['pult-main-video'];

  return (
    <div className="snap-section flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-16 min-h-[100dvh] bg-[rgba(250,250,252,0.4)]">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div
          style={{ opacity: isActive ? 1 : 0.3 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 lg:gap-10"
        >
          {/* Infobox – volle Breite oben */}
          <GlassPanel variant="default" padding="lg" className="w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(28,28,28,0.06)] border border-[rgba(28,28,28,0.08)] text-mk-text-muted text-xs font-medium tracking-wide uppercase">
                {typeIcons[project.type]}
                <span>Video</span>
              </span>
              <span className="text-xs text-mk-text-muted">{formatDate(project.date)}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-mk-text mb-4">
              {project.title}
            </h2>
            <p className="text-mk-text-secondary text-[15px] leading-relaxed mb-5">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] text-mk-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.author && (
              <p className="text-sm text-mk-text-muted">
                by <span className="text-mk-text font-medium">{project.author}</span>
              </p>
            )}
          </GlassPanel>

          {/* Beide Videoboxen in einer Reihe nebeneinander */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 items-start">
            <div
              className="relative rounded-2xl overflow-hidden bg-black w-full shrink-0"
            style={{ aspectRatio: typeof pultMainVideoRatio === 'number' ? `${pultMainVideoRatio}` : '9/16' }}
          >
            <video
              ref={videoRef}
              src={project.videoUrl}
              controls
              poster={project.thumbnail}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
              onLoadedMetadata={(e) => updatePultMediaMeta('pult-main-video', e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
            />
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
            {(() => {
              const firstGalleryVideo = project.gallery?.find((m) => m.type === 'video');
              if (!firstGalleryVideo) return null;
              const galleryVideoIndex = project.gallery!.findIndex((m) => m.type === 'video');
              const ratioKey = `pult-gallery-${galleryVideoIndex}`;
              const ratio = pultAspectRatios[ratioKey];
              return (
                <div
                  className="relative rounded-2xl overflow-hidden bg-black/5 w-full shrink-0 isolate"
                  style={{ aspectRatio: typeof ratio === 'number' ? `${ratio}` : '16/9', minHeight: 160 }}
                >
                  <video
                    src={firstGalleryVideo.src}
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                    onLoadedMetadata={(e) => updatePultMediaMeta(ratioKey, e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
                    className="w-full h-full object-contain block"
                  />
                </div>
              );
            })()}
          </div>

          {/* 3D Viewer – Fullscreen wie Maske/Roboter, Grid/Licht in index.html */}
          {project.htmlPath && (
            <div
              ref={viewer3DContainerRef}
              className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#e8eaed] to-[#dce0e4] shadow-inner shrink-0 group/viewer"
              style={{ aspectRatio: '16/9', minHeight: 280 }}
            >
              <iframe
                src={project.htmlPath}
                className="w-full h-full border-0 block"
                title={`${project.title} - 3D`}
                allow="fullscreen"
              />
              <button
                type="button"
                onClick={toggle3DFullscreen}
                className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                aria-label={is3DFullscreen ? 'Vollbild beenden' : 'Vollbild'}
              >
                {is3DFullscreen ? (
                  <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Gallery – jedes Item in eigenem Slot (erstes Video bereits oben neben Hauptvideo) */}
          {project.gallery && project.gallery.length > 0 && (() => {
            const firstVideoIndex = project.gallery.findIndex((m) => m.type === 'video');
            const galleryItems = firstVideoIndex >= 0
              ? project.gallery.filter((_, i) => i !== firstVideoIndex)
              : project.gallery;
            if (galleryItems.length === 0) return null;
            return (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-mk-text-muted uppercase tracking-wider mb-5">Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                {galleryItems.map((media, index) => {
                  const safeIndex = firstVideoIndex >= 0 ? project.gallery!.indexOf(media) : index;
                  const ratioKey = `pult-gallery-${safeIndex}`;
                  const ratio = pultAspectRatios[ratioKey];
                  const dimensions = pultMediaDimensions[ratioKey];
                  const hasKnownRatio = typeof ratio === 'number';
                  const isImage = media.type === 'image';
                  const isVideo = media.type === 'video';
                  const cardStyle: React.CSSProperties = {
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: dimensions ? `${Math.min(dimensions.width, 640)}px` : '100%',
                    width: '100%',
                    minHeight: 120,
                    aspectRatio: hasKnownRatio ? `${ratio}` : isVideo ? '16/9' : '4/3',
                  };
                  return (
                    <div
                      key={index}
                      className={`relative rounded-2xl overflow-hidden group bg-black/5 isolate ${isImage ? 'cursor-pointer hover:ring-2 hover:ring-[rgba(28,28,28,0.15)] transition-all' : ''}`}
                      style={cardStyle}
                      onClick={() => isImage && setLightboxImage(media.src)}
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          controls
                          autoPlay
                          muted
                          playsInline
                          loop
                          onLoadedMetadata={(e) => updatePultMediaMeta(ratioKey, e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
                          className="w-full h-full object-contain block"
                        />
                      ) : (
                        <>
                          <img
                            src={media.src}
                            alt={media.title || `Gallery ${index + 1}`}
                            onLoad={(e) => updatePultMediaMeta(ratioKey, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                            className="w-full h-full object-contain block"
                          />
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <svg className="w-4 h-4 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </>
                      )}
                      {media.title && (
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="text-white text-sm font-medium">{media.title}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          <LightboxModal image={lightboxImage} onClose={() => setLightboxImage(null)} alt="Enlarged" />

          <div className="mt-10">
            <ProjectBoardAccordion slug={project.slug} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
