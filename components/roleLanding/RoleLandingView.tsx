import Link from 'next/link';
import Image from 'next/image';
import type { RoleLanding } from '@/lib/roleLandings';
import { buildHireMailto } from '@/lib/contact';
import { isExternalHref } from '@/lib/toolLinks';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { GlassPanel } from '@/components/GlassPanel';
import { ThemeToggle } from '@/components/ThemeToggle';

interface RoleLandingViewProps {
  landing: RoleLanding;
}

function CaseCard({ title, summary, href, image, tag }: RoleLanding['cases'][number]) {
  const external = isExternalHref(href);
  const inner = (
    <>
      {image ? (
        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-mk-bg-2">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      {tag ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-cyan">
          {tag}
        </p>
      ) : null}
      <h3 className="text-lg font-semibold tracking-tight text-mk-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mk-text-secondary">{summary}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-accent-cyan">
        View case {external ? '↗' : '→'}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-2xl outline-offset-4 transition-transform duration-200 hover:-translate-y-0.5"
      >
        <GlassPanel padding="lg" className="h-full">
          {inner}
        </GlassPanel>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="block h-full rounded-2xl outline-offset-4 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <GlassPanel padding="lg" hover className="h-full">
        {inner}
      </GlassPanel>
    </Link>
  );
}

export function RoleLandingView({ landing }: RoleLandingViewProps) {
  const mailto = landing.mailtoSubject
    ? buildHireMailto(landing.mailtoSubject)
    : landing.cta.href;

  return (
    <div className="relative min-h-screen">
      <LightLeaksBackground />

      <header className="fixed inset-x-0 top-4 z-50 px-5 sm:top-6 sm:px-8">
        <GlassPanel
          variant="heavy"
          padding="none"
          className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2 sm:rounded-3xl sm:px-5 sm:py-2.5"
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-mk-text transition-colors hover:text-accent-cyan"
          >
            Artjom Naninjan
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/intro"
              className="hidden text-sm text-mk-text-secondary transition-colors hover:text-mk-text sm:inline"
            >
              2-min intro
            </Link>
            <ThemeToggle />
          </div>
        </GlassPanel>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <section className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-cyan">
            {landing.company} · Role landing
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-mk-text sm:text-4xl md:text-5xl">
            {landing.roleTitle}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mk-text-secondary sm:text-xl">
            {landing.headline}
          </p>

          {landing.skills?.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {landing.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-[color:var(--surface-border)] bg-[color:var(--surface-chip)] px-3 py-1 text-xs font-medium text-mk-text-secondary"
                >
                  {skill}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="mt-12 max-w-2xl">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
            Why this fit
          </h2>
          <ul className="mt-4 space-y-3">
            {landing.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 text-sm leading-relaxed text-mk-text-secondary sm:text-[15px]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" aria-hidden />
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
                Selected work
              </h2>
              <p className="mt-2 text-sm text-mk-text-secondary">
                Three cases curated for {landing.company}.
              </p>
            </div>
            <Link href="/?skipHero=true" className="text-sm font-medium text-accent-cyan hover:underline">
              Full portfolio →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {landing.cases.map((caseItem) => (
              <CaseCard key={caseItem.href} {...caseItem} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <GlassPanel padding="lg" className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
              Next step
            </p>
            <p className="mt-3 text-base leading-relaxed text-mk-text-secondary">
              Interested in {landing.roleTitle} at {landing.company}? I&apos;d love to walk through
              these cases and how they map to your team.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={landing.cta.href}
                className="inline-flex min-h-[44px] items-center rounded-full bg-[color:var(--btn-solid-bg)] px-6 text-sm font-semibold text-[color:var(--btn-solid-fg)] transition-opacity hover:opacity-90"
              >
                {landing.cta.label}
              </a>
              <a
                href={mailto}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--surface-border)] px-6 text-sm font-medium text-mk-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
              >
                Email me
              </a>
            </div>
          </GlassPanel>
        </section>
      </main>
    </div>
  );
}
