'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../GlassPanel';
import { ProjectBoardAccordion } from '../ProjectBoardAccordion';
import { Project } from '@/lib/types';
import { formatDate, typeIcons } from './utils';
import { LightboxModal } from './LightboxModal';

interface ProjectSlideVideoProps {
  project: Project;
  isActive: boolean;
}

export function ProjectSlideVideo({ project, isActive }: ProjectSlideVideoProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPortraitMainVideo = !!project.videoPortrait;

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [project.id, isActive]);

  return (
    <div className="snap-section flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-16 min-h-[100dvh]">
      <div className="max-w-5xl w-full mx-auto">
        <motion.div
          style={{ opacity: isActive ? 1 : 0.3 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <GlassPanel variant="default" padding="md" className="mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                  {typeIcons[project.type]}
                  <span className="capitalize">Video</span>
                </span>
                <span className="text-xs text-mk-text-muted">{formatDate(project.date)}</span>
                <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-mk-text">
                  {project.title}
                </h2>
              </div>
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
            <p className="text-mk-text-secondary text-sm leading-relaxed mt-3 hidden md:block">
              {project.description}
            </p>
          </GlassPanel>

          {/* Video: bei 3D-Viewer gleiche Box-Größe wie 3D-Viewer (volle Breite, 16/9), sonst ggf. zwei Spalten */}
          {project.htmlPath ? (
            <div className="w-full relative rounded-2xl overflow-hidden bg-black/5 shrink-0" style={{ aspectRatio: '16/9' }}>
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
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 items-start">
            <div
              className={`relative group/video rounded-2xl overflow-hidden bg-black/5 w-full shrink-0 ${isPortraitMainVideo ? 'max-w-[min(100%,320px)]' : ''}`}
              style={{ aspectRatio: isPortraitMainVideo ? '9/16' : '16/9' }}
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
              {isPortraitMainVideo && (
                <button
                  onClick={() => videoRef.current?.requestFullscreen()}
                  className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                  aria-label="Vollbild"
                >
                  <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v-4.5m0 4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                  </svg>
                </button>
              )}
            </div>
            {project.gallery?.find((m) => m.type === 'video') && (() => {
              const first = project.gallery!.find((m) => m.type === 'video')!;
              return (
                <div
                  className="relative rounded-2xl overflow-hidden bg-black/5 w-full shrink-0 isolate aspect-video min-h-[160px]"
                >
                  <video
                    src={first.src}
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="w-full h-full object-contain block"
                  />
                </div>
              );
            })()}
          </div>
          )}

          {project.htmlPath && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-mk-text mb-4">3D Modell</h3>
              <div className="w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shrink-0" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={project.htmlPath}
                  className="w-full h-full border-0"
                  title={`${project.title} - 3D Viewer`}
                  allow="fullscreen"
                />
              </div>
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (() => {
            const firstVideoIdx = project.gallery.findIndex((m) => m.type === 'video');
            const galleryRest = firstVideoIdx >= 0 ? project.gallery.filter((_, i) => i !== firstVideoIdx) : project.gallery;
            if (galleryRest.length === 0) return null;
            return (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-mk-text mb-4">Weitere Ansichten</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {galleryRest.map((media, index) => (
                  <div
                    key={index}
                    className={`relative aspect-video rounded-xl overflow-hidden group bg-black/5 isolate min-h-[140px] ${media.type === 'image' ? 'cursor-pointer border border-[rgba(28,28,28,0.1)] hover:border-[rgba(28,28,28,0.25)] transition-colors' : ''}`}
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
                        className="w-full h-full object-contain block"
                      />
                    ) : (
                      <>
                        <img
                          src={media.src}
                          alt={media.title || `Gallery image ${index + 1}`}
                          className="w-full h-full object-contain block"
                        />
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <svg className="w-3 h-3 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </>
                    )}
                    {media.title && (
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-white text-xs font-medium">{media.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            );
          })()}

          <LightboxModal image={lightboxImage} onClose={() => setLightboxImage(null)} />

          <div className="mt-6">
            <ProjectBoardAccordion slug={project.slug} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
