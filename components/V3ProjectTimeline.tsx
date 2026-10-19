'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/v3Content';

export type TimelineNavItem = {
  id: string;
  periodLabel: string;
  year: number | 'tbd';
};

type Props = {
  items: TimelineNavItem[];
  activeId: string | null;
  progress: number;
  locale: Locale;
  onJump: (id: string) => void;
};

export function V3ProjectTimeline({ items, activeId, progress, locale, onJump }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <>
      {/* Mobile: horizontal date strip */}
      <div className="sticky top-[3.25rem] z-[9] -mx-8 border-b border-neutral-200 bg-white/95 px-8 py-2 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 sm:-mx-10 sm:px-10 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onJump(item.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400'
                }`}
              >
                {item.periodLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: sticky vertical timeline */}
      <nav
        className="relative hidden w-full shrink-0 lg:block"
        aria-label={locale === 'de' ? 'Projekt-Timeline' : 'Project timeline'}
      >
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <div className="relative ml-3 border-l border-neutral-200 dark:border-neutral-700">
            <div
              className="absolute left-0 top-0 w-px origin-top bg-neutral-900 transition-[height] duration-300 ease-out dark:bg-neutral-100"
              style={{
                height: `${clamped * 100}%`,
                transition: reduceMotion ? 'none' : undefined,
              }}
              aria-hidden
            />
            <ol className="space-y-6 py-1 pl-4">
              {items.map((item, i) => {
                const active = item.id === activeId;
                const showYear =
                  i === 0 || items[i - 1]!.year !== item.year;
                return (
                  <li key={item.id} className="relative">
                    {showYear && (
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {item.year === 'tbd' ? (locale === 'de' ? 'TBD' : 'TBD') : item.year}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => onJump(item.id)}
                      className={`group flex w-full flex-col items-start text-left transition-opacity ${
                        active ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className="absolute -left-[1.0625rem] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-950">
                        <span
                          className={`h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 ${
                            active && !reduceMotion ? 'scale-125 animate-pulse' : active ? 'scale-125' : 'scale-100'
                          } transition-transform`}
                        />
                      </span>
                      <span
                        className={`font-mono text-[11px] leading-snug ${
                          active ? 'font-semibold text-neutral-900 dark:text-neutral-50' : 'text-neutral-500 dark:text-neutral-400'
                        } ${item.periodLabel === 'TBD' ? 'rounded border border-dashed border-amber-400/80 px-1 text-amber-700 dark:border-amber-600 dark:text-amber-400' : ''}`}
                      >
                        {item.periodLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </nav>
    </>
  );
}
