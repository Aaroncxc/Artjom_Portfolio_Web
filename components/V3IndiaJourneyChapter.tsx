'use client';

import { motion, useMotionValueEvent, useScroll, useTransform, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { V3BlueprintCorners } from '@/components/V3BlueprintCorners';
import {
  ELA_JOURNEY_PHOTOS,
  INDIA_JOURNEY_COPY,
  INDIA_JOURNEY_ID,
  INDIA_JOURNEY_STATIONS,
  t,
  type JourneyPhoto,
  type JourneyStation,
  type StationTone,
} from '@/lib/v3IndiaJourney';
import { V3_PAGE } from '@/lib/v3Layout';
import type { Locale } from '@/lib/v3Content';

const SWIPE_CONFIDENCE = 8000;

function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

function toneSurface(tone: StationTone) {
  if (tone === 'modern') {
    return 'border-sky-200/80 bg-gradient-to-br from-sky-50/90 via-white to-emerald-50/70 dark:border-sky-800/50 dark:from-sky-950/40 dark:via-neutral-950 dark:to-emerald-950/30';
  }
  return 'border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-stone-50/80 to-orange-50/60 dark:border-amber-900/40 dark:from-amber-950/30 dark:via-neutral-950 dark:to-stone-900/40';
}

function toneBadge(tone: StationTone, locale: Locale) {
  if (tone === 'modern') {
    return locale === 'de' ? 'Modernes Umfeld' : 'Modern setting';
  }
  return locale === 'de' ? 'Unterversorgt · Investition nötig' : 'Under-resourced · needs investment';
}

function JourneyImage({ photo, locale, className }: { photo: JourneyPhoto; locale: Locale; className?: string }) {
  if (!photo.src) {
    return (
      <div
        className={`flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-amber-400/70 bg-amber-50/40 dark:border-amber-600/50 dark:bg-amber-950/20 ${className ?? ''}`}
      >
        <span className="px-4 text-center font-mono text-[10px] uppercase tracking-wide text-amber-800 dark:text-amber-300">
          TODO · {locale === 'de' ? 'Foto folgt' : 'Photo pending'}
        </span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-200 shadow-sm dark:border-neutral-700 ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={t(locale, photo.alt)} className="aspect-[4/3] h-full w-full object-cover" draggable={false} loading="lazy" />
      {photo.todo && (
        <p className="absolute bottom-0 left-0 right-0 bg-black/55 px-2 py-1 font-mono text-[9px] leading-snug text-amber-100">
          {t(locale, photo.todo)}
        </p>
      )}
    </div>
  );
}

function RouteMap({ active, locale }: { active: number; locale: Locale }) {
  const labels = INDIA_JOURNEY_STATIONS.map((s) => t(locale, s.city));
  return (
    <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
      {labels.map((label, i) => (
        <span key={label} className="flex items-center gap-1">
          {i > 0 && <span className="text-neutral-300 dark:text-neutral-600">→</span>}
          <span
            className={`rounded px-1.5 py-0.5 ${i === active ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-200 dark:border-neutral-700'}`}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

function StationPanel({
  station,
  locale,
  index,
}: {
  station: JourneyStation;
  locale: Locale;
  index: number;
}) {
  const copy = INDIA_JOURNEY_COPY;
  return (
    <article
      className={`flex h-full min-h-0 w-full shrink-0 flex-col gap-4 rounded-2xl border p-5 md:grid md:grid-cols-2 md:gap-8 md:p-8 ${toneSurface(station.tone)}`}
      aria-label={t(locale, station.city)}
    >
      <div className="flex min-h-0 flex-col">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          {String(index + 1).padStart(2, '0')} · {t(locale, station.city)}
        </p>
        <span className="mt-2 inline-flex w-fit rounded-full border border-neutral-200/80 bg-white/70 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:border-neutral-600 dark:bg-neutral-900/60 dark:text-neutral-300">
          {toneBadge(station.tone, locale)}
        </span>
        <h4 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-2xl">
          {t(locale, station.headline)}
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{t(locale, station.body)}</p>
        <blockquote className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-white/60 px-3 py-3 dark:border-neutral-600 dark:bg-neutral-900/50">
          <p className="font-mono text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-400">{t(locale, copy.quotePlaceholder)}</p>
        </blockquote>
      </div>
      <JourneyImage photo={station.photo} locale={locale} className="min-h-[12rem] md:min-h-0" />
    </article>
  );
}

function IntroPanel({ locale }: { locale: Locale }) {
  const c = INDIA_JOURNEY_COPY;
  return (
    <div className="flex h-full w-full shrink-0 flex-col justify-center gap-4 px-1 md:max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">{t(locale, c.eyebrow)}</p>
      <h3 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">{t(locale, c.title)}</h3>
      <p className="text-lg text-neutral-600 dark:text-neutral-400">{t(locale, c.subtitle)}</p>
      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{t(locale, c.intro)}</p>
      <p className="font-mono text-xs text-neutral-500">{t(locale, c.roleLine)}</p>
      <RouteMap active={-1} locale={locale} />
    </div>
  );
}

function ElaBridgePanel({ locale }: { locale: Locale }) {
  const c = INDIA_JOURNEY_COPY;
  return (
    <div className="flex h-full w-full shrink-0 flex-col gap-5">
      <div className="max-w-xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">eLearning Africa</p>
        <h4 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{t(locale, c.elaBridge.title)}</h4>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{t(locale, c.elaBridge.body)}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {ELA_JOURNEY_PHOTOS.map((photo, i) => (
          <JourneyImage key={i} photo={photo} locale={locale} className="min-h-0" />
        ))}
      </div>
    </div>
  );
}

type Props = { locale: Locale };

export function V3IndiaJourneyChapter({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [panelIndex, setPanelIndex] = useState(0);

  const panelCount = 1 + INDIA_JOURNEY_STATIONS.length + 1;

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const slideShift = ((panelCount - 1) / panelCount) * 100;
  const xPercent = useTransform(scrollYProgress, [0, 1], ['0%', `-${slideShift}%`]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (mobile || reduceMotion) return;
    const idx = Math.min(panelCount - 1, Math.max(0, Math.round(v * (panelCount - 1))));
    setPanelIndex(idx);
  });

  const paginate = useCallback(
    (delta: number) => {
      setPanelIndex((i) => Math.min(panelCount - 1, Math.max(0, i + delta)));
    },
    [panelCount],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const power = swipePower(info.offset.x, info.velocity.x);
    if (power < -SWIPE_CONFIDENCE) paginate(1);
    else if (power > SWIPE_CONFIDENCE) paginate(-1);
  };

  const copy = INDIA_JOURNEY_COPY;

  if (reduceMotion) {
    return (
      <section id={INDIA_JOURNEY_ID} className="scroll-mt-28 border-t border-neutral-200 py-10 dark:border-neutral-800 md:py-14">
        <div className={`${V3_PAGE} space-y-8`}>
          <IntroPanel locale={locale} />
          {INDIA_JOURNEY_STATIONS.map((s, i) => (
            <StationPanel key={s.id} station={s} locale={locale} index={i} />
          ))}
          <ElaBridgePanel locale={locale} />
        </div>
      </section>
    );
  }

  if (mobile) {
    const slideShiftMobile = (100 / panelCount) * panelIndex;
    return (
      <section id={INDIA_JOURNEY_ID} className="scroll-mt-28 border-t border-neutral-200 py-10 dark:border-neutral-800 md:py-14">
        <div className={V3_PAGE}>
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50/80 p-5 dark:border-neutral-700 dark:from-neutral-950 dark:to-neutral-900/50">
            <V3BlueprintCorners />
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{t(locale, copy.scrollHint)}</p>
            <div className="mt-3">
              <RouteMap active={Math.max(0, panelIndex - 1)} locale={locale} />
            </div>
            <motion.div
              className="mt-4 touch-pan-y overflow-hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={onDragEnd}
            >
              <motion.div
                className="flex"
                style={{ width: `${panelCount * 100}%` }}
                animate={{ x: `-${slideShiftMobile}%` }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                <div className="shrink-0 pr-2" style={{ width: `${100 / panelCount}%` }}>
                  <IntroPanel locale={locale} />
                </div>
                {INDIA_JOURNEY_STATIONS.map((s, i) => (
                  <div key={s.id} className="shrink-0 pr-2" style={{ width: `${100 / panelCount}%` }}>
                    <StationPanel station={s} locale={locale} index={i} />
                  </div>
                ))}
                <div className="shrink-0" style={{ width: `${100 / panelCount}%` }}>
                  <ElaBridgePanel locale={locale} />
                </div>
              </motion.div>
            </motion.div>
            <div className="mt-4 flex items-center justify-between font-mono text-xs text-neutral-500">
              <button type="button" onClick={() => paginate(-1)} disabled={panelIndex === 0} className="disabled:opacity-30">
                ←
              </button>
              <span>
                {panelIndex + 1}/{panelCount}
              </span>
              <button type="button" onClick={() => paginate(1)} disabled={panelIndex >= panelCount - 1} className="disabled:opacity-30">
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={INDIA_JOURNEY_ID}
      className="scroll-mt-28 border-t border-neutral-200 dark:border-neutral-800"
      style={{ height: `${panelCount * 85}vh` }}
      aria-label={t(locale, copy.title)}
    >
      <div className={`sticky top-24 ${V3_PAGE} py-8`} style={{ height: 'calc(100vh - 6.5rem)' }}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50/80 p-6 dark:border-neutral-700 dark:from-neutral-950 dark:to-neutral-900/50 md:p-8">
          <V3BlueprintCorners />
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{t(locale, copy.eyebrow)}</p>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{t(locale, copy.title)}</h3>
            </div>
            <p className="font-mono text-[10px] text-neutral-500">{t(locale, copy.scrollHint)}</p>
          </div>
          <RouteMap active={panelIndex <= 0 ? -1 : Math.min(INDIA_JOURNEY_STATIONS.length - 1, panelIndex - 1)} locale={locale} />
          <div ref={trackRef} className="relative mt-4 min-h-0 flex-1 overflow-hidden">
            <motion.div className="flex h-full" style={{ x: xPercent, width: `${panelCount * 100}%` }}>
              <div className="flex h-full w-full shrink-0 items-center px-2" style={{ width: `${100 / panelCount}%` }}>
                <IntroPanel locale={locale} />
              </div>
              {INDIA_JOURNEY_STATIONS.map((s, i) => (
                <div key={s.id} className="h-full shrink-0 px-2" style={{ width: `${100 / panelCount}%` }}>
                  <StationPanel station={s} locale={locale} index={i} />
                </div>
              ))}
              <div className="h-full shrink-0 px-2" style={{ width: `${100 / panelCount}%` }}>
                <ElaBridgePanel locale={locale} />
              </div>
            </motion.div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tabular-nums text-neutral-400">
            {panelIndex + 1}/{panelCount}
          </p>
        </div>
      </div>
    </section>
  );
}
