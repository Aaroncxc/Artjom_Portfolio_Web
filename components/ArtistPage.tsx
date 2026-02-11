'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import type { Member, Project } from '@/lib/types';

interface ArtistPageProps {
  member: Member;
  projects: Project[];
  onClose: () => void;
  onOpenProject?: (project: Project) => void;
}

export function ArtistPage({ member, projects, onClose, onOpenProject }: ArtistPageProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const memberProjects = projects.filter(
    (p) => p.author === member.handle
  );

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-[rgba(250,250,255,0.85)] backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-0 z-[101] flex items-start justify-center overflow-y-auto touch-pan-y"
      >
        <div className="w-full max-w-2xl mx-auto my-8 md:my-16 px-4" onClick={(e) => e.stopPropagation()}>
          <GlassPanel variant="heavy" padding="lg" className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full hover:bg-[rgba(28,28,28,0.08)] transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[rgba(28,28,28,0.06)] border border-[rgba(28,28,28,0.08)] flex items-center justify-center text-lg font-semibold text-mk-text">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-mk-text">
                    {member.name}
                  </h2>
                  <p className="text-sm text-mk-text-muted">@{member.handle}</p>
                </div>
              </div>

              {/* Founder badge */}
              {member.isFounder && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.25)] text-[11px] font-medium text-[#0d9488] uppercase tracking-wider mb-4">
                  Founder
                </span>
              )}

              {/* Roles */}
              <div className="flex flex-wrap gap-2 mb-5">
                {member.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] text-mk-text-secondary"
                  >
                    {role}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-[15px] text-mk-text-secondary leading-relaxed">
                {member.bio}
              </p>
            </div>

            {/* Projects */}
            {memberProjects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-mk-text-muted uppercase tracking-wider mb-4">
                  Projekte
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {memberProjects.map((project) => {
                    const isVideo = project.thumbnail?.endsWith('.mp4');
                    return (
                      <button
                        key={project.id}
                        onClick={() => onOpenProject?.(project)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.08)] hover:border-[rgba(28,28,28,0.2)] transition-all cursor-pointer"
                      >
                        {isVideo ? (
                          <video
                            src={project.thumbnail}
                            muted
                            playsInline
                            autoPlay
                            loop
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,28,28,0.7)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-white text-xs font-medium truncate">
                            {project.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Links */}
            {member.links.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-mk-text-muted uppercase tracking-wider mb-4">
                  Links
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[rgba(28,28,28,0.04)] border border-[rgba(28,28,28,0.1)] text-mk-text hover:bg-[rgba(28,28,28,0.08)] hover:border-[rgba(28,28,28,0.2)] transition-all"
                    >
                      <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </GlassPanel>
        </div>
      </motion.div>
    </>
  );
}
