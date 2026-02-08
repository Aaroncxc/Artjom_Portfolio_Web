'use client';

import { useCallback } from 'react';
import { GlassPanel } from './GlassPanel';

interface NavigationProps {
  visible: boolean;
  currentSection?: string;
}

export function Navigation({ visible, currentSection }: NavigationProps) {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navItems = [
    { id: 'projects', label: 'Projects' },
    { id: 'tools-games', label: 'Tools & Games' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <GlassPanel 
        variant="heavy" 
        padding="none" 
        rounded="full"
        className="px-1.5 sm:px-2 py-1.5 sm:py-2 flex items-center gap-0.5 sm:gap-1"
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-tight text-mk-text hover:text-accent-cyan transition-colors duration-175 min-h-[44px] flex items-center"
        >
          multikunst
        </button>

        <div className="w-px h-5 bg-[rgba(28,28,28,0.12)] mx-0.5 sm:mx-1 hidden sm:block" />

        {/* Nav items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`px-2.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-175 min-h-[44px] flex items-center ${
              currentSection === item.id
                ? 'text-accent-cyan bg-[rgba(20,184,166,0.12)]'
                : 'text-mk-text-secondary hover:text-mk-text hover:bg-[rgba(28,28,28,0.06)]'
            }`}
          >
            {item.label}
          </button>
        ))}

        <div className="w-px h-5 bg-[rgba(28,28,28,0.12)] mx-0.5 sm:mx-1 hidden sm:block" />

        {/* Contact */}
        <a
          href="mailto:hello@multikunst.com"
          className="px-2.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm text-white bg-[#1C1C1C] rounded-full hover:bg-accent-cyan transition-colors duration-175 min-h-[44px] flex items-center"
        >
          Contact
        </a>
      </GlassPanel>
    </nav>
  );
}
