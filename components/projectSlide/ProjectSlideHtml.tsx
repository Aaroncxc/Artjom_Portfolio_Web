'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../GlassPanel';
import { ProjectBoardAccordion } from '../ProjectBoardAccordion';
import { Project } from '@/lib/types';
import { formatDate, typeIcons } from './utils';
import { LightboxModal } from './LightboxModal';

interface ProjectSlideHtmlProps {
  project: Project;
  isActive: boolean;
}

export function ProjectSlideHtml({ project, isActive }: ProjectSlideHtmlProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = (element: HTMLElement | null) => {
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="snap-section flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-16 min-h-[100dvh]">
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          style={{ opacity: isActive ? 1 : 0.3 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-4 sm:mb-6">
            <GlassPanel variant="default" padding="lg" className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                  {typeIcons[project.type]}
                  <span className="capitalize">Interactive</span>
                </span>
                <span className="text-xs text-mk-text-muted">{formatDate(project.date)}</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3 text-mk-text">
                {project.title}
              </h2>
              <p className="text-mk-text-secondary text-sm leading-relaxed mb-4">
                {project.description}
              </p>
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
              {project.author && (
                <div className="pt-3 border-t border-[rgba(28,28,28,0.08)]">
                  <p className="text-sm text-mk-text-muted">
                    Created by <span className="text-mk-text">{project.author}</span>
                  </p>
                </div>
              )}
            </GlassPanel>

            <div ref={mediaContainerRef} className="w-full overflow-hidden rounded-2xl relative h-full min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] group/html bg-black">
              <iframe
                src={project.htmlPath || `/projects/${project.slug}/index.html`}
                className="w-full h-full border-0 rounded-2xl"
                title={project.title}
                sandbox="allow-scripts allow-same-origin"
              />
              <button
                onClick={() => toggleFullscreen(mediaContainerRef.current)}
                className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                aria-label={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
              >
                {isFullscreen ? (
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
          </div>

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
                      <video src={media.src} controls autoPlay muted playsInline loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={media.src} alt={media.title || `Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                    )}
                    {media.title && (
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">{media.title}</span>
                      </div>
                    )}
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

          <LightboxModal image={lightboxImage} onClose={() => setLightboxImage(null)} />

          <ProjectBoardAccordion slug={project.slug} />
        </motion.div>
      </div>
    </div>
  );
}
