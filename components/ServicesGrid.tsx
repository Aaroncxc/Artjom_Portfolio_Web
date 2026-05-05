'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { services, buildServiceMailto, CONTACT_MAILTO } from '@/lib/services';
import { BrandsMarquee } from './BrandsMarquee';
import { ServiceCard, type ServiceCardLevel } from './ServiceCard';

interface ServicesGridProps {
  visible: boolean;
}

export function ServicesGrid({ visible }: ServicesGridProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<'preview' | 'detail'>('preview');

  const closeExpanded = useCallback(() => {
    setExpandedSlug(null);
    setExpandedLevel('preview');
  }, []);

  const openPreview = useCallback((slug: string) => {
    setExpandedSlug(slug);
    setExpandedLevel('preview');
  }, []);

  const openDetailFor = useCallback(
    (slug: string) => {
      if (expandedSlug === slug && expandedLevel === 'preview') {
        setExpandedLevel('detail');
      }
    },
    [expandedSlug, expandedLevel]
  );

  const collapsePreviewIfOpen = useCallback(
    (slug: string) => {
      if (expandedSlug === slug && expandedLevel === 'preview') {
        closeExpanded();
      }
    },
    [expandedSlug, expandedLevel, closeExpanded]
  );

  useEffect(() => {
    if (!expandedSlug || expandedLevel !== 'detail') return;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById(`service-detail-${expandedSlug}`);
      if (!el) return;
      const navOffset = 96;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(id);
  }, [expandedSlug, expandedLevel]);

  if (!visible) return null;

  return (
    <section id="services" className="relative pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted mb-3">
            What we offer
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-mk-text mb-5 leading-[1.05] brand-tight">
            Services for the curious.
          </h2>
          <p className="text-base sm:text-lg text-mk-text-secondary leading-relaxed">
            We are a collective and agency for everything between idea and pixel.
            Explore our disciplines or message us directly &mdash; we are happy to review your brief.
          </p>
        </div>

        <motion.div
          layout
          transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="grid items-start grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {services.map((service, i) => {
            const isExpanded = expandedSlug === service.slug;
            const level: ServiceCardLevel = !isExpanded
              ? 'collapsed'
              : expandedLevel;

            return (
              <motion.div
                key={service.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.4, delay: i * 0.05 },
                  y: { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
                }}
                className={level === 'detail' ? 'col-span-full' : ''}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={level}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ServiceCard
                      service={service}
                      level={level}
                      onOpenPreview={() => openPreview(service.slug)}
                      onOpenDetail={() => openDetailFor(service.slug)}
                      onCollapsePreview={() => collapsePreviewIfOpen(service.slug)}
                      onClose={closeExpanded}
                      mailtoHref={buildServiceMailto(service)}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[rgba(99,102,241,0.10)] via-[rgba(20,184,166,0.08)] to-[rgba(244,63,94,0.10)] border border-[rgba(28,28,28,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
        >
          <div className="max-w-xl">
            <h3 className="text-xl sm:text-2xl font-semibold text-mk-text brand-tight mb-1">
              Ready to start something?
            </h3>
            <p className="text-sm sm:text-base text-mk-text-secondary leading-relaxed">
              A concept, a brief, or just a collaboration idea &mdash; one message is enough.
              We usually reply within 48 hours.
            </p>
          </div>
          <a
            href={`${CONTACT_MAILTO}?subject=${encodeURIComponent('Hello Multikunst')}`}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#1C1C1C] text-white text-sm font-medium hover:bg-accent-cyan transition-colors duration-200 shadow-[0_8px_24px_rgba(28,28,28,0.18)]"
          >
            Send inquiry
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>

        <BrandsMarquee />
      </div>
    </section>
  );
}
