'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CAREER_NAV } from '@/lib/careerContent';

export function CareerNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors duration-200"
      style={{
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        background: scrolled ? 'color-mix(in srgb, var(--bg) 92%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="career-container flex h-14 items-center justify-between gap-4">
        <Link
          href="/career"
          className="text-sm font-medium tracking-tight"
          style={{ color: 'var(--fg)', letterSpacing: 'var(--tracking-tight)' }}
        >
          Artjom Naninjan
        </Link>

        <nav aria-label="Career portfolio" className="flex items-center gap-1 sm:gap-2">
          {CAREER_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="career-link inline-flex min-h-[44px] items-center px-2 text-sm sm:px-3"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
