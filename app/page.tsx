'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { V3CaseCard } from '@/components/V3CaseCard';
import { V3IndiaJourneyChapter } from '@/components/V3IndiaJourneyChapter';
import { V3Hero } from '@/components/V3Hero';
import { V3ProjectTimeline } from '@/components/V3ProjectTimeline';
import { getV3Content, type Locale } from '@/lib/v3Content';
import { V3_PAGE } from '@/lib/v3Layout';
import { buildTimelineCases, groupCasesByYear, periodGroupYear } from '@/lib/v3Timeline';

const LOCALE_KEY = 'portfolio-v3-locale';

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'de';
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
  } catch {
    /* ignore */
  }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export default function Page() {
  const [locale, setLocale] = useState<Locale>('de');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocale(readInitialLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale;
  }, [locale, ready]);

  const content = getV3Content(locale);
  const { contact, hero, stats, ui, featured, cases, strengths, more } = content;

  const timelineCases = useMemo(() => buildTimelineCases(featured, cases, locale), [locale]);
  const yearGroups = useMemo(() => groupCasesByYear(timelineCases, locale), [timelineCases, locale]);
  const featuredIds = useMemo(() => new Set(featured.map((c) => c.id)), [featured]);

  const timelineNav = useMemo(
    () =>
      timelineCases.map((c) => ({
        id: c.id,
        periodLabel: c.periodLabel,
        year: periodGroupYear(c.period),
      })),
    [timelineCases],
  );

  const [activeId, setActiveId] = useState<string | null>(timelineCases[0]?.id ?? null);

  useEffect(() => {
    const nodes = timelineCases.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActiveId(hit.target.id);
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0, 0.15, 0.4, 0.7] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [timelineCases]);

  const progress = useMemo(() => {
    if (!activeId || timelineNav.length < 2) return 0;
    const idx = timelineNav.findIndex((i) => i.id === activeId);
    return idx <= 0 ? 0 : idx / (timelineNav.length - 1);
  }, [activeId, timelineNav]);

  const jumpToCase = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <nav className={`flex flex-wrap items-center justify-between gap-3 py-4 text-sm ${V3_PAGE}`}>
          <span className="font-semibold">{contact.name}</span>
          <div className="flex flex-wrap items-center gap-4 text-neutral-500 sm:gap-6">
            <a href="#work">{ui.work}</a>
            <a href="#work">{ui.cases}</a>
            <a href="#about">{ui.about}</a>
            <a href="#contact" className="text-neutral-900 dark:text-neutral-100">
              {ui.contact}
            </a>
            <div className="flex rounded-md border border-neutral-200 p-0.5 text-xs font-medium dark:border-neutral-700" role="group" aria-label="Language">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`rounded px-2 py-1 ${locale === 'en' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'}`}
              >
                {ui.langEn}
              </button>
              <button
                type="button"
                onClick={() => setLocale('de')}
                className={`rounded px-2 py-1 ${locale === 'de' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'}`}
              >
                {ui.langDe}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <V3Hero locale={locale} hero={hero} stats={stats} />

      <section id="work" className={`pt-4 ${V3_PAGE}`}>
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{ui.casesHeading}</h2>
        <div className="mt-6 lg:grid lg:grid-cols-[11.25rem_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[12.5rem_minmax(0,1fr)] xl:gap-x-10">
          <V3ProjectTimeline
            items={timelineNav}
            activeId={activeId}
            progress={progress}
            locale={locale}
            onJump={jumpToCase}
          />
          <div id="work-timeline" className="min-w-0">
            {yearGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <h3 className="sticky top-[3.25rem] z-[8] -mx-1 mb-2 border-b border-neutral-100 bg-white/90 py-3 font-mono text-sm font-medium tracking-tight text-neutral-900 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90 dark:text-neutral-100 lg:top-28 lg:static lg:border-0 lg:bg-transparent lg:py-0 lg:text-xs lg:uppercase lg:tracking-wider lg:text-neutral-400">
                  {group.label}
                </h3>
                {group.cases.map((c) => (
                  <div key={c.id}>
                    <V3CaseCard
                      c={c}
                      big={featuredIds.has(c.id)}
                      locale={locale}
                      periodLabel={c.periodLabel}
                      allMedia={c.media}
                    />
                    {c.id === 'production' && <V3IndiaJourneyChapter locale={locale} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={`grid gap-10 border-t border-neutral-200 py-16 dark:border-neutral-800 md:grid-cols-2 ${V3_PAGE}`}>
        <div className="max-w-[65ch]">
          <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.howIWork}</h2>
          <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
            {strengths.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </div>
        <div className="max-w-[65ch]">
          <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.background}</h2>
          <ul className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>{contact.education}</li>
            <li>{contact.cert}</li>
            <li>{contact.languages}</li>
            <li>{contact.toolsLine}</li>
          </ul>
          <h2 className="mt-8 font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.alsoBuilding}</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            {more.map((m) => (
              <li key={m.title}>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {m.href ? (
                    <a href={m.href} className="underline underline-offset-4" target="_blank" rel="noreferrer">
                      {m.title}
                    </a>
                  ) : (
                    m.title
                  )}
                </span>{' '}
                — {m.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer id="contact" className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className={`py-16 ${V3_PAGE}`}>
          <h2 className="text-3xl font-semibold tracking-tight">{ui.footerHeadline}</h2>
          <div className="mt-6 flex flex-wrap gap-6 text-neutral-700 dark:text-neutral-300">
            <a href={contact.phoneHref}>{contact.phone}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>{contact.location}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
