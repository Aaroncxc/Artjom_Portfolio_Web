'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { DADB_CLIENT_LOGOS, type ClientLogo } from '@/lib/clientLogos';

function LogoItem({
  logo,
  size = 'md',
  nameOnly = false,
}: {
  logo: ClientLogo;
  size?: 'md' | 'lg';
  /** Export carousel: name without duplicate wordmark text */
  nameOnly?: boolean;
}) {
  const large = size === 'lg';
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'group/logo theme-card inline-flex shrink-0 items-center border transition-colors',
        'hover:border-accent-cyan/40 hover:bg-[color:var(--surface-card-strong)]',
        nameOnly
          ? 'h-full w-full justify-center gap-0 rounded-2xl px-4 py-5'
          : large
            ? 'gap-3.5 rounded-2xl px-5 py-3.5 sm:gap-4 sm:px-6 sm:py-4'
            : 'gap-3 px-5 h-12 sm:h-14 sm:px-6 rounded-xl',
      )}
    >
      {nameOnly ? (
        <span className="intro-ink text-center text-[36px] font-semibold leading-tight tracking-tight">
          {logo.name}
        </span>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt=""
            aria-hidden
            className={clsx(
              'w-auto object-contain object-left opacity-80 grayscale-[0.35] transition-[opacity,filter] duration-300',
              'group-hover/logo:opacity-100 group-hover/logo:grayscale-0',
              'dark:opacity-75 dark:invert dark:group-hover/logo:opacity-100',
              large
                ? 'h-9 max-w-[11rem] sm:h-11 sm:max-w-[14rem]'
                : 'h-7 max-w-[11rem] sm:h-8 sm:max-w-[13rem]',
            )}
          />
          <span
            className={clsx(
              'intro-ink font-semibold tracking-tight whitespace-nowrap',
              large ? 'text-base sm:text-lg' : 'text-xs sm:text-sm',
            )}
          >
            {logo.name}
          </span>
        </>
      )}
    </a>
  );
}

function MarqueeRow({
  logos,
  reverse,
  paused,
  staticMode,
  size,
}: {
  logos: ClientLogo[];
  reverse?: boolean;
  paused?: boolean;
  staticMode?: boolean;
  size?: 'md' | 'lg';
}) {
  const track = [...logos, ...logos];

  if (staticMode) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2.5 px-1 sm:gap-3">
        {logos.map((logo) => (
          <LogoItem key={logo.id} logo={logo} size={size} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div
        className={clsx(
          'client-logo-track flex w-max items-center gap-2.5 sm:gap-3',
          reverse ? 'client-logo-track-reverse' : 'client-logo-track-forward',
          paused && 'client-logo-track-paused',
        )}
      >
        {track.map((logo, i) => (
          <LogoItem key={`${logo.id}-${i}`} logo={logo} size={size} />
        ))}
      </div>
    </div>
  );
}

type ClientLogoMarqueeProps = {
  /** Bigger chips with visible names — for intro slide */
  prominent?: boolean;
  /** Hide the section header (intro supplies its own) */
  bare?: boolean;
  /** LinkedIn export: static 2-col name grid, no marquee */
  staticGrid?: boolean;
  className?: string;
};

export function ClientLogoMarquee({
  prominent = false,
  bare = false,
  staticGrid = false,
  className,
}: ClientLogoMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const rowA = DADB_CLIENT_LOGOS;
  const rowB = [...DADB_CLIENT_LOGOS].reverse();
  const size = prominent ? 'lg' : 'md';

  if (staticGrid) {
    return (
      <div
        className={clsx(
          'grid h-full grid-cols-2 content-stretch gap-3.5',
          className,
        )}
      >
        {DADB_CLIENT_LOGOS.map((logo) => (
          <LogoItem key={logo.id} logo={logo} size={size} nameOnly />
        ))}
      </div>
    );
  }

  const tracks = (
    <div
      className={clsx(
        'space-y-3 overflow-hidden sm:space-y-3.5',
        !bare &&
          'theme-card rounded-3xl border py-3 shadow-[var(--glass-shadow)] sm:py-4',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <MarqueeRow
        logos={rowA}
        paused={paused}
        staticMode={reduceMotion}
        size={size}
      />
      {!reduceMotion ? (
        <MarqueeRow logos={rowB} reverse paused={paused} size={size} />
      ) : null}
    </div>
  );

  if (bare) return tracks;

  return (
    <section
      id="partners"
      data-nav-key="partners"
      className="relative z-10 px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-6"
      aria-label="Partners delivered with at DADB"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 max-w-2xl sm:mb-6">
          <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
            Delivered with / at DADB
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-mk-text sm:text-2xl brand-tight">
            Universities and industry partners
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mk-text-secondary sm:text-base">
            Production for higher-education and industry partners of the German
            Academy of Digital Education — not a freelance client roster.
          </p>
        </div>
        {tracks}
      </div>
    </section>
  );
}
