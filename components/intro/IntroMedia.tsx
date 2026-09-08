'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { isExternalHref } from '@/lib/toolLinks';
import { pick, type IntroLang, type IntroMediaItem } from '@/lib/introCopy';

type IntroMediaProps = {
  media: IntroMediaItem;
  lang: IntroLang;
  className?: string;
  /** Aspect ratio class; omit when using fillHeight */
  aspect?: string;
  /** Fill parent height (parent must have defined height / min-h-0 flex) */
  fillHeight?: boolean;
  priority?: boolean;
  sizes?: string;
  frame?: 'light' | 'dark' | 'none';
  objectFit?: 'cover' | 'contain';
};

export function IntroMedia({
  media,
  lang,
  className,
  aspect = 'aspect-[16/10]',
  fillHeight,
  priority,
  sizes = '(min-width: 1024px) 640px, 92vw',
  frame = 'light',
  objectFit = 'cover',
}: IntroMediaProps) {
  const [failed, setFailed] = useState(false);
  const alt = pick(media.alt, lang);

  const frameClass =
    frame === 'dark'
      ? 'bg-[#0b0d12] ring-1 ring-white/10'
      : frame === 'none'
        ? ''
        : 'bg-mk-bg-2 ring-1 ring-[color:var(--surface-border)]';

  const inner = (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl',
        fillHeight ? 'h-full min-h-0 w-full' : aspect,
        frameClass,
        className,
      )}
    >
      {!failed ? (
        <Image
          src={media.src}
          alt={alt}
          fill
          priority={priority}
          quality={90}
          sizes={sizes}
          className={clsx(
            objectFit === 'contain' ? 'object-contain' : 'object-cover',
          )}
          style={media.focus ? { objectPosition: media.focus } : undefined}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,184,166,0.12)] to-[rgba(167,139,250,0.1)]" />
      )}
    </div>
  );

  if (!media.href) return inner;

  const wrapClass = fillHeight ? 'block h-full min-h-0' : 'block';

  if (isExternalHref(media.href)) {
    return (
      <a
        href={media.href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(wrapClass, 'transition-opacity hover:opacity-95')}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={media.href}
      className={clsx(wrapClass, 'transition-opacity hover:opacity-95')}
    >
      {inner}
    </Link>
  );
}

/** Shared slide shell: padded content area under chrome — no vertical scroll on laptop */
export function IntroSlideShell({
  children,
  className,
  fullBleed,
}: {
  children: React.ReactNode;
  className?: string;
  fullBleed?: boolean;
}) {
  return (
    <div
      data-intro-shell
      className={clsx(
        'flex h-full min-h-0 w-full flex-col overflow-hidden',
        fullBleed
          ? 'justify-stretch px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 [[data-export=1]_&]:justify-stretch [[data-export=1]_&]:px-12 [[data-export=1]_&]:pb-14 [[data-export=1]_&]:pt-14'
          : 'mx-auto max-w-7xl justify-start px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 [[data-export=1]_&]:max-w-none [[data-export=1]_&]:px-12 [[data-export=1]_&]:pb-14 [[data-export=1]_&]:pt-14',
        className,
      )}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-start overflow-hidden [[data-export=1]_&]:justify-between">
        {children}
      </div>
    </div>
  );
}

/** Two fixed heading slots: kicker + title — same vertical rhythm on every slide. */
export function IntroSlideHeader({
  kicker,
  title,
  dark,
  strong,
  className,
}: {
  kicker: React.ReactNode;
  title: React.ReactNode;
  dark?: boolean;
  strong?: boolean;
  className?: string;
}) {
  return (
    <header className={clsx('shrink-0', className)}>
      <div className="flex h-5 items-end sm:h-6 [[data-export=1]_&]:h-8">
        <IntroKicker dark={dark} strong={strong} className="mb-0">
          {kicker}
        </IntroKicker>
      </div>
      <div className="mt-2 flex min-h-[2.5rem] items-start sm:min-h-[3.15rem] lg:min-h-[3.8rem] [[data-export=1]_&]:mt-3 [[data-export=1]_&]:min-h-0">
        <IntroTitle dark={dark} balanced className="w-full">
          {title}
        </IntroTitle>
      </div>
    </header>
  );
}

export function IntroKicker({
  children,
  dark,
  className,
  strong,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  /** Slightly stronger contrast (e.g. Path slide under chrome). */
  strong?: boolean;
}) {
  return (
    <span
      className={clsx(
        'mb-2 inline-block text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-[11px] [[data-export=1]_&]:text-[28px] [[data-export=1]_&]:tracking-[0.16em]',
        dark
          ? 'text-white/55'
          : strong
            ? 'intro-ink-secondary'
            : 'intro-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function IntroTitle({
  children,
  dark,
  className,
  balanced,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  /** Softer tracking + wrap-friendly for long titles. */
  balanced?: boolean;
}) {
  return (
    <h1
      className={clsx(
        'intro-ink font-semibold leading-[1.05]',
        balanced
          ? 'break-words text-balance tracking-tight'
          : 'brand-tight tracking-tight',
        dark && 'text-white',
        'text-2xl sm:text-3xl lg:text-4xl [[data-export=1]_&]:text-[64px] [[data-export=1]_&]:leading-[1.06]',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function IntroBody({
  children,
  dark,
  className,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        'intro-ink-secondary mt-2.5 max-w-2xl text-sm leading-relaxed sm:mt-3 sm:text-base [[data-export=1]_&]:mt-5 [[data-export=1]_&]:max-w-none [[data-export=1]_&]:text-[36px] [[data-export=1]_&]:leading-[1.28]',
        dark && 'text-white/75',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function IntroBullets({
  items,
  lang,
  dark,
}: {
  items: LocalizedBullet[];
  lang: IntroLang;
  dark?: boolean;
}) {
  return (
    <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2 [[data-export=1]_&]:mt-6 [[data-export=1]_&]:space-y-5">
      {items.map((b, i) => (
        <li
          key={i}
          className={clsx(
            'intro-ink-secondary flex gap-2.5 text-sm leading-snug sm:leading-relaxed [[data-export=1]_&]:gap-4 [[data-export=1]_&]:text-[34px] [[data-export=1]_&]:leading-[1.22]',
            dark && 'text-white/70',
          )}
        >
          <span
            className={clsx(
              'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full [[data-export=1]_&]:mt-3.5 [[data-export=1]_&]:h-3.5 [[data-export=1]_&]:w-3.5',
              dark
                ? 'bg-accent-cyan shadow-[0_0_0_3px_rgba(20,184,166,0.25)]'
                : 'bg-accent-cyan shadow-[0_0_0_3px_rgba(20,184,166,0.22)]',
            )}
            aria-hidden
          />
          <span>{pick(b, lang)}</span>
        </li>
      ))}
    </ul>
  );
}

type LocalizedBullet = Record<IntroLang, string>;
