'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import { CONTACT_MAILTO } from '@/lib/contact';

interface NavigationProps {
  visible: boolean;
  currentSection?: string;
  /** Return to the point-cloud intro (homepage gate). */
  onLogoClick?: () => void;
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'tools-games', label: 'Tools & Games' },
];

export function Navigation({ visible, currentSection, onLogoClick }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = useCallback((sectionId: string) => {
    setMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Auto-close menu when navigation becomes hidden (e.g. intro re-opened)
  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 sm:top-6 ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <GlassPanel
          variant="heavy"
          padding="none"
          rounded="full"
          className="flex items-center gap-1 px-1.5 py-1.5 sm:gap-1 sm:px-2 sm:py-2"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              if (onLogoClick) onLogoClick();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex min-h-[44px] items-center px-3 py-2.5 text-sm font-semibold tracking-tight text-mk-text transition-colors duration-175 hover:text-accent-cyan sm:px-4 sm:py-2"
          >
            Artjom
          </button>

          <div className="mx-0.5 hidden h-5 w-px bg-[rgba(28,28,28,0.12)] sm:mx-1 sm:block" />

          {/* Desktop nav items */}
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm transition-all duration-175 ${
                  currentSection === item.id
                    ? 'bg-[rgba(20,184,166,0.12)] text-accent-cyan'
                    : 'text-mk-text-secondary hover:bg-[rgba(28,28,28,0.06)] hover:text-mk-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mx-0.5 hidden h-5 w-px bg-[rgba(28,28,28,0.12)] sm:mx-1 sm:block" />

          {/* Desktop contact */}
          <a
            href={CONTACT_MAILTO}
            className="hidden min-h-[44px] items-center rounded-full bg-[#1C1C1C] px-4 py-2 text-sm text-white transition-colors duration-175 hover:bg-accent-cyan sm:flex"
          >
            Hire Me
          </a>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-full text-mk-text transition-colors hover:bg-[rgba(28,28,28,0.06)] sm:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </GlassPanel>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && visible && (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Menü schließen"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[rgba(28,28,28,0.32)] backdrop-blur-[2px] sm:hidden"
            />
            <motion.div
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-[calc(theme(spacing.4)+64px)] z-50 sm:hidden"
            >
              <GlassPanel variant="heavy" padding="none" rounded="lg" className="overflow-hidden">
                <ul className="flex flex-col py-2">
                  {NAV_ITEMS.map((item) => {
                    const active = currentSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`flex w-full items-center justify-between px-5 py-3.5 text-base font-medium transition-colors ${
                            active
                              ? 'bg-[rgba(20,184,166,0.10)] text-accent-cyan'
                              : 'text-mk-text hover:bg-[rgba(28,28,28,0.05)]'
                          }`}
                        >
                          <span>{item.label}</span>
                          <svg
                            className="h-4 w-4 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-[rgba(28,28,28,0.08)] p-3">
                  <a
                    href={CONTACT_MAILTO}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#1C1C1C] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-accent-cyan"
                  >
                    Hire Me
                  </a>
                </div>
              </GlassPanel>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
