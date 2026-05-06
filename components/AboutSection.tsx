'use client';

import { useState, useEffect } from 'react';
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

const aboutMedia: string[] = [
  '/about/E-Learning_Africa_2024.jpg',
  '/about/ELA_130.jpg',
  '/about/IMG_0828.JPG',
  '/about/ProductRoadshow1_India_2024.jpg',
  '/about/ProductRoadshow2_India_2024.jpg',
  '/about/ProductRoadshow3_India_2024.jpg',
  '/about/ProductRoadshow_India_2024.jpg',
  '/about/Rectangle 4431.png',
  '/about/Rectangle 4432.png',
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
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

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

  const projectThumbnails = projects
    .map((p) => p.thumbnail)
    .filter((t): t is string => !!t);
  const thumbnails = [...aboutMedia, ...projectThumbnails];

  return (
    <>
      <div
        id="about"
        className="pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-12 md:pb-14 px-5 sm:px-8"
      >
        <div className="max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <GlassPanel
              variant="heavy"
              padding="none"
              className="relative overflow-hidden rounded-3xl"
            >
                  {/* Marquee background */}
                  <ProjectMarquee thumbnails={thumbnails} />

                  <div className="relative z-10 p-5 sm:p-6 lg:p-8">
                    {/* Headline */}
                    <div className="mb-8 max-w-2xl">
                      <h3 className="mb-4 text-3xl font-semibold leading-[1.1] tracking-tight text-mk-text sm:text-4xl lg:text-5xl">
                        We are multikunst
                      </h3>
                      <p className="text-base leading-relaxed text-mk-text-secondary sm:text-lg">
                        A creative collective at the intersection of art, design, and technology.
                        We combine architecture, 3D visualization, videography, music, and code
                        to build immersive digital experiences.
                      </p>
                    </div>

                    {/* Members */}
                    <div>
                      <h4 className="text-sm font-medium text-mk-text-muted uppercase tracking-wider mb-4">
                        The Collective
                      </h4>
                      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                        {members.map((member) => {
                          const bgImage =
                            member.id === 'artjom'
                              ? '/about/artjom-bg.png'
                              : member.id === 'sahachat'
                                ? '/about/sahi-bg.png'
                                : member.id === 'jan'
                                  ? '/about/jan-bg.png'
                                  : null;
                          const bgImagePositionClass =
                            member.id === 'artjom'
                              ? 'object-[86%_34%]'
                              : member.id === 'sahachat'
                                ? 'object-[86%_center]'
                                : member.id === 'jan'
                                  ? 'object-[center_32%]'
                                  : 'object-center';
                          return (
                            <button
                              key={member.id}
                              onClick={() => setSelectedMember(member)}
                              className="group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.34)] shadow-[0_10px_30px_rgba(28,28,28,0.14),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-[10px] hover:bg-[rgba(255,255,255,0.48)] hover:border-[rgba(255,255,255,0.72)] hover:shadow-[0_14px_38px_rgba(28,28,28,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] transition-all cursor-pointer"
                            >
                              {bgImage && (
                                <>
                                  <img
                                    src={bgImage}
                                    alt=""
                                    loading="lazy"
                                    className={`absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-[0.42] ${bgImagePositionClass}`}
                                  />
                                  {/* Light scrim at rest so type stays readable on busy photos */}
                                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.38)] via-[rgba(255,255,255,0.06)] to-transparent" />
                                  {/* Bleaches on hover so text pops */}
                                  <div className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-60" />
                                </>
                              )}

                              <div className="relative z-10 p-4 text-left sm:p-5">
                                {/* Avatar + Founder badge */}
                                <div className="mb-3 flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.8)] text-sm font-semibold text-mk-text shadow-sm">
                                    {member.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </div>
                                  {member.isFounder && (
                                    <span className="rounded-full border border-[rgba(20,184,166,0.35)] bg-[rgba(20,184,166,0.14)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#ecfeff] shadow-[0_0_0_1px_rgba(15,118,110,0.4)]">
                                      Founder
                                    </span>
                                  )}
                                </div>

                                {/* Name */}
                                <div className="mb-0.5 text-[15px] font-semibold leading-tight text-mk-text group-hover:text-[#0d9488] transition-colors">
                                  {member.name}
                                </div>
                                <div className="mb-3 text-xs text-mk-text-muted">
                                  @{member.handle}
                                </div>

                                {/* Primary role */}
                                <div className="text-xs text-mk-text-secondary">
                                  {member.roles.slice(0, 3).join(' / ')}
                                </div>

                                {/* Arrow hint — visible by default on touch */}
                                <div className="mt-4 flex items-center gap-1 text-xs text-mk-text-muted opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                                  <span>View profile</span>
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
            </GlassPanel>
          </motion.div>
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
