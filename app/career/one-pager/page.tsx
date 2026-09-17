import Link from 'next/link';
import {
  CAREER_HERO,
  CAREER_ONE_PAGER_CASES,
  CAREER_FOOTER,
  CAREER_STRENGTHS,
} from '@/lib/careerContent';
import { buildHireMailto } from '@/lib/contact';
import { CareerPrintButton } from '@/components/career/CareerPrintButton';
import '../career.css';
import './one-pager.css';

export const metadata = {
  title: 'Artjom Naninjan — One-pager',
  description: 'Printable career summary — Production & AI Learning Lead',
};

export default function CareerOnePagerPage() {
  const year = new Date().getFullYear();

  return (
    <div className="career-theme career-one-pager">
      <header className="career-one-pager__header">
        <div>
          <p className="career-one-pager__eyebrow">{CAREER_HERO.eyebrow}</p>
          <h1 className="career-one-pager__title">{CAREER_HERO.title}</h1>
        </div>
        <div className="career-one-pager__contact">
          <a href={buildHireMailto()}>{CAREER_FOOTER.email}</a>
          <a href={CAREER_FOOTER.linkedin}>LinkedIn</a>
          <a href={CAREER_FOOTER.github}>GitHub · Aaroncxc</a>
        </div>
      </header>

      <section className="career-one-pager__section">
        <h2>Summary</h2>
        <p>{CAREER_HERO.lead}</p>
        <ul className="career-one-pager__metrics">
          {CAREER_HERO.metrics.map((m) => (
            <li key={m.label}>
              <strong>{m.value}</strong> {m.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="career-one-pager__section">
        <h2>Top cases</h2>
        <ol className="career-one-pager__cases">
          {CAREER_ONE_PAGER_CASES.map((c) => (
            <li key={c.title}>
              <strong>{c.title}</strong> — {c.outcome}
            </li>
          ))}
        </ol>
      </section>

      <section className="career-one-pager__section">
        <h2>Strengths</h2>
        <p>{CAREER_STRENGTHS.map((s) => s.name).join(' · ')}</p>
      </section>

      <section className="career-one-pager__section">
        <h2>Contact</h2>
        <p>
          {CAREER_FOOTER.email} · Open to eLearning, creative production, and gaming leadership
          roles.
        </p>
      </section>

      <footer className="career-one-pager__footer">
        <p>
          © {year} Artjom Naninjan ·{' '}
          <Link href="/career" className="career-one-pager__back">
            Full portfolio →
          </Link>
        </p>
        <CareerPrintButton />
      </footer>
    </div>
  );
}
