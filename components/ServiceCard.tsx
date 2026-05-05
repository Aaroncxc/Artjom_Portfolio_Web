'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Service, ServiceMedia } from '@/lib/services';
import { accentTokens } from '@/lib/services';
import { ServicePlaceholder } from './ServicePlaceholder';

export type ServiceCardLevel = 'collapsed' | 'preview' | 'detail';

interface ServiceCardProps {
  service: Service;
  level: ServiceCardLevel;
  /** From collapsed: open square preview */
  onOpenPreview: () => void;
  /** From preview: open full detail (Details control only) */
  onOpenDetail: () => void;
  /** From preview: tap hero — collapse back to folded strip */
  onCollapsePreview: () => void;
  onClose: () => void;
  mailtoHref: string;
}

function buildDisplaySamples(
  service: Service
): Array<ServiceMedia | { type: 'placeholder' }> {
  const real = service.samples.slice(0, 4);
  const padded: Array<ServiceMedia | { type: 'placeholder' }> = [...real];
  while (padded.length < 4) padded.push({ type: 'placeholder' });
  return padded;
}

function HeroMedia({ service }: { service: Service }) {
  if (service.hero.type === 'video') {
    return (
      <video
        src={service.hero.src}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <img
      src={service.hero.src}
      alt={service.hero.alt ?? service.title}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}

export function ServiceCard({
  service,
  level,
  onOpenPreview,
  onOpenDetail,
  onCollapsePreview,
  onClose,
  mailtoHref,
}: ServiceCardProps) {
  const tokens = accentTokens[service.accent];
  const isContactTile = service.contactTile === true;

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  useEffect(() => {
    setActiveMediaIdx(0);
  }, [service.slug, level]);

  useEffect(() => {
    if (level !== 'detail') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [level, onClose]);

  const displaySamples = useMemo(() => buildDisplaySamples(service), [service]);
  const activeMedia =
    activeMediaIdx === 0 ? service.hero : service.samples[activeMediaIdx - 1];

  const baseCardClass =
    'group relative w-full overflow-hidden rounded-2xl border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.65)] backdrop-blur-[16px] transition-colors duration-300';

  if (level === 'collapsed') {
    return (
      <motion.button
        type="button"
        onClick={onOpenPreview}
        whileHover={{ y: -2 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className={`${baseCardClass} h-24 text-left hover:bg-[rgba(255,255,255,0.85)] hover:shadow-[0_12px_40px_rgba(28,28,28,0.10)] sm:h-28 ${tokens.ring}`}
        style={{ ['--accent-rgb' as string]: tokens.rgb }}
        aria-label={`${service.title} — open preview`}
      >
        <span className="pointer-events-none absolute inset-0 z-[0] opacity-20">
          <HeroMedia service={service} />
        </span>

        <span className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-white/85 via-white/55 to-white/15" />

        <span className="absolute inset-0 z-[2] flex flex-col justify-center pl-5 pr-16 sm:pl-6 sm:pr-20">
          <h3 className="mb-1 text-lg font-bold text-mk-text brand-tight sm:text-xl">
            {service.title}
          </h3>
          <p className="line-clamp-1 text-xs leading-relaxed text-mk-text-secondary sm:text-sm">
            {service.tagline}
          </p>
        </span>

        <span className="absolute right-4 top-1/2 z-[3] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(28,28,28,0.1)] bg-white/90 text-mk-text shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </motion.button>
    );
  }

  if (level === 'preview') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className={`${baseCardClass} flex aspect-square flex-col text-left hover:bg-[rgba(255,255,255,0.85)] hover:shadow-[0_12px_40px_rgba(28,28,28,0.10)] ${tokens.ring}`}
        style={{ ['--accent-rgb' as string]: tokens.rgb }}
      >
        <div
          role="button"
          tabIndex={0}
          className="relative flex-1 basis-0 cursor-pointer overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[rgba(28,28,28,0.2)]"
          onClick={onCollapsePreview}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCollapsePreview();
            }
          }}
          aria-label={`${service.title} — einklappen`}
        >
          <span
            className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br ${tokens.glow} opacity-60 transition-opacity duration-500 group-hover:opacity-90`}
          />
          <HeroMedia service={service} />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-[rgba(28,28,28,0.55)] via-[rgba(28,28,28,0.15)] to-transparent" />
          <span
            className={`pointer-events-none absolute left-3 top-3 z-[3] rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${tokens.chip} backdrop-blur-sm`}
          >
            {isContactTile ? 'Collab' : 'Service'}
          </span>
          <button
            type="button"
            className="absolute bottom-3 right-3 z-[3] inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-mk-text shadow-[0_4px_14px_rgba(28,28,28,0.18)] transition-colors hover:bg-white"
            aria-label={`${service.title} — Details anzeigen`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail();
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Details
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <span className="block shrink-0 p-4 sm:p-5">
          <h3 className="mb-1 text-base font-bold text-mk-text brand-tight sm:text-lg">
            {service.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-mk-text-secondary sm:text-sm">
            {service.tagline}
          </p>
        </span>
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseCardClass} bg-white shadow-[0_20px_60px_rgba(28,28,28,0.12)]`}
      style={{ ['--accent-rgb' as string]: tokens.rgb }}
      id={`service-detail-${service.slug}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,28,28,0.1)] bg-white/95 text-mk-text shadow-[0_4px_16px_rgba(28,28,28,0.12)] backdrop-blur-sm transition-colors hover:bg-white"
        aria-label="Schließen"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="h-1.5 w-full" style={{ background: `rgb(${tokens.rgb})` }} />

      <div className="grid lg:grid-cols-[1.4fr,1fr]">
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[rgba(28,28,28,0.04)]">
            {activeMedia ? (
              activeMedia.type === 'video' ? (
                <video
                  key={activeMedia.src}
                  src={activeMedia.src}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <img
                  key={activeMedia.src}
                  src={activeMedia.src}
                  alt={activeMedia.alt ?? service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )
            ) : (
              <ServicePlaceholder accent={service.accent} className="absolute inset-0" />
            )}

            <div
              className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-20"
              style={{
                background: `linear-gradient(135deg, rgba(${tokens.rgb}, 0.35) 0%, transparent 60%)`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {displaySamples.map((sample, i) => {
              const realMediaIdx = service.samples[i] ? i + 1 : -1;
              const isActiveMedia =
                realMediaIdx === activeMediaIdx ||
                (i === 0 && activeMediaIdx === 0 && service.samples.length === 0);

              if (sample.type === 'placeholder') {
                return (
                  <div
                    key={`placeholder-${i}`}
                    className="relative aspect-square overflow-hidden rounded-xl border border-[rgba(28,28,28,0.06)] opacity-90"
                  >
                    <ServicePlaceholder accent={service.accent} variant="mini" className="absolute inset-0" />
                  </div>
                );
              }

              return (
                <button
                  key={sample.src}
                  type="button"
                  onClick={() => setActiveMediaIdx(realMediaIdx)}
                  className={`relative aspect-square overflow-hidden rounded-xl border transition-all ${
                    isActiveMedia
                      ? 'border-[rgba(28,28,28,0.5)] shadow-[0_4px_14px_rgba(28,28,28,0.10)]'
                      : 'border-[rgba(28,28,28,0.08)] hover:border-[rgba(28,28,28,0.25)]'
                  }`}
                >
                  {sample.type === 'video' ? (
                    <video
                      src={sample.src}
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={sample.src}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {service.samples.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveMediaIdx(0)}
              className={`mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeMediaIdx === 0
                  ? 'bg-[rgba(28,28,28,0.06)] text-mk-text'
                  : 'text-mk-text-muted hover:bg-[rgba(28,28,28,0.04)] hover:text-mk-text'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: `rgb(${tokens.rgb})` }} />
              Show hero
            </button>
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-6 lg:pb-8 lg:pl-2 lg:pr-8 lg:pt-8">
          <span
            className={`mb-4 inline-flex self-start rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${tokens.chip}`}
          >
            {isContactTile ? 'Collab' : 'Service'}
          </span>

          <h2 className="mb-2 text-3xl font-semibold leading-tight text-mk-text brand-tight sm:text-4xl">
            {service.title}
          </h2>
          <p className="mb-5 text-base leading-relaxed text-mk-text-secondary sm:text-lg">
            {service.tagline}
          </p>

          <p className="mb-6 text-sm leading-relaxed text-mk-text-secondary sm:text-base">
            {service.description}
          </p>

          <div className="mb-7">
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
              What we deliver
            </h4>
            <ul className="space-y-2">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm leading-relaxed text-mk-text">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: `rgb(${tokens.rgb})` }}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(28,28,28,0.18)] transition-all hover:opacity-90 sm:px-6"
              style={{ background: `rgb(${tokens.rgb})` }}
            >
              Send inquiry
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(28,28,28,0.05)] px-5 py-3 text-sm font-medium text-mk-text transition-colors hover:bg-[rgba(28,28,28,0.10)] sm:px-6"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
