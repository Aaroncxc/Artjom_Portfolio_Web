'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { useThemeOptional } from '@/components/ThemeProvider';
import { IntroChrome } from '@/components/intro/IntroChrome';
import { IntroSlideView } from '@/components/intro/IntroSlideView';
import { useHorizontalSwipe } from '@/lib/useHorizontalSwipe';
import {
  CHROME,
  INTRO_CAROUSEL_SLIDES,
  INTRO_NAV_LINE,
  INTRO_SLIDES,
  pick,
  type IntroLang,
} from '@/lib/introCopy';

function parseLang(raw: string | null): IntroLang {
  if (raw === 'de' || raw === 'de-DE') return 'de';
  return 'en';
}

/** Accepts 1-based human URLs or 0-based indices. */
function parseSlide(raw: string | null, total: number): number | null {
  if (raw == null || raw === '') return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return null;
  if (n >= 1 && n <= total) return n - 1;
  if (n >= 0 && n < total) return n;
  return null;
}

export function PitchDeck() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion() ?? false;

  const exportMode =
    searchParams.get('export') === '1' || searchParams.get('export') === 'true';

  const slides = useMemo(
    () => (exportMode ? INTRO_CAROUSEL_SLIDES : INTRO_SLIDES),
    [exportMode],
  );
  const total = slides.length;

  const [index, setIndex] = useState(() => {
    const fromUrl = parseSlide(
      searchParams.get('slide'),
      exportMode ? INTRO_CAROUSEL_SLIDES.length : INTRO_SLIDES.length,
    );
    return fromUrl ?? 0;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<IntroLang>(() =>
    parseLang(searchParams.get('lang')),
  );

  const safeIndex = Math.min(Math.max(0, index), total - 1);
  const slide = slides[safeIndex];
  const themeCtx = useThemeOptional();
  const isDarkTheme = Boolean(themeCtx?.ready && themeCtx.theme === 'dark');

  const go = useCallback(
    (delta: number) => {
      if (exportMode) return;
      setIndex((prev) => Math.min(total - 1, Math.max(0, prev + delta)));
      setMenuOpen(false);
    },
    [total, exportMode],
  );

  const setLangAndUrl = useCallback(
    (next: IntroLang) => {
      setLang(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === 'en') params.delete('lang');
      else params.set('lang', next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      if (typeof document !== 'undefined') {
        document.documentElement.lang = next === 'de' ? 'de' : 'en';
      }
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const fromUrl = parseLang(searchParams.get('lang'));
    setLang(fromUrl);
    document.documentElement.lang = fromUrl === 'de' ? 'de' : 'en';

    const slideFromUrl = parseSlide(searchParams.get('slide'), total);
    if (slideFromUrl != null) setIndex(slideFromUrl);
  }, [searchParams, total]);

  useEffect(() => {
    if (exportMode) return undefined;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setIndex(total - 1);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setMenuOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, total, exportMode]);

  const swipe = useHorizontalSwipe(
    () => go(1),
    () => go(-1),
    !exportMode,
  );

  return (
    <div
      className="intro-ink relative h-[100dvh] overflow-hidden bg-transparent"
      data-nav-key="intro"
      data-export={exportMode ? '1' : undefined}
      data-slide={safeIndex}
      data-theme={isDarkTheme ? 'dark' : 'light'}
      {...swipe}
    >
      {!exportMode ? (
        <LightLeaksBackground />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-mk-bg-1"
          aria-hidden
        />
      )}

      {!exportMode ? (
        <IntroChrome
          lang={lang}
          index={safeIndex}
          total={total}
          menuOpen={menuOpen}
          dark={isDarkTheme}
          onToggleMenu={() => setMenuOpen((v) => !v)}
          onLangChange={setLangAndUrl}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      ) : null}

      <main
        className={`relative z-10 h-full ${exportMode ? 'p-0' : ''}`}
        data-intro-stage
      >
        <div className="sr-only" aria-live="polite">
          {pick(slide.label, lang)}: {pick(slide.title, lang)}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${lang}-${safeIndex}-${exportMode ? 'x' : 'l'}`}
            initial={
              exportMode || reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              exportMode || reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8 }
            }
            transition={{
              duration: exportMode || reduceMotion ? 0.01 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full"
          >
            <IntroSlideView
              slide={slide}
              lang={lang}
              exportMode={exportMode}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {!exportMode && menuOpen ? (
        <div
          className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] dark:bg-black/55"
          onClick={() => setMenuOpen(false)}
          role="presentation"
        >
          <nav
            className="h-full w-[min(100%,22rem)] overflow-y-auto border-r border-[color:var(--surface-border)] bg-[color:var(--color-bg-1)]/96 p-6 shadow-[8px_0_32px_rgba(0,0,0,0.18)]"
            onClick={(e) => e.stopPropagation()}
            aria-label={pick(CHROME.index, lang)}
          >
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
              {pick(CHROME.index, lang)}
            </div>
            <p className="mb-6 text-sm text-mk-text-secondary">
              {pick(INTRO_NAV_LINE, lang)}
            </p>
            <ol className="space-y-1">
              {INTRO_SLIDES.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(i);
                      setMenuOpen(false);
                    }}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors ${
                      i === safeIndex
                        ? 'bg-[rgba(20,184,166,0.12)] font-semibold text-mk-text'
                        : 'text-mk-text-secondary hover:bg-[color:var(--surface-card)] hover:text-mk-text'
                    }`}
                  >
                    <span className="font-mono text-[11px] tabular-nums text-mk-text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {pick(s.label, lang)}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
