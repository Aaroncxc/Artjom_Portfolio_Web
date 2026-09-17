import { CAREER_TIMELINE } from '@/lib/careerContent';

export function CareerTimeline() {
  return (
    <section id="about" className="career-section">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-3)]">Career</p>
        <h2 className="career-heading mb-[var(--space-8)]">Timeline</h2>

        <ol className="relative border-l" style={{ borderColor: 'var(--border)' }}>
          {CAREER_TIMELINE.map((entry) => (
            <li
              key={`${entry.role}-${entry.period}`}
              className="relative mb-[var(--space-6)] ml-[var(--space-6)] last:mb-0"
            >
              <span
                className="absolute -left-[calc(var(--space-6)+5px)] top-5 h-2.5 w-2.5 rounded-full"
                style={{
                  background: entry.highlight ? 'var(--accent)' : 'var(--fg-faint)',
                  border: `2px solid var(--bg)`,
                }}
                aria-hidden
              />

              <div
                className="career-card p-[var(--space-5)]"
                style={entry.highlight ? { borderColor: 'var(--border-strong)' } : undefined}
              >
                <div className="mb-[var(--space-1)] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3
                    className="font-medium"
                    style={{ fontSize: 'var(--text-base)', color: 'var(--fg)' }}
                  >
                    {entry.role}
                  </h3>
                  <time
                    className="career-eyebrow normal-case"
                    style={{ letterSpacing: '0.04em', color: 'var(--fg-faint)' }}
                    dateTime={entry.period}
                  >
                    {entry.period}
                  </time>
                </div>
                <p
                  className="mb-[var(--space-1)]"
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}
                >
                  {entry.org}
                </p>
                {entry.location && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-faint)' }}>
                    {entry.location}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
