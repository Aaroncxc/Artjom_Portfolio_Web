import { CAREER_TRACKS } from '@/lib/careerContent';

export function CareerTracks() {
  return (
    <section id="tracks" className="career-section">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-3)]">Tracks</p>
        <h2 className="career-heading mb-[var(--space-3)]">Active search focus</h2>
        <p
          className="mb-[var(--space-8)] max-w-2xl"
          style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--fg-muted)' }}
        >
          Three parallel tracks — eLearning leadership, creative production, and realtime product builds.
        </p>

        <div className="grid gap-[var(--space-4)] md:grid-cols-3 md:gap-[var(--space-6)]">
          {CAREER_TRACKS.map((track) => (
            <article key={track.id} className="career-card p-[var(--space-6)]">
              <h3
                className="mb-[var(--space-3)] text-lg font-semibold"
                style={{ letterSpacing: 'var(--tracking-tight)', color: 'var(--fg)' }}
              >
                {track.title}
              </h3>
              <p
                className="mb-[var(--space-4)]"
                style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-body)', color: 'var(--fg-muted)' }}
              >
                {track.description}
              </p>
              <ul className="flex flex-wrap gap-[var(--space-2)]">
                {track.tags.map((tag) => (
                  <li key={tag} className="career-chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
