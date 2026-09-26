'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { GlassPanel } from '@/components/GlassPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buildHireMailto } from '@/lib/contact';
import { MAILTO_SUBJECTS, PRODUCER_NAV } from '@/lib/producer/constants';

export function ProducerNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-8">
      <GlassPanel
        variant="heavy"
        padding="none"
        rounded="2xl"
        className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 rounded-2xl px-2 py-2 sm:rounded-3xl sm:px-3"
      >
        <Link
          href="/"
          className="flex min-h-[44px] items-center px-3 text-sm font-semibold tracking-tight text-mk-text transition-colors hover:text-accent-cyan"
        >
          Artjom Naninjan
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {PRODUCER_NAV.map((item) => {
            const active =
              pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex min-h-[44px] items-center rounded-full px-3.5 py-2 text-sm transition-colors',
                    active
                      ? 'font-semibold text-accent-cyan'
                      : 'text-mk-text-secondary hover:text-accent-cyan',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/work/skyhaven"
            className="hidden min-h-[44px] items-center rounded-full px-3 py-2 text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan sm:flex"
          >
            Work
          </Link>
          <a
            href={buildHireMailto(MAILTO_SUBJECTS.producer)}
            className="btn-solid flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium"
          >
            Email
          </a>
        </div>
      </GlassPanel>

      <ul className="mx-auto mt-2 flex max-w-7xl flex-wrap justify-center gap-1 md:hidden">
        {PRODUCER_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="theme-chip inline-flex min-h-[36px] items-center rounded-full px-3 py-1.5 text-xs font-medium text-mk-text-secondary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
