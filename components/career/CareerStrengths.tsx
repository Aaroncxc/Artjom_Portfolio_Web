import { CAREER_STRENGTHS } from '@/lib/careerContent';

export function CareerStrengths() {
  return (
    <section className="career-section pb-[var(--space-12)]">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-3)]">Strengths</p>
        <h2 className="career-heading mb-[var(--space-8)]">How I deliver</h2>

        <ul className="grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-3">
          {CAREER_STRENGTHS.map((strength) => (
            <li
              key={strength.name}
              className="career-card flex min-h-[56px] items-center px-[var(--space-5)] py-[var(--space-4)]"
              style={
                strength.highlight
                  ? { borderColor: 'var(--border-strong)' }
                  : undefined
              }
            >
              <span
                className="mr-[var(--space-3)] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: strength.highlight ? 'var(--accent)' : 'var(--fg-faint)' }}
                aria-hidden
              />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>{strength.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
