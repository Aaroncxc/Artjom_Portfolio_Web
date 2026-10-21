'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { V3BlueprintCorners } from '@/components/V3BlueprintCorners';
import { V3CaseMediaBento } from '@/components/V3CaseMediaBento';
import { V3CasePartnerPanel } from '@/components/V3CasePartnerPanel';
import { V3WorkflowDiagram } from '@/components/V3WorkflowDiagram';
import type { CaseStudy, Locale, Media } from '@/lib/v3Content';
import {
  buildCaseSlides,
  mediaIndexForSlide,
  visualMediaForCase,
  type CaseSlide,
} from '@/lib/v3CaseSlides';

const SWIPE_CONFIDENCE = 8000;

function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

function MetricBlock({ text }: { text: string }) {
  const big = /€|\d[\d.,]*\s*(k|×|%|000|380|23|6)/i.test(text);
  if (big) {
    return <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">{text}</p>;
  }
  return <li className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{text}</li>;
}

function SlidePanel({ slide, total, locale }: { slide: CaseSlide; total: number; locale: Locale }) {
  if (slide.kind === 'partners') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {slide.title}
          </p>
          <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
            {slide.step}/{String(total).padStart(2, '0')}
          </span>
        </div>
        {slide.headline && (
          <h4 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 md:text-xl">
            {slide.headline}
          </h4>
        )}
        <div className="mt-4 flex-1">
          <V3CasePartnerPanel locale={locale} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {slide.title}
        </p>
        <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
          {slide.step}/{String(total).padStart(2, '0')}
        </span>
      </div>
      {slide.headline && (
        <h4 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 md:text-xl">
          {slide.headline}
        </h4>
      )}
      {slide.paragraph && !slide.bullets?.length && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">{slide.paragraph}</p>
      )}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul
          className={`mt-4 space-y-2 ${slide.emphasizeNumbers ? 'list-none space-y-4 pl-0' : 'list-disc pl-4 text-sm text-neutral-700 dark:text-neutral-300'}`}
        >
          {slide.bullets.map((b) => (
            <MetricBlock key={b} text={b} />
          ))}
        </ul>
      )}
      {slide.tools && slide.tools.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {slide.tools.map((t) => (
            <span
              key={t}
              className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

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
  const [direction, setDirection] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);

  useEffect(() => {
    setIndex(0);
    setDirection(0);
  }, [c.id, locale]);

  const visual = visualMediaForCase(allMedia);
  const workflowVariant = allMedia.find((m) => m.kind === 'workflow');
  const current = slides[index];
  const slideKind = current?.kind ?? 'challenge';
  const vIdx = mediaIndexForSlide(index, slideKind, visual.length);

  const paginate = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta)));
    },
    [slides.length],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const power = swipePower(info.offset.x, info.velocity.x);
    if (power < -SWIPE_CONFIDENCE) paginate(1);
    else if (power > SWIPE_CONFIDENCE) paginate(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    }
  };

  const tbd = periodLabel === 'TBD' || periodLabel.includes('– TBD');

  return (
    <article id={c.id} className="scroll-mt-28 border-t border-neutral-200 py-10 dark:border-neutral-800 md:py-14">
      <div className="mb-5 max-w-[65ch] lg:max-w-none">
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
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={c.title}
          onKeyDown={onKeyDown}
          className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50/80 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-900 dark:border-neutral-700 dark:from-neutral-950 dark:to-neutral-900/50 dark:focus-visible:ring-neutral-100"
        >
          <V3BlueprintCorners />

          <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="flex min-h-[16rem] flex-col lg:col-span-5 lg:min-h-[20rem]">
              <motion.div
                className="relative flex-1 touch-pan-y"
                drag={reduceMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={onDragEnd}
                style={{ cursor: reduceMotion ? 'default' : 'grab' }}
                whileDrag={{ cursor: 'grabbing' }}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={reduceMotion ? undefined : slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-[12rem]"
                  >
                    {current && <SlidePanel slide={current} total={slides.length} locale={locale} />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    disabled={index === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-30 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    aria-label={locale === 'de' ? 'Vorheriger Slide' : 'Previous slide'}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    disabled={index >= slides.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-30 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    aria-label={locale === 'de' ? 'Nächster Slide' : 'Next slide'}
                  >
                    →
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                      }}
                      className={`h-2 w-2 rounded-full transition ${i === index ? 'scale-125 bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                  <span className="ml-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {index + 1}/{slides.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7">
              {current?.kind === 'approach' && current.workflowVariant && (
                <div className="mb-3 hidden lg:block">
                  <V3WorkflowDiagram variant={current.workflowVariant} locale={locale} />
                </div>
              )}
              {visual.length > 0 ? (
                <V3CaseMediaBento media={visual} locale={locale} focusIndex={vIdx} />
              ) : workflowVariant?.kind === 'workflow' ? (
                <V3WorkflowDiagram variant={workflowVariant.variant} locale={locale} />
              ) : null}
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
