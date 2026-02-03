'use client';

import { useState, useEffect } from 'react';
import { GlobalBackgroundAurora } from '@/components/GlobalBackgroundAurora';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { Navigation } from '@/components/Navigation';
import { AboutSection } from '@/components/AboutSection';
import { ProjectsGrid } from '@/components/ProjectsGrid';
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
      const projectsSection = document.getElementById('projects');
      
      if (projectsSection && scrollY >= projectsSection.offsetTop - 200) {
        setCurrentSection('projects');
      } else if (aboutSection && scrollY >= aboutSection.offsetTop - 200) {
        setCurrentSection('about');
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

        {/* About Section - Accordion */}
        <AboutSection visible={true} />

        {/* Footer */}
        <footer className="relative z-10 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass-panel p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">multikunst</h3>
                  <p className="text-mk-text-secondary text-sm leading-relaxed">
                    A creative collective exploring art, design, and technology.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4 text-mk-text-muted uppercase tracking-wider">Navigate</h4>
                  <ul className="space-y-2">
                    <li><a href="#about" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm">About</a></li>
                    <li><a href="#projects" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm">Projects</a></li>
                    <li><a href="mailto:hello@multikunst.com" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4 text-mk-text-muted uppercase tracking-wider">Connect</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm">Instagram</a></li>
                    <li><a href="#" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm">Twitter</a></li>
                    <li><a href="#" className="text-mk-text-secondary hover:text-accent-cyan transition-colors text-sm">GitHub</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[rgba(28,28,28,0.08)] text-center">
                <p className="text-xs text-mk-text-muted">
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
