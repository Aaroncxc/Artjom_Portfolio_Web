'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { V3BlueprintStats } from '@/components/V3BlueprintStats';
import { V3ProjectTimeline } from '@/components/V3ProjectTimeline';
import { V3WorkflowDiagram } from '@/components/V3WorkflowDiagram';
import { getV3Content, type CaseStudy, type Locale, type Media, type PortfolioContent } from '@/lib/v3Content';
import { buildTimelineCases, groupCasesByYear, periodGroupYear } from '@/lib/v3Timeline';

const LOCALE_KEY = 'portfolio-v3-locale';
const PAGE = 'mx-auto w-full max-w-7xl px-8 sm:px-10 lg:px-12';

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

function MediaItem({ m, locale }: { m: Media; locale: Locale }) {
  if (m.kind === 'workflow') return <V3WorkflowDiagram variant={m.variant} locale={locale} />;
  if (m.kind === 'video')
    return (
      <video
        className="aspect-video w-full rounded-lg border border-neutral-200 object-cover"
        src={m.src}
        poster={m.poster}
        muted
        loop
        playsInline
        autoPlay
        aria-label={m.alt}
      />
    );
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      className="aspect-video w-full rounded-lg border border-neutral-200 object-cover"
      src={m.src}
      alt={m.alt}
      loading="lazy"
    />
  );
}

function Case({
  c,
  big,
  ui,
  locale,
  periodLabel,
}: {
  c: CaseStudy;
  big?: boolean;
  ui: PortfolioContent['ui'];
  locale: Locale;
  periodLabel: string;
}) {
  const tbd = periodLabel === 'TBD' || periodLabel.includes('– TBD');
  return (
    <article
      id={c.id}
      className="scroll-mt-28 grid gap-8 border-t border-neutral-200 py-14 dark:border-neutral-800 md:grid-cols-[1fr_1.2fr]"
    >
      <div>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
          {c.index} · {c.kicker}
        </p>
        <p
          className={`mt-1 font-mono text-xs ${
            tbd
              ? 'inline-block rounded border border-dashed border-amber-400/80 px-1.5 py-0.5 text-amber-700 dark:border-amber-600 dark:text-amber-400'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {periodLabel}
        </p>
        <h3 className={`mt-3 font-semibold tracking-tight text-neutral-900 ${big ? 'text-3xl' : 'text-2xl'}`}>{c.title}</h3>
        <p className="mt-4 text-neutral-600">{c.summary}</p>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="font-mono text-xs uppercase text-neutral-400">{ui.whatIDid}</dt>
            <dd>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-700">
                {c.action.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase text-neutral-400">{ui.result}</dt>
            <dd>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-900">
                {c.result.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {c.tools.map((t) => (
            <span key={t} className="rounded border border-neutral-200 px-2 py-0.5 font-mono text-xs text-neutral-500">
              {t}
            </span>
          ))}
        </div>
        {c.links && (
          <div className="mt-5 flex gap-4 text-sm">
            {c.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-neutral-900 underline underline-offset-4">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
        {c.note && <p className="mt-4 text-xs text-neutral-400">{c.note}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {c.media.map((m, i) => (
          <div key={i} className={i === 0 || m.kind === 'workflow' ? 'sm:col-span-2' : ''}>
            <MediaItem m={m} locale={locale} />
          </div>
        ))}
      </div>
    </article>
  );
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
        <nav className={`flex flex-wrap items-center justify-between gap-3 py-4 text-sm ${PAGE}`}>
          <span className="font-semibold">{contact.name}</span>
          <div className="flex flex-wrap items-center gap-4 text-neutral-500 sm:gap-6">
            <a href="#work">{ui.work}</a>
            <a href="#work">{ui.cases}</a>
            <a href="#about">{ui.about}</a>
            <a href="#contact" className="text-neutral-900">
              {ui.contact}
            </a>
            <div className="flex rounded-md border border-neutral-200 p-0.5 text-xs font-medium" role="group" aria-label="Language">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`rounded px-2 py-1 ${locale === 'en' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                {ui.langEn}
              </button>
              <button
                type="button"
                onClick={() => setLocale('de')}
                className={`rounded px-2 py-1 ${locale === 'de' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                {ui.langDe}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <section className={`pb-16 pt-24 ${PAGE}`}>
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{hero.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">
          {hero.headline}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400 md:max-w-4xl md:text-lg">
          {hero.sub}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {hero.roles.map((r) => (
            <span key={r} className="rounded-full border border-neutral-300 px-3 py-1 text-sm">
              {r}
            </span>
          ))}
        </div>
        <div className="mt-8 flex gap-3 text-sm">
          <a href="#contact" className="rounded-md bg-neutral-900 px-4 py-2 text-white">
            {hero.ctaPrimary}
          </a>
          <a href="#work" className="rounded-md border border-neutral-300 px-4 py-2">
            {hero.ctaSecondary}
          </a>
        </div>
        <V3BlueprintStats stats={stats} />
      </section>

      <section id="work" className={`pt-4 ${PAGE}`}>
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{ui.casesHeading}</h2>
        <div className="mt-6 lg:grid lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[11rem_minmax(0,1fr)]">
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
                  <Case
                    key={c.id}
                    c={c}
                    big={featuredIds.has(c.id)}
                    ui={ui}
                    locale={locale}
                    periodLabel={c.periodLabel}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={`grid gap-10 border-t border-neutral-200 py-16 dark:border-neutral-800 md:grid-cols-2 ${PAGE}`}>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.howIWork}</h2>
          <ul className="mt-4 space-y-3 text-neutral-700">
            {strengths.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.background}</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            <li>{contact.education}</li>
            <li>{contact.cert}</li>
            <li>{contact.languages}</li>
            <li>{contact.toolsLine}</li>
          </ul>
          <h2 className="mt-8 font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.alsoBuilding}</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">
            {more.map((m) => (
              <li key={m.title}>
                <span className="font-medium text-neutral-900">
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
        <div className={`py-16 ${PAGE}`}>
          <h2 className="text-3xl font-semibold tracking-tight">{ui.footerHeadline}</h2>
          <div className="mt-6 flex flex-wrap gap-6 text-neutral-700">
            <a href={contact.phoneHref}>{contact.phone}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>{contact.location}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
