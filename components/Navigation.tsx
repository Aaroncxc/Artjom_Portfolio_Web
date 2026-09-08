'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CONTACT_MAILTO } from '@/lib/contact';
import { INTRO_NAV_LINE } from '@/lib/introCopy';
import { useCenteredNavLine } from '@/lib/useCenteredNavLine';

interface NavigationProps {
  visible: boolean;
  /** Return to the point-cloud intro (homepage gate). */
  onLogoClick?: () => void;
}

export function Navigation({ visible, onLogoClick }: NavigationProps) {
  const pathname = usePathname();
  const isIntro = pathname === '/intro' || pathname?.startsWith('/intro/');
  const scrollLine = useCenteredNavLine(visible && !isIntro);
  const line = isIntro ? INTRO_NAV_LINE.en : scrollLine;
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <nav
      className={`fixed inset-x-0 top-4 z-50 px-5 transition-all duration-500 sm:top-6 sm:px-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
      }`}
    >
      <GlassPanel
        variant="heavy"
        padding="none"
        rounded="2xl"
        className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl px-1.5 py-1.5 sm:rounded-3xl sm:px-2 sm:py-2"
      >
        {isIntro ? (
          <Link
            href="/?skipHero=true"
            className="flex min-h-[44px] items-center justify-self-start px-3 py-2.5 text-sm font-semibold tracking-tight text-mk-text transition-colors duration-175 hover:text-accent-cyan sm:px-4 sm:py-2"
          >
            Artjom
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onLogoClick) onLogoClick();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex min-h-[44px] items-center justify-self-start px-3 py-2.5 text-sm font-semibold tracking-tight text-mk-text transition-colors duration-175 hover:text-accent-cyan sm:px-4 sm:py-2"
          >
            Artjom
          </button>
        )}

        <div className="relative min-w-[11rem] max-w-[min(100%,32rem)] justify-self-center overflow-hidden px-1 sm:min-w-[18rem] sm:px-3">
          <p
            aria-hidden
            className="invisible truncate text-center font-sans text-[11px] font-bold leading-[1.15] sm:text-sm md:text-[15px]"
          >
            {line}
          </p>
          <AnimatePresence initial={false}>
            <motion.p
              key={line}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -7 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="brand-tight absolute inset-0 truncate text-center font-sans text-[11px] font-bold leading-[1.15] text-mk-text sm:text-sm md:text-[15px]"
            >
              {line}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-self-end gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/intro"
            aria-current={isIntro ? 'page' : undefined}
            className={`flex min-h-[44px] items-center rounded-full px-3 py-2 text-sm transition-colors duration-175 sm:px-3.5 ${
              isIntro
                ? 'font-semibold text-accent-cyan'
                : 'text-mk-text-secondary hover:text-accent-cyan'
            }`}
          >
            Intro
          </Link>
          <a
            href={CONTACT_MAILTO}
            className="btn-solid flex min-h-[44px] items-center rounded-full px-3.5 py-2 text-sm transition-colors duration-175 sm:px-4"
          >
            Hire Me
          </a>
        </div>
      </GlassPanel>
    </nav>
  );
}
