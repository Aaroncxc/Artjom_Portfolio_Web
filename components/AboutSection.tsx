'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import { ArtistPage } from './ArtistPage';
import type { Member, Project } from '@/lib/types';

// ── Real members ──────────────────────────────────────────────

const members: Member[] = [
  {
    id: 'artjom',
    name: 'Artjom Naninjan',
    handle: 'AaronCxC',
    isFounder: true,
    roles: ['3D Generalist', 'Architect', 'Project Manager', 'App Developer', 'Art Director', 'Producer'],
    bio: 'Founder of Multikunst. Artjom merges architecture, 3D art, and code into immersive digital experiences. From product visualizations to interactive web installations, he leads the creative and technical vision of the collective.',
    links: [
      { label: 'Portfolio', url: '#' },
      { label: 'Instagram', url: '#' },
    ],
  },
  {
    id: 'sahachat',
    name: 'Sahachat Sonnenburg',
    handle: 'oxxupe',
    roles: ['App Developer', '3D Generalist', 'Musician', 'Art Director', 'Producer'],
    bio: 'Sahachat brings a unique blend of music, code, and visual art to every project. As a developer and 3D artist he builds the interactive systems that power Multikunst experiences.',
    links: [
      { label: 'Portfolio', url: '#' },
      { label: 'Instagram', url: '#' },
    ],
  },
  {
    id: 'jan',
    name: 'Jan Boetker',
    handle: 'JanMitGun',
    roles: ['2D Specialist', 'Videographer', 'Producer', 'Art Director'],
    bio: 'Jan shapes the visual identity of Multikunst through videography, graphic design, and art direction. His eye for composition and motion brings every project to life on screen.',
    links: [
      { label: 'Portfolio', url: '#' },
      { label: 'Instagram', url: '#' },
    ],
  },
];

// ── Marquee background with project thumbnails ────────────────

function ProjectMarquee({ thumbnails }: { thumbnails: string[] }) {
  if (thumbnails.length === 0) return null;

  // Double the list for seamless loop
  const items = [...thumbnails, ...thumbnails];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="flex items-center gap-6 h-full will-change-transform"
        style={{
          animation: 'marquee-scroll 60s linear infinite',
          width: `${items.length * 200}px`,
        }}
      >
        {items.map((src, i) => {
          const isVideo = src.endsWith('.mp4');
          return (
            <div
              key={`${src}-${i}`}
              className="flex-shrink-0 w-[180px] h-[120px] rounded-xl overflow-hidden opacity-[0.07]"
              style={{ filter: 'blur(1px) grayscale(0.3)' }}
            >
              {isVideo ? (
                <video
                  src={src}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface AboutSectionProps {
  visible: boolean;
}

export function AboutSection({ visible }: AboutSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Load projects for marquee and artist pages
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/posts.json');
        const data = await res.json();
        setProjects(data.posts || []);
      } catch {
        /* ignore */
      }
    }
    load();
  }, []);

  if (!visible) return null;

  const thumbnails = projects
    .map((p) => p.thumbnail)
    .filter((t): t is string => !!t);

  return (
    <>
      <div ref={sectionRef} id="about" className="pt-4 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl w-full mx-auto">
          {/* Accordion Header */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full px-5 sm:px-6 py-5 bg-[rgba(255,255,255,0.7)] rounded-2xl border border-[rgba(28,28,28,0.08)] cursor-pointer flex items-center justify-between shadow-[0_2px_12px_rgba(28,28,28,0.04)] hover:bg-[rgba(255,255,255,0.85)] transition-colors"
          >
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-semibold text-mk-text tracking-tight">
                About Us
              </h2>
              <p className="text-sm text-mk-text-secondary mt-0.5">
                Learn more about multikunst and our team
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-[rgba(28,28,28,0.4)] transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Accordion Content */}
          <div
            className="grid transition-all duration-300 ease-out"
            style={{
              gridTemplateRows: isOpen ? '1fr' : '0fr',
              marginTop: isOpen ? 16 : 0,
            }}
          >
            <div className="overflow-hidden">
              <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <GlassPanel variant="heavy" padding="none" className="relative overflow-hidden">
                  {/* Marquee background */}
                  <ProjectMarquee thumbnails={thumbnails} />

                  <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                    {/* Headline */}
                    <div className="mb-10 max-w-2xl">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-mk-text mb-5 leading-[1.1]">
                        We are multikunst
                      </h3>
                      <p className="text-base sm:text-lg text-mk-text-secondary leading-relaxed">
                        A creative collective at the intersection of art, design, and technology.
                        We combine architecture, 3D visualization, videography, music, and code
                        to build immersive digital experiences.
                      </p>
                    </div>

                    {/* Philosophy grid */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-12">
                      <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.5)] border border-[rgba(28,28,28,0.06)]">
                        <h4 className="text-[15px] font-semibold text-mk-text mb-2">
                          Our Philosophy
                        </h4>
                        <p className="text-sm text-mk-text-secondary leading-relaxed">
                          We believe the best work happens when different disciplines collide.
                          Every project is a chance to merge perspectives and push creative boundaries.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.5)] border border-[rgba(28,28,28,0.06)]">
                        <h4 className="text-[15px] font-semibold text-mk-text mb-2">
                          What We Do
                        </h4>
                        <p className="text-sm text-mk-text-secondary leading-relaxed">
                          From interactive 3D web experiences and product visualizations to
                          music videos and brand identities &mdash; we work across every medium.
                        </p>
                      </div>
                    </div>

                    {/* Members */}
                    <div>
                      <h4 className="text-sm font-medium text-mk-text-muted uppercase tracking-wider mb-5">
                        The Collective
                      </h4>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {members.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => setSelectedMember(member)}
                            className="group text-left p-5 rounded-2xl bg-[rgba(255,255,255,0.6)] border border-[rgba(28,28,28,0.06)] hover:bg-[rgba(255,255,255,0.85)] hover:border-[rgba(28,28,28,0.12)] hover:shadow-[0_4px_20px_rgba(28,28,28,0.06)] transition-all cursor-pointer"
                          >
                            {/* Avatar + Founder badge */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-[rgba(28,28,28,0.06)] border border-[rgba(28,28,28,0.08)] flex items-center justify-center text-sm font-semibold text-mk-text">
                                {member.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              {member.isFounder && (
                                <span className="px-2 py-0.5 rounded-full bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.2)] text-[10px] font-medium text-[#0d9488] uppercase tracking-wider">
                                  Founder
                                </span>
                              )}
                            </div>

                            {/* Name */}
                            <div className="text-[15px] font-semibold text-mk-text group-hover:text-[#0d9488] transition-colors leading-tight mb-0.5">
                              {member.name}
                            </div>
                            <div className="text-xs text-mk-text-muted mb-3">
                              @{member.handle}
                            </div>

                            {/* Primary role */}
                            <div className="text-xs text-mk-text-secondary">
                              {member.roles.slice(0, 3).join(' / ')}
                            </div>

                            {/* Arrow hint */}
                            <div className="mt-4 flex items-center gap-1 text-xs text-mk-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View profile</span>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Page Modal */}
      <AnimatePresence>
        {selectedMember && (
          <ArtistPage
            member={selectedMember}
            projects={projects}
            onClose={() => setSelectedMember(null)}
            onOpenProject={(project) => {
              setSelectedMember(null);
              // Scroll to project grid and open the project there
              setTimeout(() => {
                const grid = document.getElementById('projects');
                if (grid) {
                  grid.scrollIntoView({ behavior: 'smooth' });
                  // Dispatch a custom event so ProjectsGrid can open the project
                  window.dispatchEvent(
                    new CustomEvent('open-project', { detail: { slug: project.slug } })
                  );
                }
              }, 300);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
