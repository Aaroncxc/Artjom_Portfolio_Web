'use client';

import { useEffect, useMemo, useState } from 'react';
import { V3BlueprintStats } from '@/components/V3BlueprintStats';
import type { Locale, PortfolioContent } from '@/lib/v3Content';
import { V3_PAGE } from '@/lib/v3Layout';

function BlueprintBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35] dark:opacity-[0.2]" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(163 163 163 / 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(163 163 163 / 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute left-[12%] top-[18%] text-neutral-300 dark:text-neutral-600">+</div>
      <div className="absolute right-[15%] top-[28%] text-neutral-300 dark:text-neutral-600">+</div>
      <div className="absolute left-[22%] bottom-[32%] text-neutral-300 dark:text-neutral-600">+</div>
      <div className="absolute right-[28%] bottom-[22%] text-neutral-300 dark:text-neutral-600">+</div>
    </div>
  );
}

function AnimatedHeadline({ text, reduceMotion }: { text: string; reduceMotion: boolean }) {
  const words = useMemo(() => text.split(/\s+/), [text]);
  const [visible, setVisible] = useState(reduceMotion ? words.length : 0);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(words.length);
      return;
    }
    setVisible(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= words.length) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, [text, reduceMotion, words.length]);

  return (
    <h1 className="max-w-[20ch] text-5xl font-bold leading-[1.05] tracking-tight text-neutral-900 dark:text-neutral-50 md:max-w-none md:text-7xl xl:text-8xl">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="mr-[0.25em] inline-block"
          style={{
            opacity: i < visible ? 1 : 0,
            transform: reduceMotion ? 'none' : i < visible ? 'translateY(0)' : 'translateY(0.35em)',
            transition: reduceMotion ? 'none' : 'opacity 0.45s ease, transform 0.45s ease',
            transitionDelay: reduceMotion ? '0ms' : `${i * 40}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

type Props = {
  locale: Locale;
  hero: PortfolioContent['hero'];
  stats: PortfolioContent['stats'];
};

export function V3Hero({ locale, hero, stats }: Props) {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section className={`relative flex min-h-[90svh] flex-col pb-8 pt-20 md:pt-24 ${V3_PAGE}`}>
      <BlueprintBackdrop />
      <div className="relative z-[1] flex flex-1 flex-col justify-center">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{hero.eyebrow}</p>
        <div className="mt-6">
          <AnimatedHeadline text={hero.headline} reduceMotion={reduceMotion} />
        </div>
        <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-neutral-500 dark:text-neutral-400 md:text-lg">{hero.sub}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {hero.roles.map((r) => (
            <span key={r} className="rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-600 dark:text-neutral-200">
              {r}
            </span>
          ))}
        </div>
        <div className="mt-8 flex gap-3 text-sm">
          <a href="#contact" className="rounded-md bg-neutral-900 px-4 py-2 text-white dark:bg-neutral-100 dark:text-neutral-900">
            {hero.ctaPrimary}
          </a>
          <a
            href="#work"
            className="rounded-md border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:text-neutral-100"
          >
            {hero.ctaSecondary}
          </a>
        </div>
      </div>

      <div className="relative z-[1] mt-auto w-full border-t border-neutral-200/80 pt-8 dark:border-neutral-700/80">
        <V3BlueprintStats stats={stats} className="mt-0" />
      </div>

      <a
        href="#work"
        className="relative z-[1] mx-auto mt-6 flex flex-col items-center gap-1 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-300"
        aria-label={locale === 'de' ? 'Zu den Case Studies scrollen' : 'Scroll to case studies'}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">{locale === 'de' ? 'Scroll' : 'Scroll'}</span>
        <span className={`text-lg ${reduceMotion ? '' : 'animate-bounce'}`}>↓</span>
      </a>
    </section>
  );
}
