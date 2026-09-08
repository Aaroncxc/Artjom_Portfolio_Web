'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { ClientLogoMarquee } from '@/components/ClientLogoMarquee';
import {
  IntroBody,
  IntroBullets,
  IntroMedia,
  IntroSlideHeader,
  IntroSlideShell,
} from '@/components/intro/IntroMedia';
import {
  pick,
  type ChipItem,
  type IntroLang,
  type IntroSlideDef,
  type ProjectCard,
} from '@/lib/introCopy';
import { isExternalHref } from '@/lib/toolLinks';
import { buildHireMailto } from '@/lib/contact';

type LayoutProps = {
  slide: IntroSlideDef;
  lang: IntroLang;
  exportMode?: boolean;
};

type AnchorRect = { top: number; left: number; bottom: number; right: number; width: number; height: number };

function CardLink({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function MetaPill({ text }: { text: string }) {
  return (
    <span className="theme-card intro-ink-muted shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
      {text}
    </span>
  );
}

/** Shared toolkit chips — `prominent` = larger icons (Built). Outer card only when boxed. */
function ToolLogoRow({
  chips,
  lang,
  label,
  prominent,
  boxed,
  interactive,
  activeChipKey,
  onHover,
  onSelect,
  onLeave,
}: {
  chips: ChipItem[];
  lang: IntroLang;
  label?: string;
  prominent?: boolean;
  /** Bring-slide: wrap in theme card. Built: false — logos only. */
  boxed?: boolean;
  interactive?: boolean;
  activeChipKey?: string | null;
  onHover?: (previewId: string, chipKey: string, rect: AnchorRect) => void;
  onSelect?: (previewId: string, chipKey: string, rect: AnchorRect) => void;
  onLeave?: () => void;
}) {
  const rectFrom = (el: HTMLElement): AnchorRect => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      left: r.left,
      bottom: r.bottom,
      right: r.right,
      width: r.width,
      height: r.height,
    };
  };

  return (
    <div
      className={clsx(
        'shrink-0 [[data-export=1]_&]:shrink',
        boxed &&
          'theme-card-strong rounded-2xl border p-3 shadow-[var(--glass-shadow)] sm:rounded-[20px] sm:p-4',
      )}
    >
      {label ? (
        <h3
          className={clsx(
            'intro-ink-muted font-semibold uppercase tracking-[0.22em]',
            prominent
              ? 'mb-2.5 text-[10px] sm:mb-3 sm:text-[11px] [[data-export=1]_&]:mb-5 [[data-export=1]_&]:text-[24px]'
              : 'mb-3 text-[10px] sm:text-[11px] [[data-export=1]_&]:mb-5 [[data-export=1]_&]:text-[24px]',
          )}
        >
          {label}
        </h3>
      ) : null}
      <ul className="flex flex-wrap gap-1.5 sm:gap-2 [[data-export=1]_&]:gap-3">
        {chips.map((chip) => {
          const chipKey = pick(chip.label, 'en');
          const previewId = chip.previewId;
          const isActive =
            interactive && !!activeChipKey && activeChipKey === chipKey;
          const chipClass = clsx(
            'theme-card intro-ink-secondary inline-flex max-w-full items-center border font-medium transition-colors',
            prominent
              ? 'gap-2.5 rounded-xl px-3 py-2 text-sm sm:gap-3 sm:rounded-2xl sm:px-3.5 sm:py-2.5 sm:text-[15px] [[data-export=1]_&]:gap-3 [[data-export=1]_&]:rounded-2xl [[data-export=1]_&]:px-4 [[data-export=1]_&]:py-3 [[data-export=1]_&]:text-[28px]'
              : 'gap-2 rounded-full px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm [[data-export=1]_&]:gap-3 [[data-export=1]_&]:rounded-2xl [[data-export=1]_&]:px-4 [[data-export=1]_&]:py-3 [[data-export=1]_&]:text-[28px]',
            interactive &&
              'cursor-pointer hover:border-accent-cyan/50 hover:text-[color:var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan',
            isActive &&
              '!border-accent-cyan !bg-[color:var(--surface-card-strong)] !text-[color:var(--text-primary)]',
          );
          const inner = (
            <>
              {chip.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={chip.icon}
                  alt=""
                  width={prominent ? 28 : 16}
                  height={prominent ? 28 : 16}
                  className={clsx(
                    'shrink-0 object-contain',
                    prominent
                      ? 'h-7 w-7 sm:h-8 sm:w-8 [[data-export=1]_&]:h-10 [[data-export=1]_&]:w-10'
                      : 'h-4 w-4 [[data-export=1]_&]:h-10 [[data-export=1]_&]:w-10',
                  )}
                />
              ) : (
                <span
                  className={clsx(
                    'shrink-0 rounded-full bg-accent-cyan',
                    prominent ? 'h-2 w-2' : 'h-1.5 w-1.5',
                  )}
                  aria-hidden
                />
              )}
              {pick(chip.label, lang)}
            </>
          );

          return (
            <li key={chipKey}>
              {interactive && previewId ? (
                <button
                  type="button"
                  className={chipClass}
                  aria-pressed={isActive}
                  aria-haspopup="dialog"
                  onMouseEnter={(e) =>
                    onHover?.(previewId, chipKey, rectFrom(e.currentTarget))
                  }
                  onFocus={(e) =>
                    onHover?.(previewId, chipKey, rectFrom(e.currentTarget))
                  }
                  onClick={(e) =>
                    onSelect?.(previewId, chipKey, rectFrom(e.currentTarget))
                  }
                  onMouseLeave={() => onLeave?.()}
                  onBlur={() => onLeave?.()}
                >
                  {inner}
                </button>
              ) : (
                <span className={chipClass}>{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Compact project tile — image flexes within remaining height */
function ProjectTile({
  card,
  lang,
  featured,
  textOnly,
  compact,
  dense,
}: {
  card: ProjectCard;
  lang: IntroLang;
  featured?: boolean;
  textOnly?: boolean;
  compact?: boolean;
  /** Tighter copy for Built gallery under the logo row */
  dense?: boolean;
}) {
  return (
    <CardLink
      href={card.href}
      className={clsx(
        'theme-card group flex min-h-0 flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors',
        card.href &&
          'hover:border-[rgba(20,184,166,0.35)] hover:bg-[color:var(--surface-card-strong)]',
        featured || compact ? 'h-full' : '',
      )}
    >
      {card.thumb && !textOnly ? (
        <div
          className={clsx(
            'relative w-full shrink-0 overflow-hidden bg-mk-bg-2',
            featured
              ? 'min-h-0 flex-1 basis-0'
              : compact
                ? 'min-h-0 flex-[1.2] basis-0'
                : 'aspect-[16/10] max-h-[28vh]',
          )}
        >
          <Image
            src={card.thumb}
            alt=""
            fill
            quality={90}
            sizes={
              featured
                ? '(min-width: 1024px) 50vw, 92vw'
                : '(min-width: 1024px) 50vw, 48vw'
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div
        className={clsx(
          'flex shrink-0 flex-col',
          dense
            ? 'p-2 sm:p-2.5'
            : compact || featured
              ? 'p-2.5 sm:p-3'
              : 'p-3 sm:p-4',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3
            className={clsx(
              'intro-ink font-semibold tracking-tight',
              dense
                ? 'text-xs sm:text-sm'
                : featured
                  ? 'text-base sm:text-lg'
                  : 'text-sm sm:text-base',
            )}
          >
            {pick(card.title, lang)}
          </h3>
          {card.meta ? <MetaPill text={pick(card.meta, lang)} /> : null}
        </div>
        <p
          className={clsx(
            'intro-ink-secondary mt-1 leading-snug',
            dense
              ? 'line-clamp-1 text-[11px] sm:text-xs'
              : compact
                ? 'line-clamp-2 text-xs'
                : 'text-xs sm:text-sm',
          )}
        >
          {pick(card.blurb, lang)}
        </p>
        {card.href ? (
          <span
            className={clsx(
              'font-semibold text-accent-cyan',
              dense ? 'mt-1 text-[10px]' : 'mt-1.5 text-[11px]',
            )}
          >
            {lang === 'de' ? 'Ansehen →' : 'View →'}
          </span>
        ) : null}
      </div>
    </CardLink>
  );
}

/* ─── Hero (cover) ─────────────────────────────────────────── */

export function HeroLayout({ slide, lang, exportMode }: LayoutProps) {
  const portrait = slide.media?.[0];

  if (exportMode) {
    return (
      <IntroSlideShell fullBleed className="relative overflow-hidden">
        <div className="relative z-10 flex h-full min-h-0 flex-col gap-5">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.heroChips?.length ? (
              <div className="mt-4 mb-1 flex flex-wrap gap-2.5">
                {slide.heroChips.map((c) => (
                  <span
                    key={pick(c, 'en')}
                    className="theme-chip intro-ink inline-flex items-center rounded-full border px-5 py-2.5 text-[26px] font-semibold"
                  >
                    {pick(c, lang)}
                  </span>
                ))}
              </div>
            ) : null}
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
            {slide.bullets?.length ? (
              <IntroBullets items={slide.bullets} lang={lang} />
            ) : null}
          </div>
          {portrait ? (
            <div className="flex min-h-0 w-full flex-1 items-stretch justify-center">
              <div className="relative h-full min-h-[420px] w-[68%] max-w-[720px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
                <Image
                  src={portrait.src}
                  alt={pick(portrait.alt, lang)}
                  fill
                  priority
                  quality={90}
                  sizes="720px"
                  className="object-cover"
                  style={{ objectPosition: portrait.focus ?? '50% 30%' }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell fullBleed className="relative overflow-hidden">
      <div className="relative z-10 mx-auto grid h-full min-h-0 max-w-7xl items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
        <div className="min-h-0">
          <IntroSlideHeader
            strong
            kicker={pick(slide.kicker, lang)}
            title={pick(slide.title, lang)}
          />
          {slide.heroChips?.length ? (
            <div className="mt-3 mb-1 flex flex-wrap gap-2">
              {slide.heroChips.map((c) => (
                <span
                  key={pick(c, 'en')}
                  className="theme-chip intro-ink inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                >
                  {pick(c, lang)}
                </span>
              ))}
            </div>
          ) : null}
          {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          {slide.bullets?.length ? (
            <IntroBullets items={slide.bullets} lang={lang} />
          ) : null}
        </div>
        {portrait ? (
          <div className="relative mx-auto h-full max-h-[min(52vh,420px)] w-full max-w-[220px] min-h-0 lg:max-w-[280px] lg:justify-self-end">
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
              <Image
                src={portrait.src}
                alt={pick(portrait.alt, lang)}
                fill
                priority
                quality={90}
                sizes="(min-width: 1024px) 420px, 280px"
                className="object-cover"
                style={{ objectPosition: portrait.focus ?? '50% 18%' }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <div className="text-sm font-semibold text-white">Artjom Naninjan</div>
                <div className="text-xs text-white/75">Berlin</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </IntroSlideShell>
  );
}

/* ─── Timeline (path) ──────────────────────────────────────── */

export function TimelineLayout({ slide, lang, exportMode }: LayoutProps) {
  const stops = slide.timeline ?? [];

  if (exportMode) {
    return (
      <IntroSlideShell>
        <div className="flex h-full min-h-0 flex-col gap-6">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          </div>

          <ol className="flex min-h-0 flex-1 flex-col justify-between gap-5 py-1">
            {stops.map((stop, i) => {
              const isFirst = i === 0;
              const isLast = i === stops.length - 1;
              return (
                <li
                  key={pick(stop.period, 'en')}
                  className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4"
                >
                  <div className="relative" aria-hidden>
                    {!isFirst ? (
                      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-[rgba(20,184,166,0.35)]" />
                    ) : null}
                    {!isLast ? (
                      <span className="absolute bottom-0 left-1/2 top-4 w-px -translate-x-1/2 bg-[rgba(20,184,166,0.35)]" />
                    ) : null}
                    <span className="relative z-10 mx-auto mt-2 block h-3 w-3 rounded-full border-2 border-accent-cyan bg-[color:var(--color-bg-1)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[28px] font-semibold uppercase tracking-[0.12em] text-accent-cyan">
                      {pick(stop.period, lang)}
                    </div>
                    <h3 className="intro-ink mt-1.5 text-[36px] font-semibold leading-tight tracking-tight">
                      {pick(stop.title, lang)}
                    </h3>
                    <p className="intro-ink-secondary mt-1.5 text-[30px] leading-snug">
                      {pick(stop.blurb, lang)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell>
      <div className="grid h-full min-h-0 items-stretch gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
        <div className="flex min-h-0 flex-col gap-5">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          </div>

          <ol className="flex min-h-0 flex-col gap-4">
            {stops.map((stop, i) => {
              const isFirst = i === 0;
              const isLast = i === stops.length - 1;
              return (
                <li
                  key={pick(stop.period, 'en')}
                  className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3"
                >
                  <div className="relative" aria-hidden>
                    {!isFirst ? (
                      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[rgba(20,184,166,0.35)]" />
                    ) : null}
                    {!isLast ? (
                      <span className="absolute bottom-0 left-1/2 top-3 w-px -translate-x-1/2 bg-[rgba(20,184,166,0.35)]" />
                    ) : null}
                    <span className="relative z-10 mx-auto mt-1.5 block h-2.5 w-2.5 rounded-full border-2 border-accent-cyan bg-[color:var(--color-bg-1)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-cyan">
                      {pick(stop.period, lang)}
                    </div>
                    <CardLink
                      href={stop.href}
                      className={clsx(
                        'mt-0.5 block',
                        stop.href && 'transition-colors hover:text-accent-cyan',
                      )}
                    >
                      <h3 className="intro-ink text-base font-semibold tracking-tight sm:text-lg">
                        {pick(stop.title, lang)}
                      </h3>
                      <p className="intro-ink-secondary mt-0.5 text-xs leading-snug sm:text-sm">
                        {pick(stop.blurb, lang)}
                      </p>
                      {stop.href ? (
                        <span className="mt-0.5 inline-block text-[11px] font-semibold text-accent-cyan">
                          {lang === 'de' ? 'Öffnen →' : 'Open →'}
                        </span>
                      ) : null}
                    </CardLink>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="hidden min-h-0 grid-cols-2 gap-2 sm:grid lg:grid lg:h-full lg:max-h-full">
          {slide.media?.map((m) => (
            <IntroMedia
              key={m.src}
              media={m}
              lang={lang}
              fillHeight
              className="max-h-[42vh] lg:max-h-none"
              sizes="(min-width: 1024px) 420px, 45vw"
            />
          ))}
        </div>
      </div>
    </IntroSlideShell>
  );
}

/* ─── Facts (scale) ────────────────────────────────────────── */

export function FactsLayout({ slide, lang, exportMode }: LayoutProps) {
  if (exportMode) {
    return (
      <IntroSlideShell>
        <div className="flex h-full min-h-0 flex-col gap-6">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          </div>

          <dl className="grid min-h-0 flex-1 grid-cols-2 content-stretch gap-4">
            {slide.metrics?.slice(0, 4).map((m) => (
              <div
                key={m.value + pick(m.label, lang)}
                className="theme-card-strong flex flex-col justify-center rounded-[28px] border px-6 py-5 shadow-[var(--glass-shadow)]"
              >
                <dt className="intro-ink brand-tight text-[128px] font-semibold leading-none tracking-tight">
                  {m.value}
                </dt>
                <dd className="intro-ink-secondary mt-4 text-[40px] font-medium leading-snug">
                  {pick(m.label, lang)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell>
      <div className="grid h-full min-h-0 items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-6">
        <div className="min-h-0 overflow-hidden">
          <IntroSlideHeader
            strong
            kicker={pick(slide.kicker, lang)}
            title={pick(slide.title, lang)}
          />
          {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}

          <dl className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
            {slide.metrics?.map((m) => (
              <div
                key={m.value + pick(m.label, lang)}
                className="flex items-baseline gap-3 border-b border-[rgba(28,28,28,0.08)] pb-1.5 last:border-0 sm:gap-4 sm:pb-2"
              >
                <dt className="intro-ink brand-tight min-w-[3.25rem] text-3xl font-semibold tracking-tight sm:min-w-[4rem] sm:text-4xl">
                  {m.value}
                </dt>
                <dd className="intro-ink-secondary text-xs sm:text-sm">
                  {pick(m.label, lang)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {slide.media?.[0] ? (
          <div className="hidden h-full max-h-[min(58vh,480px)] min-h-0 sm:block">
            <IntroMedia
              media={slide.media[0]}
              lang={lang}
              fillHeight
              className="shadow-[0_12px_40px_rgba(28,28,28,0.1)]"
              sizes="(min-width: 1024px) 520px, 48vw"
            />
          </div>
        ) : null}
      </div>
    </IntroSlideShell>
  );
}

/* ─── Split (production, why) ──────────────────────────────── */

export function SplitLayout({ slide, lang, exportMode }: LayoutProps) {
  const isWhy = slide.id === 'why';

  if (exportMode) {
    return (
      <IntroSlideShell>
        <div className="flex h-full min-h-0 flex-col gap-6">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
            {slide.bullets?.length ? (
              <IntroBullets items={slide.bullets} lang={lang} />
            ) : null}
          </div>

          {slide.quote ? (
            <blockquote className="theme-card-strong flex min-h-0 flex-1 flex-col justify-center rounded-[28px] border p-8 shadow-[var(--glass-shadow)]">
              <p className="intro-ink text-[42px] leading-[1.28]">
                “{pick(slide.quote, lang)}”
              </p>
              {slide.quoteAttribution ? (
                <footer className="intro-ink-muted mt-6 text-[26px] font-semibold uppercase tracking-[0.14em]">
                  {pick(slide.quoteAttribution, lang)}
                </footer>
              ) : null}
            </blockquote>
          ) : null}
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell>
      <div className="grid h-full min-h-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6">
        <div className="min-h-0 overflow-hidden">
          <IntroSlideHeader
            strong
            kicker={pick(slide.kicker, lang)}
            title={pick(slide.title, lang)}
          />
          {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          {slide.bullets?.length ? (
            <IntroBullets items={slide.bullets} lang={lang} />
          ) : null}

          {slide.quote ? (
            <blockquote className="theme-card-strong mt-3 rounded-2xl border p-3 shadow-[var(--glass-shadow)] sm:mt-4 sm:p-4">
              <p className="intro-ink text-sm leading-snug sm:text-base sm:leading-relaxed">
                “{pick(slide.quote, lang)}”
              </p>
              {slide.quoteAttribution ? (
                <footer className="intro-ink-muted mt-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {pick(slide.quoteAttribution, lang)}
                </footer>
              ) : null}
            </blockquote>
          ) : null}

          {!isWhy && slide.cards?.[0]?.href ? (
            <CardLink
              href={slide.cards[0].href}
              className="mt-3 inline-flex min-h-[40px] items-center text-sm font-semibold text-accent-cyan"
            >
              {pick(slide.cards[0].title, lang)} →
            </CardLink>
          ) : null}
        </div>

        <div className="hidden h-full min-h-0 grid-rows-[1.2fr_0.8fr] gap-2 sm:grid lg:max-h-[min(62vh,520px)]">
          {isWhy && slide.media?.[0] ? (
            <div className="row-span-2 min-h-0">
              <IntroMedia
                media={slide.media[0]}
                lang={lang}
                fillHeight
                className="mx-auto max-w-sm lg:max-w-none"
                sizes="(min-width: 1024px) 520px, 48vw"
              />
            </div>
          ) : null}
          {!isWhy
            ? slide.media?.slice(0, 2).map((m) => (
                <IntroMedia
                  key={m.src}
                  media={m}
                  lang={lang}
                  fillHeight
                  sizes="(min-width: 1024px) 560px, 92vw"
                  priority={m === slide.media?.[0]}
                />
              ))
            : null}
        </div>
      </div>
    </IntroSlideShell>
  );
}

/* ─── Gallery (built) ──────────────────────────────────────── */

const POPOVER_CLOSE_MS = 160;
const POPOVER_W = 340;

function clampPopover(
  anchor: AnchorRect,
  shell: DOMRect | null,
): { top: number; left: number } {
  const gap = 10;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const w = Math.min(POPOVER_W, vw * 0.86);

  // Always open below the logo — never flip up over the title / other chips.
  let left = anchor.left + anchor.width / 2 - w / 2;
  const top = anchor.bottom + gap;

  const minL = shell ? shell.left + 12 : 12;
  const maxL = (shell ? shell.right : vw) - w - 12;
  left = Math.max(minL, Math.min(left, Math.max(minL, maxL)));

  return { top, left };
}

export function GalleryLayout({ slide, lang, exportMode }: LayoutProps) {
  const cards = slide.cards ?? [];
  const toolkit = slide.chips?.length ? slide.chips : null;
  const byId = useMemo(() => {
    const map = new Map<string, ProjectCard>();
    for (const c of cards) {
      if (c.id) map.set(c.id, c);
    }
    return map;
  }, [cards]);

  const shellRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overPopover = useRef(false);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const [chipKey, setChipKey] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    setPreviewId(null);
    setChipKey(null);
    setAnchor(null);
    setPos(null);
  }, [slide.id]);

  const clearClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => {
      if (overPopover.current) return;
      setPreviewId(null);
      setChipKey(null);
      setAnchor(null);
      setPos(null);
    }, POPOVER_CLOSE_MS);
  }, [clearClose]);

  const openAt = useCallback(
    (id: string, key: string, rect: AnchorRect) => {
      if (exportMode) return;
      clearClose();
      const shell = shellRef.current?.getBoundingClientRect() ?? null;
      setPreviewId(id);
      setChipKey(key);
      setAnchor(rect);
      setPos(clampPopover(rect, shell));
    },
    [clearClose, exportMode],
  );

  useEffect(() => {
    if (!previewId || !anchor) return;
    const onScrollOrResize = () => {
      const shell = shellRef.current?.getBoundingClientRect() ?? null;
      setPos(clampPopover(anchor, shell));
    };
    window.addEventListener('resize', onScrollOrResize);
    return () => window.removeEventListener('resize', onScrollOrResize);
  }, [previewId, anchor]);

  useEffect(() => {
    if (!previewId) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      const shell = shellRef.current;
      if (!shell) return;
      const inPopover = shell.querySelector('[data-built-popover]')?.contains(t);
      const inChip = (t as Element).closest?.('button[aria-haspopup="dialog"]');
      if (!inPopover && !inChip) {
        overPopover.current = false;
        setPreviewId(null);
        setChipKey(null);
        setAnchor(null);
        setPos(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [previewId]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const previewCard = previewId ? byId.get(previewId) : undefined;

  const popover =
    mounted && previewCard && pos
      ? createPortal(
          <div
            data-built-popover
            role="dialog"
            aria-label={pick(previewCard.title, lang)}
            className={clsx(
              'pointer-events-auto fixed z-[60] w-[min(340px,86vw)] origin-top',
              !reduceMotion && 'intro-preview-in',
            )}
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={() => {
              overPopover.current = true;
              clearClose();
            }}
            onMouseLeave={() => {
              overPopover.current = false;
              scheduleClose();
            }}
          >
            <div className="theme-card overflow-hidden rounded-2xl border shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <ProjectTile card={previewCard} lang={lang} />
            </div>
          </div>,
          document.body,
        )
      : null;

  const toolkitRow = toolkit ? (
    <ToolLogoRow
      chips={toolkit}
      lang={lang}
      label={slide.chipsLabel ? pick(slide.chipsLabel, lang) : undefined}
      prominent
      interactive={!exportMode}
      activeChipKey={chipKey}
      onHover={openAt}
      onSelect={openAt}
      onLeave={scheduleClose}
    />
  ) : null;

  if (exportMode) {
    return (
      <IntroSlideShell>
        <div
          ref={shellRef}
          className="relative flex h-full min-h-0 flex-col gap-6 overflow-hidden"
        >
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
            {slide.bullets?.length ? (
              <IntroBullets items={slide.bullets} lang={lang} />
            ) : null}
          </div>
          {toolkitRow ? (
            <div className="theme-card-strong shrink-0 rounded-[28px] border p-7 shadow-[var(--glass-shadow)]">
              {toolkitRow}
            </div>
          ) : null}
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell>
      <div
        ref={shellRef}
        className="relative flex h-full min-h-0 flex-col overflow-hidden"
      >
        {slide.bullets?.length ? (
          <div className="grid min-h-0 flex-1 items-start gap-4 overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
            <div className="min-h-0 overflow-hidden">
              <IntroSlideHeader
                strong
                kicker={pick(slide.kicker, lang)}
                title={pick(slide.title, lang)}
              />
              {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
              <IntroBullets items={slide.bullets} lang={lang} />
            </div>
            {toolkitRow ? (
              <div className="theme-card-strong rounded-[20px] border p-4 shadow-[var(--glass-shadow)] sm:p-5">
                {toolkitRow}
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
            {toolkitRow ? (
              <div className="mt-4 shrink-0 sm:mt-5">{toolkitRow}</div>
            ) : null}
          </>
        )}

        {popover}
      </div>
    </IntroSlideShell>
  );
}

/* ─── Feature (shipped) ────────────────────────────────────── */

export function FeatureLayout({ slide, lang }: LayoutProps) {
  const cards = slide.cards ?? [];
  const featured = cards.filter((c) => c.featured);
  const textOnly = cards.filter((c) => !c.featured);

  return (
    <IntroSlideShell>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <IntroSlideHeader
          strong
          kicker={pick(slide.kicker, lang)}
          title={pick(slide.title, lang)}
        />
        {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}

        <div className="mt-3 grid min-h-0 flex-1 gap-2 sm:grid-cols-2 lg:mt-4">
          {featured.map((c) => (
            <ProjectTile
              key={pick(c.title, 'en')}
              card={c}
              lang={lang}
              featured
            />
          ))}
        </div>

        {textOnly.length ? (
          <div className="mt-2 grid shrink-0 gap-2">
            {textOnly.map((c) => (
              <ProjectTile
                key={pick(c.title, 'en')}
                card={c}
                lang={lang}
                textOnly
              />
            ))}
          </div>
        ) : null}
      </div>
    </IntroSlideShell>
  );
}

/* ─── Triptych (differentiators) ───────────────────────────── */

export function TriptychLayout({ slide, lang }: LayoutProps) {
  return (
    <IntroSlideShell>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <IntroSlideHeader
          strong
          kicker={pick(slide.kicker, lang)}
          title={pick(slide.title, lang)}
        />

        <div className="mt-3 grid min-h-0 flex-1 gap-2 sm:grid-cols-2 lg:mt-4 lg:grid-cols-3">
          {slide.cards?.map((c) => (
            <ProjectTile
              key={pick(c.title, 'en')}
              card={c}
              lang={lang}
              compact
            />
          ))}
        </div>
      </div>
    </IntroSlideShell>
  );
}

/* ─── Chips (bring) ────────────────────────────────────────── */

export function ChipsLayout({ slide, lang }: LayoutProps) {
  return (
    <IntroSlideShell>
      <div className="grid h-full min-h-0 items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
        <div className="min-h-0 overflow-hidden">
          <IntroSlideHeader
            strong
            kicker={pick(slide.kicker, lang)}
            title={pick(slide.title, lang)}
          />
          {slide.bullets?.length ? (
            <IntroBullets items={slide.bullets} lang={lang} />
          ) : null}
        </div>

        <div className="theme-card-strong rounded-[20px] border p-4 shadow-[var(--glass-shadow)] sm:p-5">
          <ToolLogoRow
            chips={slide.chips ?? []}
            lang={lang}
            label={
              slide.chipsLabel ? pick(slide.chipsLabel, lang) : undefined
            }
          />
        </div>
      </div>
    </IntroSlideShell>
  );
}

/* ─── Partners (DADB logo marquee) ─────────────────────────── */

export function PartnersLayout({ slide, lang, exportMode }: LayoutProps) {
  if (exportMode) {
    return (
      <IntroSlideShell>
        <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          </div>

          <div className="min-h-0 flex-1">
            <ClientLogoMarquee prominent bare staticGrid />
          </div>
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <IntroSlideHeader
          strong
          kicker={pick(slide.kicker, lang)}
          title={pick(slide.title, lang)}
        />
        {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}

        <div className="mt-4 min-h-0 flex-1 sm:mt-5">
          <ClientLogoMarquee prominent bare />
        </div>
      </div>
    </IntroSlideShell>
  );
}

/* ─── Mosaic (close) ───────────────────────────────────────── */

export function MosaicLayout({ slide, lang, exportMode }: LayoutProps) {
  if (exportMode) {
    return (
      <IntroSlideShell>
        <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden">
          <div className="shrink-0">
            <IntroSlideHeader
              strong
              kicker={pick(slide.kicker, lang)}
              title={pick(slide.title, lang)}
            />
            {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 content-stretch">
            {slide.media?.slice(0, 6).map((m) => (
              <IntroMedia
                key={m.src}
                media={m}
                lang={lang}
                fillHeight
                className="min-h-0"
                sizes="500px"
              />
            ))}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            {slide.ctaPrimary ? (
              <span className="btn-solid inline-flex min-h-[64px] items-center rounded-full px-8 py-3 text-[28px] font-medium">
                {pick(slide.ctaPrimary.label, lang)}
              </span>
            ) : null}
            {slide.ctaSecondary ? (
              <span className="intro-ink-secondary inline-flex min-h-[64px] items-center rounded-full px-5 py-3 text-[28px] font-medium">
                {pick(slide.ctaSecondary.label, lang)}
              </span>
            ) : null}
          </div>
        </div>
      </IntroSlideShell>
    );
  }

  return (
    <IntroSlideShell>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <IntroSlideHeader
          strong
          kicker={pick(slide.kicker, lang)}
          title={pick(slide.title, lang)}
        />
        {slide.body ? <IntroBody>{pick(slide.body, lang)}</IntroBody> : null}

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-4 lg:grid-cols-6 lg:gap-2">
          {slide.media?.map((m) => (
            <IntroMedia
              key={m.src}
              media={m}
              lang={lang}
              fillHeight
              className="max-h-[22vh] transition-transform hover:scale-[1.02] lg:max-h-none"
              sizes="(min-width: 1024px) 360px, 48vw"
            />
          ))}
        </div>

        <div className="mt-4 flex shrink-0 flex-wrap gap-2 sm:mt-5 sm:gap-3">
          {slide.ctaPrimary ? (
            <Link
              href={slide.ctaPrimary.href}
              className="btn-solid inline-flex min-h-[40px] items-center rounded-full px-5 py-2 text-sm font-medium transition-colors hover:bg-accent-cyan hover:text-white"
            >
              {pick(slide.ctaPrimary.label, lang)}
            </Link>
          ) : null}
          <a
            href={buildHireMailto(
              lang === 'de'
                ? 'Hallo Artjom — nach dem Intro'
                : 'Hello Artjom — after the intro',
            )}
            className="theme-card intro-ink inline-flex min-h-[40px] items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          >
            {lang === 'de' ? 'E-Mail schreiben' : 'Send email'}
          </a>
          {slide.ctaSecondary ? (
            <a
              href={slide.ctaSecondary.href}
              target={slide.ctaSecondary.external ? '_blank' : undefined}
              rel={
                slide.ctaSecondary.external ? 'noopener noreferrer' : undefined
              }
              className="intro-ink-secondary inline-flex min-h-[40px] items-center rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-accent-cyan"
            >
              {pick(slide.ctaSecondary.label, lang)}
            </a>
          ) : null}
        </div>
      </div>
    </IntroSlideShell>
  );
}
