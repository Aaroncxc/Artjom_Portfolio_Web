'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import clsx from 'clsx';
import { GlassPanel } from './GlassPanel';
import { projectMatchesPortfolioOwner } from '@/lib/portfolioOwnerFilter';
import { DADB_COURSE_OVERVIEW_TOOL_ID, toolDeepLink } from '@/lib/toolLinks';
import { useMobilePerformance } from '@/lib/useMobilePerformance';
import type { Project } from '@/lib/types';

// ── Artjom profile ────────────────────────────────────────────

const ROLES = [
  'Project Manager',
  '3D Generalist',
  'App Developer',
  'Art Director',
];

const BIO = `I merge architecture, 3D art, and code into immersive digital experiences. From product visualisations and AR/VR experiments to interactive web installations, I lead concept, design, and engineering end-to-end.`;

/** Studio portrait. Own aspect so the photo is not stretched with the CV. */
const PROFILE_PORTRAIT = {
  src: '/about/artjom-portrait.jpg',
  alt: 'Artjom Naninjan — studio portrait',
  focus: '50% 18%',
} as const;

/** Strengths. Items without `icon` fall back to a neutral dot. */
interface Strength {
  name: string;
  icon?: string;
  /** Softer spotlight styling — used sparingly (no explicit label in UI). */
  highlight?: boolean;
}
const STRENGTHS: Strength[] = [
  { name: 'Blender', icon: '/tool-icons/blender.png' },
  { name: 'Unreal Engine', icon: '/tool-icons/unreal-engine.png' },
  { name: 'Archicad', icon: '/tool-icons/archicad.png' },
  // Drop your licensed Figma logo at `/tool-icons/figma.png` and add `icon: '/tool-icons/figma.png'` here.
  { name: 'Figma' },
  { name: 'Project Management', highlight: true },
  // Slot reserved for Cursor — drop `/tool-icons/cursor.png` here when the logo is available.
];

interface CvEntry {
  role: string;
  org: string;
  period: string;
  location?: string;
  /** Subtle standout card styling for short creds — no heading or badge text. */
  highlight?: boolean;
  /** Expandable role description ("More" / "Less"). */
  description?: string;
  /** Optional link to a Tools & Games entry (opens modal after scroll). */
  toolLink?: { id: string; label: string };
  /** Inline certificate (PDF under `/public`). */
  pdfPath?: string;
  pdfLabel?: string;
}
/** Curated CV — short version (one line per stop). */
const CV: CvEntry[] = [
  {
    role: 'Creative Director',
    org: 'Multikunst — creative collective since 2023',
    period: 'Jan 2026 — present',
    location: 'Berlin',
    description:
      'Multikunst is a creative collective I co-founded with friends in 2023 — a shared name for visual experiments, product concepts, and interactive tools. Since January 2026 I lead it creatively: art direction and visual quality assurance for interactive projects, motion, 3D, and browser-based realtime visuals.',
  },
  {
    role: 'Head of Production',
    org: 'German Academy of Digital Education (DADB)',
    period: 'Jan 2024 — Oct 2025',
    location: 'Berlin · On-site',
    description:
      'As Head of Production at DADB Germany, I oversaw digital education projects end-to-end — coordinating cross-functional teams (3D, post-production, editorial) and keeping course delivery on track for learners worldwide. In this role I also built an internal live-monitoring dashboard for course production so management and stakeholders could follow pipeline status, workloads, and KPIs in real time.',
    toolLink: {
      id: DADB_COURSE_OVERVIEW_TOOL_ID,
      label: 'Course Overview Tool',
    },
  },
  {
    role: 'Head of 3D',
    org: 'German Academy of Digital Education (DADB)',
    period: 'Feb 2023 — Jan 2024',
    location: 'Berlin · Hybrid',
    description:
      'As Head of 3D, I led the visual production of DADB’s technical learning content — from asset creation in Blender through scene build, staging, and cinematic renders in Unreal Engine. I translated scripts into clear 3D sequences for topics such as e-mobility and rekuperation, working closely with editorial, professors and subject-matter experts from the Technical University of Berlin and Offenburg University of Applied Sciences, and partners across the renewables sector — including SMA and Sunotec, as well as Tesla.',
  },
  {
    role: 'Mixed Reality Lead',
    org: 'German Academy of Digital Education (DADB)',
    period: 'Jan 2022 — Feb 2023',
    location: 'Berlin',
  },
  {
    role: '3D Environment Artist',
    org: 'German Academy of Digital Education (DADB)',
    period: 'May 2021 — Jan 2022',
    location: 'Berlin',
  },
  {
    role: 'Bachelor of Architecture',
    org: 'Berliner Hochschule für Technik (BHT)',
    period: '2016 — 2020',
    location: 'Berlin',
  },
  {
    role: 'IHK Projektleiter',
    org: 'Certifications',
    period: 'Nov 2024',
    highlight: true,
    pdfPath: '/about/certificates/ihk-projektleiter.pdf',
    pdfLabel: 'View certificate',
  },
  {
    role: 'Revit Grundlagen (Autodesk)',
    org: 'Certifications',
    period: 'Jan 2021',
    highlight: true,
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
  '/about/Rectangle 4432.webp',
];

// ── Marquee background with project thumbnails ────────────────

function ProfilePhoto() {
  return (
    <aside className="lg:sticky lg:top-28 lg:row-span-2 lg:self-start">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.55)] bg-[rgba(255,255,255,0.4)] shadow-[0_10px_30px_rgba(28,28,28,0.14),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-[10px] sm:aspect-[2/3]">
        <Image
          src={PROFILE_PORTRAIT.src}
          alt={PROFILE_PORTRAIT.alt}
          fill
          sizes="(min-width: 1280px) 420px, (min-width: 1024px) 38vw, 92vw"
          quality={90}
          priority
          placeholder="empty"
          className="object-cover"
          style={{ objectPosition: PROFILE_PORTRAIT.focus }}
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(28,28,28,0.58)] via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="text-sm font-semibold text-white">Artjom Naninjan</div>
          <div className="text-xs text-white/80">@AaronCxC</div>
        </div>
      </div>
    </aside>
  );
}

function ProjectMarquee({ thumbnails, enabled }: { thumbnails: string[]; enabled: boolean }) {
  if (!enabled || thumbnails.length === 0) return null;

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
                <img
                  src={src.replace(/\.mp4$/i, '.webp')}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [openCvDetails, setOpenCvDetails] = useState<Record<string, boolean>>({});
  const { limitContinuousEffects } = useMobilePerformance();

  const toggleCvDetail = (key: string) => {
    setOpenCvDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/posts.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data: unknown = await res.json();
        const raw =
          data && typeof data === 'object' && 'posts' in data
            ? (data as { posts?: unknown }).posts
            : data;
        const list = Array.isArray(raw) ? (raw as Project[]) : [];
        setProjects(list);
      } catch {
        /* ignore */
      }
    }
    load();
  }, []);

  if (!visible) return null;

  const projectThumbnails = (Array.isArray(projects) ? projects : [])
    .filter(projectMatchesPortfolioOwner)
    .map((p) => p.thumbnail)
    .filter((t): t is string => !!t);
  const thumbnails = [...aboutMedia, ...projectThumbnails];

  return (
    <div
      id="about"
      className="pt-28 sm:pt-32 md:pt-36 pb-6 sm:pb-8 md:pb-9 px-5 sm:px-8"
    >
      <div className="max-w-7xl w-full mx-auto" data-nav-key="about">
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
            <ProjectMarquee thumbnails={thumbnails} enabled={!limitContinuousEffects} />

            <div className="relative z-10 grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
                    About
                  </span>
                  <h3 className="mb-4 text-3xl font-semibold leading-[1.05] tracking-tight text-mk-text sm:text-4xl lg:text-5xl brand-tight">
                    Hi, I&rsquo;m Artjom.
                  </h3>
                  <p className="text-base leading-relaxed text-mk-text-secondary sm:text-lg">
                    {BIO}
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-mk-text-muted">
                    What I do
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => (
                      <span
                        key={role}
                        className="rounded-full border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.6)] px-3 py-1 text-xs font-medium text-mk-text-secondary backdrop-blur-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <ProfilePhoto />

              <div className="flex flex-col gap-7 lg:col-start-1">
                <div>
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-mk-text-muted">
                    Strengths
                  </h4>
                          <ul className="flex flex-wrap gap-2">
                            {STRENGTHS.map((s) => (
                              <li
                                key={s.name}
                                className={clsx(
                                  'inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5',
                                  s.highlight
                                    ? 'border border-[rgba(20,184,166,0.38)] bg-[linear-gradient(135deg,rgba(20,184,166,0.1)_0%,rgba(167,139,250,0.07)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(20,184,166,0.08)]'
                                    : 'border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.85)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
                                )}
                              >
                                {s.icon ? (
                                  <img
                                    src={s.icon}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 shrink-0 object-contain"
                                    loading="lazy"
                                  />
                                ) : s.highlight ? (
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan shadow-[0_0_0_3px_rgba(20,184,166,0.22)]"
                                    aria-hidden
                                  />
                                ) : (
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-mk-text-muted"
                                    aria-hidden
                                  />
                                )}
                                <span className="text-xs font-semibold text-mk-text">{s.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-mk-text-muted">
                            Career
                          </h4>
                          <ol className="relative space-y-5 border-l border-[rgba(28,28,28,0.12)] pl-5">
                            {CV.map((entry) => {
                              const cvKey = `${entry.role}-${entry.period}`;
                              const hasToggle = Boolean(entry.description || entry.pdfPath);
                              const isCvOpen = !!openCvDetails[cvKey];

                              const body = (
                                <>
                                  <p className="text-sm font-semibold leading-snug text-mk-text">
                                    {entry.role}
                                  </p>
                                  <p className="text-sm leading-snug text-mk-text-secondary">{entry.org}</p>
                                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-mk-text-muted">
                                    {entry.period}
                                    {entry.location ? ` · ${entry.location}` : ''}
                                  </p>
                                </>
                              );

                              const expandableBlock = (
                                <>
                                  {hasToggle && (
                                    <button
                                      type="button"
                                      onClick={() => toggleCvDetail(cvKey)}
                                      aria-expanded={isCvOpen}
                                      aria-controls={`cv-detail-${cvKey}`}
                                      className={clsx(
                                        'mt-1.5 inline-flex min-h-[32px] items-center gap-1 rounded-md px-1.5 -ml-1.5 text-[11px] font-semibold uppercase tracking-wider text-system-blue transition-opacity hover:opacity-80',
                                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
                                      )}
                                    >
                                      {entry.pdfPath
                                        ? isCvOpen
                                          ? 'Hide certificate'
                                          : (entry.pdfLabel ?? 'View certificate')
                                        : isCvOpen
                                          ? 'Less'
                                          : 'More'}
                                      <svg
                                        className={clsx('h-3 w-3 transition-transform duration-200', isCvOpen && 'rotate-180')}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.25}
                                        aria-hidden
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  )}
                                  <AnimatePresence initial={false}>
                                    {isCvOpen && hasToggle && (
                                      <motion.div
                                        id={`cv-detail-${cvKey}`}
                                        key={`cv-detail-${cvKey}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-2 space-y-2.5">
                                          {entry.description ? (
                                            <p className="text-sm leading-relaxed text-mk-text-secondary">
                                              {entry.description}
                                              {entry.toolLink ? (
                                                <>
                                                  {' '}
                                                  <a
                                                    href={toolDeepLink(entry.toolLink.id)}
                                                    className="inline-block py-0.5 font-semibold text-system-blue underline decoration-system-blue/30 underline-offset-2 transition-opacity hover:opacity-80"
                                                  >
                                                    {entry.toolLink.label}
                                                  </a>
                                                  .
                                                </>
                                              ) : null}
                                            </p>
                                          ) : null}
                                          {entry.pdfPath ? (
                                            <div className="overflow-hidden rounded-lg border border-[rgba(28,28,28,0.1)] bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                                              <div className="flex items-center justify-between gap-3 border-b border-[rgba(28,28,28,0.08)] bg-white/80 px-3 py-2">
                                                <span className="text-[11px] font-semibold uppercase tracking-wider text-mk-text-muted">
                                                  IHK certificate (PDF)
                                                </span>
                                                <a
                                                  href={entry.pdfPath}
                                                  target="_blank"
                                                  rel="noreferrer noopener"
                                                  className="text-[11px] font-semibold text-system-blue transition-opacity hover:opacity-80"
                                                >
                                                  In neuem Tab öffnen
                                                </a>
                                              </div>
                                              <iframe
                                                src={`${entry.pdfPath}#view=FitH&toolbar=0`}
                                                title={`${entry.role} — Certificate`}
                                                className="block h-[300px] w-full border-0 bg-white sm:h-[420px]"
                                              />
                                            </div>
                                          ) : null}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </>
                              );

                              return (
                                <li key={cvKey} className="relative">
                                  <span
                                    className={clsx(
                                      'absolute -left-[1.34rem] h-2 w-2 shrink-0 rounded-full',
                                      entry.highlight ? 'top-5 bg-accent-cyan shadow-[0_0_0_3px_rgba(20,184,166,0.22)]' : 'top-1.5 bg-mk-text'
                                    )}
                                    aria-hidden
                                  />
                                  {entry.highlight ? (
                                    <div className="-ml-0.5 rounded-xl border border-[rgba(20,184,166,0.26)] bg-[linear-gradient(125deg,rgba(20,184,166,0.08)_0%,rgba(167,139,250,0.055)_55%,rgba(255,255,255,0.4)_100%)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                                      {body}
                                      {expandableBlock}
                                    </div>
                                  ) : (
                                    <>
                                      {body}
                                      {expandableBlock}
                                    </>
                                  )}
                                </li>
                              );
                            })}
                          </ol>
                        </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
