'use client';

import { useState, useEffect } from 'react';
import { GlobalBackgroundAurora } from '@/components/GlobalBackgroundAurora';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { Navigation } from '@/components/Navigation';
import { AboutSection } from '@/components/AboutSection';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { ToolsGamesGrid } from '@/components/ToolsGamesGrid';
import { TextPointCloudHero } from '@/components/TextPointCloudHero';

export default function Home() {
  const [showNav, setShowNav] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('');

  // Track scroll position for nav and sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.3;
      setShowNav(scrollY > threshold);

      // Determine current section
      const aboutSection = document.getElementById('about');
      const toolsGamesSection = document.getElementById('tools-games');
      const projectsSection = document.getElementById('projects');
      
      if (aboutSection && scrollY >= aboutSection.offsetTop - 200) {
        setCurrentSection('about');
      } else if (toolsGamesSection && scrollY >= toolsGamesSection.offsetTop - 200) {
        setCurrentSection('tools-games');
      } else if (projectsSection && scrollY >= projectsSection.offsetTop - 200) {
        setCurrentSection('projects');
      } else {
        setCurrentSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Light Leaks Background - pearl gradient with subtle color blobs */}
      <LightLeaksBackground />
      
      {/* Hero Section - Text Pointcloud */}
      <TextPointCloudHero />

      {/* Navigation */}
      <Navigation visible={showNav} currentSection={currentSection} />

      {/* Main Content */}
      <main className="relative z-[5]">
        {/* Projects Section - Instagram-style Grid */}
        <ProjectsGrid visible={true} />

        {/* Tools & Games Section */}
        <ToolsGamesGrid visible={true} />

        {/* About Section - Accordion */}
        <AboutSection visible={true} />

        {/* Footer */}
        <footer className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass-panel p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">multikunst</h3>
                  <p className="text-mk-text-secondary text-sm leading-relaxed">
                    A creative collective exploring art, design, and technology.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3 sm:mb-4 text-mk-text-muted uppercase tracking-wider">Navigate</h4>
                  <ul className="space-y-2.5 sm:space-y-2">
                    <li><a href="#projects" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">Projects</a></li>
                    <li><a href="#tools-games" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">Tools & Games</a></li>
                    <li><a href="#about" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">About</a></li>
                    <li><a href="mailto:hello@multikunst.com" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3 sm:mb-4 text-mk-text-muted uppercase tracking-wider">Connect</h4>
                  <ul className="space-y-2.5 sm:space-y-2">
                    <li><a href="#" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">Instagram</a></li>
                    <li><a href="#" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">Twitter</a></li>
                    <li><a href="#" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm py-1 inline-block">GitHub</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[rgba(28,28,28,0.08)] text-center">
                <p className="text-xs sm:text-sm text-mk-text-muted">
                  © {new Date().getFullYear()} multikunst. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
