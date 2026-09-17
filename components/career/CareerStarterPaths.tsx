'use client';

import { CAREER_STARTER_PATHS } from '@/lib/careerContent';
import { buildHireMailto } from '@/lib/contact';
import { useCareerTrack } from './CareerTrackContext';

export function CareerStarterPaths() {
  const { applyTrack } = useCareerTrack();

  return (
    <section id="tracks" className="career-section pt-0">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-2)]">If you&apos;re hiring me for…</p>
        <h2 className="career-heading mb-[var(--space-6)]">Pick a path — see relevant work</h2>

        <div className="grid gap-[var(--space-4)] md:grid-cols-3">
          {CAREER_STARTER_PATHS.map((path) => (
            <article key={path.id} className="career-card career-starter-path flex flex-col p-[var(--space-5)]">
              <h3 className="mb-[var(--space-2)] text-base font-semibold" style={{ color: 'var(--fg)' }}>
                {path.title}
              </h3>
              <p className="career-body-sm mb-[var(--space-5)] flex-1">{path.description}</p>
              <div className="flex flex-col gap-[var(--space-2)] sm:flex-row">
                <button
                  type="button"
                  className="career-btn career-btn-primary flex-1"
                  onClick={() => applyTrack(path.id, { scrollToWork: true })}
                >
                  View work
                </button>
                <a
                  href={buildHireMailto(path.mailtoSubject)}
                  className="career-btn career-btn-secondary flex-1"
                >
                  Email
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
