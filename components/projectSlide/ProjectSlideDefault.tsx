'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../GlassPanel';
import { ProjectBoardAccordion } from '../ProjectBoardAccordion';
import { Project } from '@/lib/types';
import { formatDate, typeIcons } from './utils';

interface ProjectSlideDefaultProps {
  project: Project;
  isActive: boolean;
}

export function ProjectSlideDefault({ project, isActive }: ProjectSlideDefaultProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  return (
    <div className="snap-section flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-24 min-h-[100dvh]">
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          style={{ opacity: isActive ? 1 : 0.3 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-stretch">
            <div className="order-1 lg:order-2 h-full">
              {project.type === 'audio' && (
                <div className="media-container h-full min-h-[250px] sm:min-h-[350px] w-full flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 audio-gradient-bg" />
                  <div className="absolute w-48 h-48 rounded-full opacity-30 orb-cyan" style={{ top: '-20%', left: '-10%' }} />
                  <div className="absolute w-40 h-40 rounded-full opacity-30 orb-violet" style={{ bottom: '-15%', right: '-10%' }} />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-end justify-center gap-1 h-24 mb-8">
                      {[...Array(32)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-accent-cyan to-accent-violet rounded-full"
                          animate={isPlaying ? { height: [20, 40 + Math.random() * 40, 20] } : { height: 20 }}
                          transition={{ duration: 0.4 + Math.random() * 0.2, repeat: Infinity, ease: 'easeInOut' }}
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
              )}
            </div>

            <div className="order-2 lg:order-1">
              <GlassPanel variant="default" padding="lg">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-accent-violet text-xs font-medium">
                    {typeIcons[project.type]}
                    <span className="capitalize">{project.type}</span>
                  </span>
                  <span className="text-xs text-mk-text-muted">{formatDate(project.date)}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4 text-mk-text">
                  {project.title}
                </h2>
                <p className="text-mk-text-secondary leading-relaxed mb-6">
                  {project.description}
                </p>
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
                {project.author && (
                  <div className="pt-4 border-t border-[rgba(28,28,28,0.08)]">
                    <p className="text-sm text-mk-text-muted">
                      Created by <span className="text-mk-text">{project.author}</span>
                    </p>
                  </div>
                )}
              </GlassPanel>
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
