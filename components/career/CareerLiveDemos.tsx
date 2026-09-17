import { CAREER_LIVE_DEMOS } from '@/lib/careerContent';

export function CareerLiveDemos() {
  return (
    <section id="demos" className="career-section pt-0">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-2)]">Try something live</p>
        <h2 className="career-heading mb-[var(--space-6)]">Click and experience</h2>

        <div className="career-live-demos">
          {CAREER_LIVE_DEMOS.map((demo) => (
            <a
              key={demo.label}
              href={demo.href}
              target={demo.external ? '_blank' : undefined}
              rel={demo.external ? 'noopener noreferrer' : undefined}
              className="career-live-demo career-card"
            >
              <span className="career-live-demo__label">{demo.label}</span>
              {demo.tag && <span className="career-live-demo__tag">{demo.tag}</span>}
              <span className="career-live-demo__arrow" aria-hidden>
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
