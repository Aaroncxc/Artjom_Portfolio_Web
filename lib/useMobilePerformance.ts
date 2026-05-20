'use client';

import { useEffect, useState } from 'react';

export interface MobilePerformanceFlags {
  /** `(max-width: 767px)` — matches site mobile breakpoint. */
  isMobile: boolean;
  /** Touch-first devices — skip hover WebGL, prefer posters. */
  isCoarsePointer: boolean;
  /** Prefer stills over looping tile video (mobile or coarse pointer). */
  preferStaticTileVideo: boolean;
  /** Lighter motion / no infinite GPU animations. */
  limitContinuousEffects: boolean;
}

const MOBILE_QUERY = '(max-width: 767px)';
const COARSE_QUERY = '(pointer: coarse)';

function readFlags(): MobilePerformanceFlags {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isCoarsePointer: false,
      preferStaticTileVideo: false,
      limitContinuousEffects: false,
    };
  }
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const isCoarsePointer = window.matchMedia(COARSE_QUERY).matches;
  return {
    isMobile,
    isCoarsePointer,
    preferStaticTileVideo: isMobile,
    limitContinuousEffects: isMobile,
  };
}

/** Shared mobile / touch performance hints for heavy media & animations. */
export function useMobilePerformance(): MobilePerformanceFlags {
  const [flags, setFlags] = useState<MobilePerformanceFlags>(() => readFlags());

  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_QUERY);
    const coarseMq = window.matchMedia(COARSE_QUERY);
    const sync = () => setFlags(readFlags());
    sync();
    mobileMq.addEventListener('change', sync);
    coarseMq.addEventListener('change', sync);
    return () => {
      mobileMq.removeEventListener('change', sync);
      coarseMq.removeEventListener('change', sync);
    };
  }, []);

  return flags;
}
