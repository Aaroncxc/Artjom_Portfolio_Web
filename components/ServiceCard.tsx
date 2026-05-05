'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Service, ServiceMedia } from '@/lib/services';
import { accentTokens } from '@/lib/services';
import { ServiceMediaVideo } from './ServiceMediaVideo';
import { ServicePlaceholder } from './ServicePlaceholder';

export type ServiceCardLevel = 'collapsed' | 'detail';

interface ServiceCardProps {
  service: Service;
  level: ServiceCardLevel;
  /** From collapsed strip: open full detail panel */
  onOpen: () => void;
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
      <ServiceMediaVideo
        media={service.hero}
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
  onOpen,
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
        onClick={onOpen}
        whileHover={{ y: -2 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className={`${baseCardClass} h-24 text-left hover:bg-[rgba(255,255,255,0.85)] hover:shadow-[0_12px_40px_rgba(28,28,28,0.10)] sm:h-28 ${tokens.ring}`}
        style={{ ['--accent-rgb' as string]: tokens.rgb }}
        aria-label={`${service.title} — Details anzeigen`}
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

  return (
    <div
      className={`${baseCardClass} bg-white shadow-[0_20px_60px_rgba(28,28,28,0.12)]`}
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

      <div className="grid lg:grid-cols-[1.4fr,1fr]">
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[rgba(28,28,28,0.04)]">
            {activeMedia ? (
              activeMedia.type === 'video' ? (
                <ServiceMediaVideo
                  media={activeMedia}
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
                    <ServiceMediaVideo
                      media={sample}
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
              <span className="h-2 w-2 rounded-full bg-[rgba(28,28,28,0.35)]" />
              Show hero
            </button>
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-6 lg:pb-8 lg:pl-2 lg:pr-8 lg:pt-8">
          <span className="mb-4 inline-flex self-start rounded-full border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.04)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-mk-text-secondary">
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
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[rgba(28,28,28,0.28)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(28,28,28,0.18)] transition-colors hover:bg-[#2a2a2a] sm:px-6"
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
