'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CAREER_FOOTER } from '@/lib/careerContent';
import { buildHireMailto } from '@/lib/contact';

export function CareerHireBar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.career-hero');
    if (!hero) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop: slim sticky top bar after hero */}
      <div
        className={`career-hire-bar career-hire-bar--desktop${pastHero ? ' career-hire-bar--visible' : ''}`}
        aria-hidden={!pastHero}
      >
        <div className="career-container flex h-12 items-center justify-between gap-4">
          <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            Hire Artjom · Production &amp; AI Learning Lead
          </span>
          <div className="flex items-center gap-2">
            <a href={buildHireMailto()} className="career-btn career-btn-primary career-btn--compact">
              Email me
            </a>
            <a
              href={CAREER_FOOTER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="career-btn career-btn-secondary career-btn--compact"
            >
              LinkedIn
            </a>
            <Link href="/intro" className="career-btn career-btn-secondary career-btn--compact">
              2-min intro
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="career-hire-bar career-hire-bar--mobile" role="navigation" aria-label="Quick hire actions">
        <a href={buildHireMailto()} className="career-hire-bar__mobile-btn career-hire-bar__mobile-btn--primary">
          Email me
        </a>
        <a
          href={CAREER_FOOTER.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="career-hire-bar__mobile-btn"
        >
          LinkedIn
        </a>
        <Link href="/intro" className="career-hire-bar__mobile-btn">
          2-min intro
        </Link>
      </div>
    </>
  );
}
