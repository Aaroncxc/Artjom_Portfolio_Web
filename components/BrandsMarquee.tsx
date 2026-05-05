'use client';

import { motion } from 'framer-motion';
import { brandLogos } from '@/lib/brands';

const cardShellClass =
  'relative h-[7.75rem] w-[204px] shrink-0 overflow-hidden rounded-2xl border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.45)] shadow-md backdrop-blur-sm sm:h-[10rem] sm:w-[258px] sm:rounded-3xl';

function LogoRow({ suffix }: { suffix: string }) {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
      {brandLogos.map((brand, i) => (
        <div key={`${suffix}-${i}`} className={cardShellClass}>
          <img
            src={brand.src}
            alt=""
            loading="lazy"
            className="h-full w-full bg-transparent object-contain p-0"
          />
        </div>
      ))}
    </div>
  );
}

export function BrandsMarquee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 sm:mt-28"
    >
      <p className="mb-10 px-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-mk-text-muted sm:mb-12 sm:text-base sm:tracking-[0.26em]">
        Partner, mit denen wir zusammengearbeitet haben
      </p>

      {/* Static grid when user prefers reduced motion */}
      <div
        className="motion-reduce:flex hidden flex-wrap items-center justify-center gap-6 px-4 py-4 sm:gap-8 sm:py-5"
        aria-label="Logos von Partnern und Kunden"
      >
        {brandLogos.map((brand) => (
          <div key={brand.src} className={cardShellClass}>
            <img
              src={brand.src}
              alt={brand.alt}
              loading="lazy"
              className="h-full w-full bg-transparent object-contain p-0"
            />
          </div>
        ))}
      </div>

      <div
        className="relative motion-reduce:hidden w-screen max-w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden py-6 sm:py-8 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        aria-label="Logos von Partnern und Kunden"
        role="presentation"
      >
        <div className="flex w-max animate-marquee will-change-transform">
          <LogoRow suffix="a" />
          <LogoRow suffix="b" />
        </div>
      </div>
    </motion.div>
  );
}
