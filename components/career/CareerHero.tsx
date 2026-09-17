import Link from 'next/link';
import { CAREER_HERO } from '@/lib/careerContent';
import { CONTACT_MAILTO } from '@/lib/contact';

export function CareerHero() {
  return (
    <section className="career-section pt-[var(--space-12)] md:pt-[var(--space-16)]">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-4)]">{CAREER_HERO.eyebrow}</p>

        <h1
          className="mb-[var(--space-6)] max-w-3xl font-semibold"
          style={{
            fontSize: 'var(--text-hero)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--fg)',
          }}
        >
          {CAREER_HERO.title}
        </h1>

        <p
          className="mb-[var(--space-8)] max-w-2xl"
          style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--leading-body)',
            color: 'var(--fg-muted)',
          }}
        >
          {CAREER_HERO.lead}
        </p>

        <ul className="mb-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
          {CAREER_HERO.metrics.map((metric) => (
            <li key={metric.label} className="career-chip">
              <span style={{ color: 'var(--fg)' }}>{metric.value}</span>
              <span className="ml-[var(--space-2)]">{metric.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-[var(--space-3)]">
          <a href="#work" className="career-btn career-btn-primary">
            View work
          </a>
          <Link href="/intro" className="career-btn career-btn-secondary">
            Intro
          </Link>
          <a href={CONTACT_MAILTO} className="career-btn career-btn-secondary">
            Contact
          </a>
        </div>

        <p
          className="mt-[var(--space-6)] max-w-xl"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-faint)' }}
        >
          {CAREER_HERO.secondary}
        </p>
      </div>
    </section>
  );
}
