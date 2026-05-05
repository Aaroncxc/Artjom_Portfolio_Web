'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Service, ServiceMedia } from '@/lib/services';
import { accentTokens } from '@/lib/services';
import { ServiceMediaVideo } from './ServiceMediaVideo';
import { ServicePlaceholder } from './ServicePlaceholder';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  indexLabel?: string;
  mailtoHref: string;
}

// Build a list of 4 displayable sample tiles, padding with placeholders if needed.
function buildDisplaySamples(service: Service): Array<ServiceMedia | { type: 'placeholder' }> {
  const real = service.samples.slice(0, 4);
  const padded: Array<ServiceMedia | { type: 'placeholder' }> = [...real];
  const minTiles = 4;
  while (padded.length < minTiles) padded.push({ type: 'placeholder' });
  return padded;
}

export function ServiceModal({
  service,
  onClose,
  onNavigate,
  indexLabel,
  mailtoHref,
}: ServiceModalProps) {
  const tokens = accentTokens[service.accent];
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  // Reset selected media when the service changes
  useEffect(() => {
    setActiveMediaIdx(0);
  }, [service.slug]);

  // Keyboard handlers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNavigate]);

  // Lock scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const displaySamples = useMemo(() => buildDisplaySamples(service), [service]);
  const activeMedia = activeMediaIdx === 0 ? service.hero : service.samples[activeMediaIdx - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto touch-pan-y pt-20 md:pt-24 pb-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[rgba(250,250,255,0.92)] backdrop-blur-md" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        aria-label="Close"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev/Next buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('prev');
        }}
        className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
        aria-label="Previous service"
      >
        <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('next');
        }}
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
        aria-label="Next service"
      >
        <svg className="w-5 h-5 text-mk-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[85] w-full max-w-6xl mx-auto my-0 px-4 md:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(28,28,28,0.18)] overflow-hidden border border-[rgba(28,28,28,0.06)]">
          {/* Color band */}
          <div
            className="h-1.5 w-full"
            style={{ background: `rgb(${tokens.rgb})` }}
          />

          <div className="grid lg:grid-cols-[1.4fr,1fr]">
            {/* Left column: media */}
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Active media frame */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[rgba(28,28,28,0.04)]">
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
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <ServicePlaceholder accent={service.accent} className="absolute inset-0" />
                )}

                {/* Soft accent overlay */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
                  style={{
                    background: `linear-gradient(135deg, rgba(${tokens.rgb}, 0.35) 0%, transparent 60%)`,
                  }}
                />
              </div>

              {/* Sample thumbnail strip */}
              <div className="mt-4 grid grid-cols-4 gap-2.5">
                {displaySamples.map((sample, i) => {
                  const realMediaIdx = service.samples[i] ? i + 1 : -1;
                  const isActiveMedia =
                    realMediaIdx === activeMediaIdx ||
                    (i === 0 && activeMediaIdx === 0 && service.samples.length === 0);

                  if (sample.type === 'placeholder') {
                    return (
                      <div
                        key={`placeholder-${i}`}
                        className="relative aspect-square rounded-xl overflow-hidden border border-[rgba(28,28,28,0.06)] opacity-90"
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
                      className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
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
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hero thumbnail (small chip to jump back to hero) */}
              {service.samples.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveMediaIdx(0)}
                  className={`mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeMediaIdx === 0
                      ? 'text-mk-text'
                      : 'text-mk-text-muted hover:text-mk-text'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: `rgb(${tokens.rgb})` }}
                  />
                  Show hero
                </button>
              )}
            </div>

            {/* Right column: info */}
            <div className="p-5 sm:p-6 lg:p-8 lg:pl-2 flex flex-col">
              <span
                className={`inline-flex self-start px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] ${tokens.chip} mb-4`}
              >
                {service.contactTile ? 'Collab' : 'Service'}
              </span>

              <h2 className="text-3xl sm:text-4xl font-semibold text-mk-text leading-tight brand-tight mb-2">
                {service.title}
              </h2>
              <p className="text-base sm:text-lg text-mk-text-secondary leading-relaxed mb-5">
                {service.tagline}
              </p>

              <p className="text-sm sm:text-base text-mk-text-secondary leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Bullets */}
              <div className="mb-7">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted mb-3">
                  What we deliver
                </h4>
                <ul className="space-y-2">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-sm text-mk-text leading-relaxed"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: `rgb(${tokens.rgb})` }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full text-white text-sm font-medium transition-all shadow-[0_8px_24px_rgba(28,28,28,0.18)] hover:opacity-90"
                  style={{ background: `rgb(${tokens.rgb})` }}
                >
                  Send inquiry
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[rgba(28,28,28,0.05)] text-mk-text text-sm font-medium hover:bg-[rgba(28,28,28,0.10)] transition-colors"
                >
                  All services
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Index counter */}
      {indexLabel && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
          <div className="px-4 py-2 rounded-full bg-white/85 backdrop-blur-sm border border-[rgba(28,28,28,0.1)] shadow-lg">
            <span className="text-xs font-medium text-mk-text">{indexLabel}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
