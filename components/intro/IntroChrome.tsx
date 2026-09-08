'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { GlassPanel } from '@/components/GlassPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  CHROME,
  INTRO_WORK_HREF,
  pick,
  type IntroLang,
} from '@/lib/introCopy';
import { CONTACT_MAILTO } from '@/lib/contact';

interface IntroChromeProps {
  lang: IntroLang;
  index: number;
  total: number;
  menuOpen: boolean;
  /** Cover slide or global dark theme — inverted chrome accents */
  dark?: boolean;
  onToggleMenu: () => void;
  onLangChange: (lang: IntroLang) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function IntroChrome({
  lang,
  index,
  total,
  menuOpen,
  dark = false,
  onToggleMenu,
  onLangChange,
  onPrev,
  onNext,
}: IntroChromeProps) {
  const progress = ((index + 1) / total) * 100;

  return (
    <>
      <div
        className={clsx(
          'absolute inset-x-0 top-0 z-30 h-[2px]',
          dark ? 'bg-white/10' : 'bg-[rgba(28,28,28,0.08)]',
        )}
      >
        <div
          className="h-full bg-accent-cyan transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`${String(index + 1).padStart(2, '0')} ${pick(CHROME.of, lang)} ${total}`}
        />
      </div>

      <div className="absolute inset-x-0 top-[2px] z-20 px-3 pt-3 sm:px-5 sm:pt-4">
        <GlassPanel
          variant="heavy"
          padding="none"
          rounded="2xl"
          className={clsx(
            'mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 rounded-2xl px-2 py-1.5 sm:flex-nowrap sm:gap-3 sm:rounded-3xl sm:px-3 sm:py-2',
            dark &&
              '!border-[rgba(242,237,232,0.1)] !bg-[rgba(18,16,14,0.72)] !shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          )}
        >
          <Link
            href={INTRO_WORK_HREF}
            className={clsx(
              'inline-flex min-h-[44px] items-center px-3 text-sm font-semibold tracking-tight transition-colors hover:text-accent-cyan',
              dark ? 'text-white' : 'text-mk-text',
            )}
          >
            Artjom
          </Link>

          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            className={clsx(
              'inline-flex min-h-[44px] items-center rounded-full px-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:text-accent-cyan',
              dark ? 'text-white/70' : 'text-mk-text-secondary',
            )}
          >
            {pick(CHROME.index, lang)}
          </button>

          <div
            className={clsx(
              'font-mono text-[11px] tabular-nums sm:text-xs',
              dark ? 'text-white/50' : 'text-mk-text-muted',
            )}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle inverted={dark} />

            <div
              className={clsx(
                'inline-flex rounded-full border p-0.5',
                dark
                  ? 'border-white/15 bg-white/5'
                  : 'border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.55)]',
              )}
              role="group"
              aria-label="Language"
            >
              {(['en', 'de'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onLangChange(code)}
                  aria-pressed={lang === code}
                  className={clsx(
                    'inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full px-2.5 text-xs font-semibold transition-colors',
                    lang === code
                      ? dark
                        ? 'bg-white text-[#0b0d12]'
                        : 'bg-[#1C1C1C] text-white'
                      : dark
                        ? 'text-white/65 hover:text-accent-cyan'
                        : 'text-mk-text-secondary hover:text-accent-cyan',
                  )}
                >
                  {code === 'en' ? CHROME.langEn : CHROME.langDe}
                </button>
              ))}
            </div>

            <Link
              href={INTRO_WORK_HREF}
              className={clsx(
                'inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-medium transition-colors hover:text-accent-cyan',
                dark ? 'text-white/75' : 'text-mk-text-secondary',
              )}
              title={pick(CHROME.seeWorkHint, lang)}
            >
              {pick(CHROME.seeWork, lang)}
            </Link>

            <a
              href={CONTACT_MAILTO}
              className="btn-solid inline-flex min-h-[44px] items-center rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-accent-cyan hover:text-white"
            >
              {pick(CHROME.hireMe, lang)}
            </a>
          </div>
        </GlassPanel>
      </div>

      <div
        className={clsx(
          'absolute bottom-4 right-4 z-20 flex overflow-hidden rounded-2xl border shadow-[0_8px_32px_rgba(28,28,28,0.08)] backdrop-blur-[24px] sm:bottom-6 sm:right-6',
          dark
            ? 'border-white/10 bg-[rgba(20,22,28,0.85)]'
            : 'border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.85)]',
        )}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label={pick(CHROME.prev, lang)}
          className={clsx(
            'inline-flex min-h-[44px] min-w-[48px] items-center justify-center border-r text-lg transition-colors hover:bg-accent-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent',
            dark
              ? 'border-white/10 text-white disabled:hover:text-white'
              : 'border-[rgba(28,28,28,0.08)] text-mk-text disabled:hover:text-mk-text',
          )}
        >
          ←
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          aria-label={pick(CHROME.next, lang)}
          className={clsx(
            'inline-flex min-h-[44px] min-w-[48px] items-center justify-center text-lg transition-colors hover:bg-accent-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent',
            dark
              ? 'text-white disabled:hover:text-white'
              : 'text-mk-text disabled:hover:text-mk-text',
          )}
        >
          →
        </button>
      </div>
    </>
  );
}
