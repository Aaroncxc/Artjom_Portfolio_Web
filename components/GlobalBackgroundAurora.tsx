'use client';

import { useEffect, useState } from 'react';

export function GlobalBackgroundAurora() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient - White Elegance */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FAFAFF 0%, #EEF0F2 40%, #ECEBE4 100%)',
        }}
      />
      
      {/* Aurora blobs - subtle for light theme */}
      <div 
        className={`aurora-blob ${prefersReducedMotion ? '' : 'animate-aurora'}`}
        style={{
          width: '60vw',
          height: '60vw',
          top: '-20%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div 
        className={`aurora-blob ${prefersReducedMotion ? '' : 'animate-aurora'}`}
        style={{
          width: '50vw',
          height: '50vw',
          top: '30%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          animationDelay: '-5s',
        }}
      />
      <div 
        className={`aurora-blob ${prefersReducedMotion ? '' : 'animate-aurora'}`}
        style={{
          width: '45vw',
          height: '45vw',
          bottom: '-10%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.05) 0%, transparent 70%)',
          animationDelay: '-10s',
        }}
      />
      <div 
        className={`aurora-blob ${prefersReducedMotion ? '' : 'animate-aurora'}`}
        style={{
          width: '40vw',
          height: '40vw',
          top: '50%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(218, 221, 216, 0.4) 0%, transparent 70%)',
          animationDelay: '-15s',
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
