'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';

interface TextPointCloudHeroProps {
  onReady?: () => void;
  onActivate?: () => void;
}

// Scale text to 92% of viewport width: "multikunst" width ~ fontSize * 5.5
function getResponsivePreset() {
  if (typeof window === 'undefined') {
    return { fontSize: 260, letterSpacing: -26, radius: 90, pointSize: 1, strength: 9 };
  }
  const w = window.innerWidth;
  const maxFontSize = Math.min(240, (w * 0.92) / 5.5);
  const fontSize = Math.max(48, Math.round(maxFontSize));
  // Brand typography: keep logo letter spacing close to Figma (-10%)
  const letterSpacing = Math.round(-fontSize * 0.1);
  const radius = Math.max(50, Math.round(fontSize * 0.65));
  const pointSize = w < 400 ? 0.75 : 1;
  const strength = w < 640 ? 8 : 9;
  return { fontSize, letterSpacing, radius, pointSize, strength };
}

export function TextPointCloudHero({ onReady, onActivate }: TextPointCloudHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLElement | null>(null);
  const scriptLoaded = useRef(false);
  const [presetOverrides, setPresetOverrides] = useState(() => getResponsivePreset());
  const [morphX, setMorphX] = useState(0);
  const [morphY, setMorphY] = useState(0);
  const [activated, setActivated] = useState(false);
  const activatedRef = useRef(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => onReady?.(), 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  useEffect(() => {
    const update = () => setPresetOverrides(getResponsivePreset());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Listen for the first click anywhere on the hero -> trigger explosion + onActivate after delay
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const armFreeParticles = () => {
      const el = cloudRef.current;
      if (!el) return;
      // Apply via attributes only — avoids preset JSON change -> setPreset() -> rebuild() snap-back
      el.setAttribute('hold-open', '1');
      el.setAttribute('return-force', '0');
      el.setAttribute('wander-strength', '280');
      el.setAttribute('point-damping', '0.997');
      el.setAttribute('show-solid-when-idle', 'false');
      el.setAttribute('explosion-motion-scale', '0.38');
    };

    const handleActivate = (e: PointerEvent) => {
      if (activatedRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-hero-no-activate]')) return;

      activatedRef.current = true;
      armFreeParticles();
      setActivated(true);
      window.setTimeout(() => {
        onActivate?.();
      }, 1500);
    };

    node.addEventListener('pointerdown', handle);
    return () => node.removeEventListener('pointerdown', handle);

    function handle(ev: Event) {
      handleActivate(ev as PointerEvent);
    }
  }, [onActivate]);

  const preset = {
    text: 'multikunst',
    ...presetOverrides,
    weight: 700,
    spacing: 2,
    color: '#1C1C1C',
    bg: 'transparent',
    centerMode: 'center',
    drag: 2,
    noise: 0.5,
    returnForce: 0.02,
    damping: 0.88,
    pressOnly: false,
    gravityStrength: 0.85,
    gravityOnClick: true,
    showSolidWhenIdle: true,
    transitionSpeed: 0.2,
    burstStrength: 175,
    explosionMotionScale: 0.38,
    morphAmplitude: 70,
    morphFreq: 0.0025,
  };

  return (
    <>
      <Script
        src="/text-pointcloud.js"
        strategy="afterInteractive"
        onLoad={() => {
          scriptLoaded.current = true;
        }}
      />

      <section
        ref={containerRef}
        className="relative z-[1] w-full h-[100dvh] flex items-center justify-center overflow-hidden cursor-pointer select-none"
        style={{ height: '100dvh' }}
      >
        <text-pointcloud
          ref={(el) => {
            cloudRef.current = el as unknown as HTMLElement;
          }}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
          preset={JSON.stringify(preset)}
          {...{ 'morph-x': morphX, 'morph-y': morphY }}
        />

        {/* Click prompt + Wave sliders */}
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-6 z-10 pointer-events-none">
          <AnimatePresence>
            {!activated && (
              <motion.div
                key="enter-prompt"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.span
                  className="text-[11px] sm:text-xs text-mk-text-muted tracking-[0.3em] uppercase"
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {isCoarsePointer ? 'Tap multikunst to enter' : 'Click multikunst to enter'}
                </motion.span>
                <div className="h-5 w-px bg-[rgba(28,28,28,0.25)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wave sliders - tucked away, optional play */}
          <AnimatePresence>
            {!activated && (
              <motion.div
                key="wave-sliders"
                data-hero-no-activate
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="pointer-events-auto w-full max-w-[300px] px-4 flex flex-col gap-3 opacity-90 hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[9px] text-mk-text-muted uppercase tracking-widest">Wave X</label>
                  <span className="text-[9px] text-mk-text-muted tabular-nums">{Math.round(morphX * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={morphX}
                  onChange={(e) => setMorphX(parseFloat(e.target.value))}
                  className="hero-range w-full h-2 rounded-full bg-[rgba(28,28,28,0.12)] appearance-none cursor-pointer accent-[#1C1C1C]"
                />
                <div className="flex items-center justify-between gap-2 mt-2">
                  <label className="text-[9px] text-mk-text-muted uppercase tracking-widest">Wave Y</label>
                  <span className="text-[9px] text-mk-text-muted tabular-nums">{Math.round(morphY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={morphY}
                  onChange={(e) => setMorphY(parseFloat(e.target.value))}
                  className="hero-range w-full h-2 rounded-full bg-[rgba(28,28,28,0.12)] appearance-none cursor-pointer accent-[#1C1C1C]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'text-pointcloud': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          preset?: string;
          text?: string;
          'morph-x'?: number;
          'morph-y'?: number;
          'hold-open'?: string;
          'return-force'?: string;
          'wander-strength'?: string;
          'point-damping'?: string;
          'show-solid-when-idle'?: string;
          'explosion-motion-scale'?: string;
        },
        HTMLElement
      >;
    }
  }
}
