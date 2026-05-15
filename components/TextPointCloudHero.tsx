'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';

interface TextPointCloudHeroProps {
  onReady?: () => void;
  onActivate?: () => void;
}

type ResponsivePresetExt = {
  fontSize: number;
  letterSpacing: number;
  radius: number;
  pointSize: number;
  strength: number;
  morphAmplitude: number;
  morphFreq: number;
  solidRevealDelayMs: number;
  /** True when min(width,height) is strictly smaller than MOBILE_STACK_MIN_DIM_PX (stacked hero name). */
  stackedHeroName: boolean;
};

/**
 * Layout size for hero math — prefers VisualViewport (iOS Safari URL bar / overscroll)
 * and the smaller CSS dimension so landscape phones do not get “desktop” font math from width alone.
 * `MOBILE_STACK_*`: stacked “Artjom / Naninjan” only below this min-dimension threshold (phones, not tablets).
 */
const MOBILE_STACK_MIN_DIM_PX = 480;

function readLayoutCssSize(): { w: number; h: number; minDim: number; maxDim: number } {
  if (typeof window === 'undefined') {
    return { w: 390, h: 844, minDim: 390, maxDim: 844 };
  }
  const vv = window.visualViewport;
  let w = vv && vv.width > 0 ? Math.round(vv.width) : window.innerWidth;
  let h = vv && vv.height > 0 ? Math.round(vv.height) : window.innerHeight;
  const docEl = document.documentElement;
  if (docEl?.clientWidth > 0 && w > docEl.clientWidth + 48) {
    w = docEl.clientWidth;
  }
  if (docEl?.clientHeight > 0 && h > docEl.clientHeight + 80) {
    h = docEl.clientHeight;
  }
  w = Math.max(1, w);
  h = Math.max(1, h);
  const minDim = Math.min(w, h);
  const maxDim = Math.max(w, h);
  return { w, h, minDim, maxDim };
}

// Scale text and morph timing — Safari-safe via min(view W,H) + viewport-height caps.
function getResponsivePreset(): ResponsivePresetExt {
  if (typeof window === 'undefined') {
    return {
      fontSize: 98,
      letterSpacing: -10,
      radius: 66,
      pointSize: 0.84,
      strength: 8.5,
      morphAmplitude: 60,
      morphFreq: 0.0027,
      solidRevealDelayMs: 400,
      stackedHeroName: false,
    };
  }

  const { w, h, minDim, maxDim } = readLayoutCssSize();
  const narrow = minDim < 640;
  const shortViewport = minDim < 700;
  const stackedHeroName = minDim < MOBILE_STACK_MIN_DIM_PX;

  // Compact but readable; scaled up from previous generation for better legibility.
  const mobileRatio = narrow ? 0.84 : 0.82;
  const maxCap = narrow ? Math.min(128, Math.round(minDim * 0.33)) : 186;

  const byMinDim = (minDim * mobileRatio) / (narrow ? 5.15 : 5.45);
  const byHeight = h * (narrow ? 0.112 : 0.104);
  const longestLineChars = stackedHeroName ? 9 : 16;
  const byWidthFit = Math.min(w * 0.34, (w * 0.88) / (0.52 * longestLineChars));

  let maxFontSize = Math.min(maxCap, byMinDim, byHeight, byWidthFit);
  if (stackedHeroName) {
    maxFontSize = Math.min(maxFontSize, (h * 0.24) / 2.05);
  }
  if (!narrow && maxDim >= 1100) {
    maxFontSize = Math.min(maxFontSize, 182, (w * 0.46) / 5.1, h * 0.145);
  }

  const fontSize = Math.max(36, Math.round(maxFontSize));
  const letterSpacing = Math.round(-fontSize * 0.1);
  const radius = Math.max(44, Math.round(fontSize * (narrow ? 0.62 : 0.66)));
  const pointSize = minDim < 400 ? 0.78 : w < 400 ? 0.84 : 1.12;
  const strength = narrow ? 7.5 : 9;

  const morphAmplitude = narrow ? Math.round(46 + fontSize * 0.12) : Math.min(78, Math.round(54 + fontSize * 0.09));
  const morphFreq = narrow ? 0.0029 : 0.0025;
  let solidRevealDelayMs = narrow ? 400 : 480;
  if (shortViewport && narrow) solidRevealDelayMs = Math.min(solidRevealDelayMs, 360);

  return {
    fontSize,
    letterSpacing,
    radius,
    pointSize,
    strength,
    morphAmplitude,
    morphFreq,
    solidRevealDelayMs,
    stackedHeroName,
  };
}

/** Role phrases around the hero name (see heroPrimaryText below). */
const INTRO_ROLE_LAYERS = [
  {
    text: 'Project Management',
    relativePosition: { x: 0.12, y: 0.16 },
    fontScale: 0.188,
    spacingMul: 2.88,
    opacity: 0.38,
    driftAmp: 31,
    driftFreq: 0.00026,
    morphGain: 0.92,
    pointSizeMul: 0.86,
  },
  {
    text: '3D Generalist',
    relativePosition: { x: 0.88, y: 0.15 },
    fontScale: 0.203,
    spacingMul: 2.62,
    opacity: 0.4,
    driftAmp: 34,
    driftFreq: 0.00034,
    morphGain: 0.94,
    pointSizeMul: 0.88,
  },
  {
    text: 'App Developer',
    relativePosition: { x: 0.1, y: 0.5 },
    fontScale: 0.196,
    spacingMul: 2.68,
    opacity: 0.36,
    driftAmp: 29,
    driftFreq: 0.00031,
    morphGain: 0.88,
    pointSizeMul: 0.84,
  },
  {
    text: 'Art Director',
    relativePosition: { x: 0.91, y: 0.5 },
    fontScale: 0.202,
    spacingMul: 2.68,
    opacity: 0.38,
    driftAmp: 33,
    driftFreq: 0.00033,
    morphGain: 0.93,
    pointSizeMul: 0.88,
  },
  {
    text: 'Producer',
    relativePosition: { x: 0.16, y: 0.82 },
    fontScale: 0.222,
    spacingMul: 2.78,
    opacity: 0.35,
    driftAmp: 36,
    driftFreq: 0.00036,
    morphGain: 0.91,
    pointSizeMul: 0.9,
  },
  {
    text: 'Architect',
    relativePosition: { x: 0.85, y: 0.82 },
    fontScale: 0.234,
    spacingMul: 2.85,
    opacity: 0.36,
    driftAmp: 35,
    driftFreq: 0.00035,
    morphGain: 0.9,
    pointSizeMul: 0.92,
  },
] as const;

function isInsideElementRect(clientX: number, clientY: number, rect: DOMRect): boolean {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

export function TextPointCloudHero({ onReady, onActivate }: TextPointCloudHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLElement | null>(null);
  const [presetOverrides, setPresetOverrides] = useState(() => getResponsivePreset());
  const [activated, setActivated] = useState(false);
  const activatedRef = useRef(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const morphChaosRef = useRef(0);
  const lastMoveRef = useRef({ x: 0, y: 0, t: 0 });
  const lastMotionRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => onReady?.(), 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  useEffect(() => {
    const update = () => setPresetOverrides(getResponsivePreset());
    update();
    window.addEventListener('resize', update);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', update);
      window.visualViewport.addEventListener('scroll', update);
    }
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Morph from pointer/touch movement anywhere on the hero; tuned for coarse pointers (mobile).
  useEffect(() => {
    if (!containerRef.current) return;

    let raf = 0;
    const coarse = () =>
      typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    let IDLE_MS = 72;
    let DECAY_PER_FRAME = 0.965;
    let SPEED_TO_CHAOS = 0.052;
    let MOVE_MIN = 0.35;

    const syncTuning = () => {
      const c = coarse();
      IDLE_MS = c ? 100 : 72;
      DECAY_PER_FRAME = c ? 0.972 : 0.965;
      SPEED_TO_CHAOS = c ? 0.088 : 0.052;
      MOVE_MIN = c ? 0.18 : 0.35;
    };
    syncTuning();

    const applyMorphToCloud = () => {
      const el = cloudRef.current;
      if (!el || activatedRef.current) return;
      const c = morphChaosRef.current;
      el.setAttribute('morph-x', c.toFixed(4));
      el.setAttribute('morph-y', Math.min(1, c * 0.94).toFixed(4));
    };

    const tick = () => {
      if (!activatedRef.current) {
        const now = performance.now();
        if (now - lastMotionRef.current > IDLE_MS) {
          morphChaosRef.current *= DECAY_PER_FRAME;
          if (morphChaosRef.current < 0.003) morphChaosRef.current = 0;
          applyMorphToCloud();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const feedMorph = (clientX: number, clientY: number, t: number) => {
      if (activatedRef.current) return;
      const node = containerRef.current;
      if (!node) return;
      if (!isInsideElementRect(clientX, clientY, node.getBoundingClientRect())) return;

      const lp = lastMoveRef.current;
      const dt = lp.t > 0 ? t - lp.t : 0;
      const moveDist = lp.t > 0 ? Math.hypot(clientX - lp.x, clientY - lp.y) : 0;
      lastMoveRef.current = { x: clientX, y: clientY, t };

      if (dt > 0 && dt < 480 && moveDist > MOVE_MIN) {
        lastMotionRef.current = t;
        const speed = moveDist / dt;
        const boost = Math.min(0.22, speed * SPEED_TO_CHAOS);
        morphChaosRef.current = Math.min(1, morphChaosRef.current + boost);
        applyMorphToCloud();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      feedMorph(e.clientX, e.clientY, performance.now());
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      feedMorph(t.clientX, t.clientY, performance.now());
    };

    raf = requestAnimationFrame(tick);

    const optsCap = { passive: true, capture: true } as const;

    window.addEventListener('pointermove', onPointerMove, optsCap);
    window.addEventListener('touchmove', onTouchMove, optsCap);

    const onVpResize = () => syncTuning();
    window.visualViewport?.addEventListener('resize', onVpResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove, optsCap);
      window.removeEventListener('touchmove', onTouchMove, optsCap);
      window.visualViewport?.removeEventListener('resize', onVpResize);
    };
  }, []);

  // Listen for the first click anywhere on the hero -> trigger explosion + onActivate after delay
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const armFreeParticles = () => {
      const el = cloudRef.current;
      if (!el) return;
      morphChaosRef.current = 0;
      el.setAttribute('morph-x', '0');
      el.setAttribute('morph-y', '0');
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

    function handle(ev: Event) {
      handleActivate(ev as PointerEvent);
    }

    node.addEventListener('pointerdown', handle);
    return () => node.removeEventListener('pointerdown', handle);
  }, [onActivate]);

  const {
    morphAmplitude,
    morphFreq,
    solidRevealDelayMs,
    stackedHeroName,
    ...sizePreset
  } = presetOverrides;

  const heroPrimaryText = stackedHeroName ? 'Artjom\nNaninjan' : 'Artjom Naninjan';

  const preset = {
    interactFullCanvas: true,
    layers: [{ text: heroPrimaryText }, ...INTRO_ROLE_LAYERS],
    ...sizePreset,
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
    solidRevealDelayMs,
    burstStrength: 175,
    explosionMotionScale: 0.38,
    morphAmplitude,
    morphFreq,
  };

  return (
    <>
      <Script src="/text-pointcloud.js?v=hero5" strategy="afterInteractive" />

      <section
        ref={containerRef}
        className="relative z-[1] flex min-h-[100dvh] w-full touch-manipulation items-center justify-center overflow-hidden cursor-pointer select-none"
        style={{
          minHeight: '100dvh',
          height: '100dvh',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
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
            touchAction: 'manipulation',
          }}
          preset={JSON.stringify(preset)}
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom)+0.5rem)] pt-2 sm:bottom-2 sm:gap-6 sm:pb-[max(2rem,env(safe-area-inset-bottom))]"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <AnimatePresence>
            {!activated && (
              <motion.div
                key="enter-prompt"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex max-w-[min(100%,20rem)] flex-col items-center gap-2 text-center"
              >
                <motion.span
                  className="text-[10px] leading-snug text-mk-text-muted tracking-[0.22em] sm:text-xs sm:tracking-[0.3em]"
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {isCoarsePointer ? (
                    <>
                      Move on the canvas, then
                      <br />
                      tap to enter
                    </>
                  ) : (
                    'Click anywhere to enter'
                  )}
                </motion.span>
                <div className="h-4 w-px bg-[rgba(28,28,28,0.25)] sm:h-5" />
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
