import Link from 'next/link';
import { CAREER_FOOTER } from '@/lib/careerContent';

export function CareerFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t py-[var(--space-12)]"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="career-container">
        <div className="mb-[var(--space-8)] grid gap-[var(--space-8)] sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3
              className="mb-[var(--space-3)] font-semibold"
              style={{ fontSize: 'var(--text-lg)', color: 'var(--fg)' }}
            >
              Artjom Naninjan
            </h3>
            <p
              style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-body)', color: 'var(--fg-muted)' }}
            >
              Production &amp; AI Learning Lead — eLearning, creative production, and gaming leadership.
            </p>
          </div>

          <div>
            <h4 className="career-eyebrow mb-[var(--space-3)]">Connect</h4>
            <ul className="space-y-1">
              <li>
                <a
                  href={CAREER_FOOTER.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link inline-flex min-h-[44px] items-center text-sm"
                >
                  GitHub · Aaroncxc
                </a>
              </li>
              <li>
                <a
                  href={CAREER_FOOTER.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link inline-flex min-h-[44px] items-center text-sm"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={CAREER_FOOTER.mailto} className="career-link inline-flex min-h-[44px] items-center text-sm">
                  {CAREER_FOOTER.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="career-eyebrow mb-[var(--space-3)]">Also</h4>
            <ul className="space-y-1">
              <li>
                <a
                  href={CAREER_FOOTER.multikunst}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link inline-flex min-h-[44px] items-center text-sm"
                >
                  Multikunst collective
                </a>
              </li>
              <li>
                <Link href="/intro" className="career-link inline-flex min-h-[44px] items-center text-sm">
                  Intro deck
                </Link>
              </li>
              <li>
                <Link href="/" className="career-link inline-flex min-h-[44px] items-center text-sm">
                  Main portfolio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-[var(--space-6)] text-center sm:text-left"
          style={{ borderColor: 'var(--border)' }}
        >
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
            © {year} Artjom Naninjan. Career test track — review before merge to production.
          </p>
        </div>
      </div>
    </footer>
  );
}
