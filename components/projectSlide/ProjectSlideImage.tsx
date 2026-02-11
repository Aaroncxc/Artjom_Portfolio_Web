'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../GlassPanel';
import { ProjectBoardAccordion } from '../ProjectBoardAccordion';
import { Project } from '@/lib/types';
import { formatDate, typeIcons } from './utils';
import { LightboxModal } from './LightboxModal';

interface ProjectSlideImageProps {
  project: Project;
  isActive: boolean;
}

export function ProjectSlideImage({ project, isActive }: ProjectSlideImageProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const mainImage = project.images?.[0] || project.thumbnail;

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
                  <span className="capitalize">Image</span>
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

          {mainImage && (
            <div
              className="w-full relative rounded-2xl overflow-hidden bg-black/5 mb-6 cursor-pointer group border border-transparent hover:border-[rgba(28,28,28,0.15)] transition-colors"
              onClick={() => setLightboxImage(mainImage)}
            >
              <img src={mainImage} alt={project.title} className="w-full h-auto object-contain" />
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <svg className="w-4 h-4 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-mk-text mb-4">Weitere Ansichten</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.map((media, index) => (
                  <div
                    key={index}
                    className={`relative rounded-2xl overflow-hidden bg-black/5 group ${media.type === 'image' ? 'cursor-pointer hover:border-[rgba(28,28,28,0.25)] border border-[rgba(28,28,28,0.1)] transition-colors' : ''}`}
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
                        className="w-full h-full object-contain"
                        style={{ aspectRatio: '16/9' }}
                      />
                    ) : (
                      <>
                        <img
                          src={media.src}
                          alt={media.title || `Gallery image ${index + 1}`}
                          className="w-full h-auto object-contain"
                        />
                        {media.type === 'image' && (
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <svg className="w-4 h-4 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        )}
                      </>
                    )}
                    {media.title && (
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-white text-sm font-medium">{media.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <LightboxModal image={lightboxImage} onClose={() => setLightboxImage(null)} alt="Vergrößerte Ansicht" />

          <div className="mt-6">
            <ProjectBoardAccordion slug={project.slug} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
