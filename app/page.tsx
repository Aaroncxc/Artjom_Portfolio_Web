'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { Navigation } from '@/components/Navigation';
import { AboutSection } from '@/components/AboutSection';
import { HighlightBentoSection } from '@/components/HighlightBentoSection';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { ToolsGamesGrid } from '@/components/ToolsGamesGrid';
import { TextPointCloudHero } from '@/components/TextPointCloudHero';
import { CONTACT_MAILTO } from '@/lib/contact';

export default function Home() {
  const [heroDismissed, setHeroDismissed] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const [currentSection, setCurrentSection] = useState<string>('');
  /** Sub-`md` viewports get a shorter hero-gate dissolve (faster disconnect of intro canvas after tap). */
  const [narrowViewport, setNarrowViewport] = useState(false);

  // Allow skipping the cinematic intro via ?skipHero=true or hash deep-link (#projects, #about, …).
  // Useful on mobile where the canvas sometimes swallows the first tap, and for direct deep links.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const skipParam = url.searchParams.get('skipHero');
    const hasHashTarget = /^#\w/.test(window.location.hash || '');
    if (skipParam === 'true' || skipParam === '1' || hasHashTarget) {
      setHeroDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setNarrowViewport(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  // Lock scroll while the intro hero is up — also blocks touch scroll on iOS/Android
  useEffect(() => {
    if (heroDismissed) return undefined;
    document.documentElement.classList.add('hero-locked');
    document.body.classList.add('hero-locked');
    return () => {
      document.documentElement.classList.remove('hero-locked');
      document.body.classList.remove('hero-locked');
    };
  }, [heroDismissed]);

  // Scroll-spy: detect current section once the hero is gone
  useEffect(() => {
    if (!heroDismissed) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 200;

      const aboutSection = document.getElementById('about');
      const highlightsSection = document.getElementById('highlights');
      const projectsSection = document.getElementById('projects');
      const toolsGamesSection = document.getElementById('tools-games');

      if (toolsGamesSection && scrollY >= toolsGamesSection.offsetTop - offset) {
        setCurrentSection('tools-games');
      } else if (projectsSection && scrollY >= projectsSection.offsetTop - offset) {
        setCurrentSection('projects');
      } else if (highlightsSection && scrollY >= highlightsSection.offsetTop - offset) {
        setCurrentSection('highlights');
      } else if (aboutSection && scrollY >= aboutSection.offsetTop - offset) {
        setCurrentSection('about');
      } else {
        setCurrentSection('about');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroDismissed]);

  const openIntro = useCallback(() => {
    window.scrollTo(0, 0);
    setIntroKey((k) => k + 1);
    setHeroDismissed(false);
  }, []);

  return (
    <>
      {/* Light Leaks Background - pearl gradient with subtle color blobs */}
      <LightLeaksBackground />

      {/* Cinematic intro gate */}
      <AnimatePresence>
        {!heroDismissed && (
          <motion.div
            key="hero-gate"
            initial={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: 80,
              scale: 1.04,
              filter: 'blur(10px)',
            }}
            transition={{ duration: narrowViewport ? 0.55 : 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100]"
            style={{ willChange: 'opacity, transform, filter' }}
          >
            <TextPointCloudHero key={introKey} onActivate={() => setHeroDismissed(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation appears as soon as the gate dissolves */}
      <Navigation visible={heroDismissed} currentSection={currentSection} onLogoClick={openIntro} />

      {/* Main Content - revealed after the gate */}
      <motion.main
        className="relative z-[5]"
        initial={false}
        animate={{
          opacity: heroDismissed ? 1 : 0,
          y: heroDismissed ? 0 : -40,
          scale: heroDismissed ? 1 : 0.97,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
          delay: heroDismissed ? 0.2 : 0,
        }}
        style={{
          pointerEvents: heroDismissed ? 'auto' : 'none',
        }}
        aria-hidden={!heroDismissed}
      >
        {/* About Section - first content the visitor sees */}
        <AboutSection visible={true} />

        <HighlightBentoSection visible={true} />

        {/* Projects Section - Instagram-style Grid */}
        <ProjectsGrid visible={true} />

        {/* Tools & Games Section */}
        <ToolsGamesGrid visible={true} />

        {/* Footer */}
        <footer className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass-panel p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Artjom Naninjan</h3>
                  <p className="text-mk-text-secondary text-sm leading-relaxed">
                    3D Generalist, Architect &amp; App Developer building immersive digital experiences at the intersection of art, design, and technology.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3 sm:mb-4 text-mk-text-muted uppercase tracking-wider">Navigate</h4>
                  <ul className="space-y-1">
                    <li><a href="#about" className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">About</a></li>
                    <li><a href="#projects" className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">Projects</a></li>
                    <li><a href="#tools-games" className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">Tools &amp; Games</a></li>
                    <li><a href={CONTACT_MAILTO} className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3 sm:mb-4 text-mk-text-muted uppercase tracking-wider">Connect</h4>
                  <ul className="space-y-1">
                    <li><a href="#" className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">Instagram</a></li>
                    <li><a href="#" className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">Behance</a></li>
                    <li><a href="#" className="inline-flex min-h-[44px] items-center text-sm text-mk-text-secondary transition-colors hover:text-accent-cyan">LinkedIn</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[rgba(28,28,28,0.08)] text-center">
                <p className="text-xs sm:text-sm text-mk-text-muted">
                  © {new Date().getFullYear()} Artjom Naninjan. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </motion.main>
    </>
  );
}
