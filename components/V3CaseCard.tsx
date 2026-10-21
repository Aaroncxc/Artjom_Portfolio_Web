'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { V3BlueprintCorners } from '@/components/V3BlueprintCorners';
import { V3CaseMedia } from '@/components/V3CaseMedia';
import { V3WorkflowDiagram } from '@/components/V3WorkflowDiagram';
import type { CaseStudy, Locale, Media } from '@/lib/v3Content';
import {
  buildCaseSlides,
  mediaIndexForSlide,
  visualMediaForCase,
  type CaseSlide,
} from '@/lib/v3CaseSlides';

function ResultLine({ text, large }: { text: string; large?: boolean }) {
  const hasMetric = /€|\d[\d.,]*\s*(k|×|%|000)/i.test(text);
  if (large && hasMetric) {
    return <p className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">{text}</p>;
  }
  return <li className="text-neutral-800 dark:text-neutral-200">{text}</li>;
}

function SlidePanel({ slide, locale }: { slide: CaseSlide; locale: Locale }) {
  return (
    <div className="flex h-full flex-col">
      <p className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{slide.title}</p>
      {slide.paragraph && <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-base">{slide.paragraph}</p>}
      {slide.bullets && (
        <ul className={`mt-3 space-y-2 text-sm ${slide.emphasizeNumbers ? 'list-none space-y-3 pl-0' : 'list-disc pl-4 text-neutral-700 dark:text-neutral-300'}`}>
          {slide.bullets.map((b) => (
            <ResultLine key={b} text={b} large={slide.emphasizeNumbers} />
          ))}
        </ul>
      )}
      {slide.tools && slide.tools.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {slide.tools.map((t) => (
            <span key={t} className="rounded border border-neutral-200 px-2 py-0.5 font-mono text-xs text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  c: CaseStudy;
  locale: Locale;
  big?: boolean;
  periodLabel: string;
  allMedia: Media[];
};

export function V3CaseCard({ c, locale, big, periodLabel, allMedia }: Props) {
  const slides = buildCaseSlides(c, locale);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);

  useEffect(() => {
    setIndex(0);
  }, [c.id, locale]);

  const visual = visualMediaForCase(allMedia);
  const current = slides[index];
  const workflowVariant = allMedia.find((m) => m.kind === 'workflow');
  const slideKind = current?.kind ?? 'challenge';
  const vIdx = mediaIndexForSlide(index, slideKind, visual.length);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta)));
    },
    [slides.length],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const tbd = periodLabel === 'TBD' || periodLabel.includes('– TBD');

  return (
    <article id={c.id} className="scroll-mt-28 border-t border-neutral-200 py-10 dark:border-neutral-800 md:py-14">
      <div className="mb-4 max-w-[65ch]">
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
        <h3 className={`mt-2 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 ${big ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
          {c.title}
        </h3>
      </div>

      {slides.length === 0 ? null : (
        <div
          ref={cardRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={c.title}
          onKeyDown={onKeyDown}
          className="relative rounded-xl border border-neutral-200 bg-white/50 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/30 dark:focus-visible:ring-neutral-100"
          onTouchStart={(e) => {
            touchStart.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStart.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current;
            if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
            touchStart.current = null;
          }}
        >
          <V3BlueprintCorners />

          <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="flex min-h-[14rem] flex-col lg:col-span-5 lg:min-h-[18rem]">
              <div className="relative flex-1 overflow-hidden">
                {slides.map((slide, i) => (
                  <div
                    key={slide.kind}
                    className={`absolute inset-0 ${i === index ? 'z-10' : 'z-0 pointer-events-none'}`}
                    style={{
                      opacity: i === index ? 1 : 0,
                      transform: reduceMotion ? 'none' : i === index ? 'translateX(0)' : i < index ? 'translateX(-12px)' : 'translateX(12px)',
                      transition: reduceMotion ? 'none' : 'opacity 0.35s ease, transform 0.35s ease',
                    }}
                    aria-hidden={i !== index}
                  >
                    <SlidePanel slide={slide} locale={locale} />
                  </div>
                ))}
              </div>

              <div className="relative z-20 mt-4 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-30 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    aria-label={locale === 'de' ? 'Vorheriger Slide' : 'Previous slide'}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={index >= slides.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-30 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    aria-label={locale === 'de' ? 'Nächster Slide' : 'Next slide'}
                  >
                    →
                  </button>
                </div>
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {index + 1}/{slides.length}
                </span>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7">
              {visual.length > 0 ? (
                <div className="relative overflow-hidden rounded-lg">
                  {visual.map((m, i) => (
                    <div
                      key={i}
                      className={`${i === vIdx ? 'relative' : 'absolute inset-0'}`}
                      style={{
                        opacity: i === vIdx ? 1 : 0,
                        transition: reduceMotion ? 'none' : 'opacity 0.4s ease',
                      }}
                    >
                      <V3CaseMedia m={m} locale={locale} />
                    </div>
                  ))}
                </div>
              ) : workflowVariant?.kind === 'workflow' ? (
                <V3WorkflowDiagram variant={workflowVariant.variant} locale={locale} />
              ) : null}
              {visual.length > 1 && (
                <div className="mt-2 flex gap-1.5">
                  {visual.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i === vIdx ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {(c.links || c.note) && index === slides.length - 1 && (
            <div className="border-t border-neutral-100 px-5 py-4 dark:border-neutral-800 md:px-8 lg:px-10">
              {c.links && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {c.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-neutral-900 underline underline-offset-4 dark:text-neutral-100">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
              {c.note && <p className="mt-2 text-xs text-neutral-400">{c.note}</p>}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
