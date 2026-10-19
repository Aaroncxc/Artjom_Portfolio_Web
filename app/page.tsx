'use client';

import { useEffect, useState } from 'react';
import { V3WorkflowDiagram } from '@/components/V3WorkflowDiagram';
import { getV3Content, type CaseStudy, type Locale, type Media, type PortfolioContent } from '@/lib/v3Content';

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

function Case({ c, big, ui, locale }: { c: CaseStudy; big?: boolean; ui: PortfolioContent['ui']; locale: Locale }) {
  return (
    <article id={c.id} className="grid gap-8 border-t border-neutral-200 py-14 md:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-mono text-xs text-neutral-400">
          {c.index} · {c.kicker}
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
          <div key={i} className={i === 0 ? 'sm:col-span-2' : ''}>
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

  return (
    <main className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm">
          <span className="font-semibold">{contact.name}</span>
          <div className="flex flex-wrap items-center gap-4 text-neutral-500 sm:gap-6">
            <a href="#work">{ui.work}</a>
            <a href="#cases">{ui.cases}</a>
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

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">{hero.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">{hero.headline}</h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600">{hero.sub}</p>
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
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-5">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.selectedWork}</h2>
        {featured.map((c) => (
          <Case key={c.id} c={c} big ui={ui} locale={locale} />
        ))}
      </section>

      <section id="cases" className="mx-auto max-w-6xl px-6 pt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">{ui.casesHeading}</h2>
        {cases.map((c) => (
          <Case key={c.id} c={c} ui={ui} locale={locale} />
        ))}
      </section>

      <section id="about" className="mx-auto grid max-w-6xl gap-10 border-t border-neutral-200 px-6 py-16 md:grid-cols-2">
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

      <footer id="contact" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
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
