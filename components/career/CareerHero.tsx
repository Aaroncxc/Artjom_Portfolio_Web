import Link from 'next/link';
import { CAREER_HERO } from '@/lib/careerContent';
import { buildHireMailto } from '@/lib/contact';

export function CareerHero() {
  return (
    <section className="career-hero career-section pt-[var(--space-8)] md:pt-[var(--space-12)]">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-3)]">{CAREER_HERO.eyebrow}</p>

        <h1 className="career-hero-title mb-[var(--space-4)] max-w-3xl">{CAREER_HERO.title}</h1>

        <p className="career-hero-lead mb-[var(--space-6)] max-w-2xl">{CAREER_HERO.lead}</p>

        <ul className="mb-[var(--space-6)] flex flex-wrap gap-[var(--space-2)]">
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
            2-min intro
          </Link>
          <a href={buildHireMailto()} className="career-btn career-btn-secondary">
            Email me
          </a>
          <Link href="/career/one-pager" className="career-btn career-btn-secondary">
            One-pager
          </Link>
        </div>
      </div>
    </section>
  );
}
