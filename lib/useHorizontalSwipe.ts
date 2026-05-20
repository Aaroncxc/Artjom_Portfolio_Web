'use client';

import { useCallback, useRef } from 'react';

const SWIPE_DISTANCE_PX = 36;
const SWIPE_DOMINANCE = 1.2;

/** Touch swipe left/right — attach to a container (use capture on nested media if needed). */
export function useHorizontalSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  enabled = true,
) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const t = e.touches[0];
      if (!t) return;
      startRef.current = { x: t.clientX, y: t.clientY };
    },
    [enabled],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < SWIPE_DISTANCE_PX) return;
      if (Math.abs(dx) <= Math.abs(dy) * SWIPE_DOMINANCE) return;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    },
    [enabled, onSwipeLeft, onSwipeRight],
  );

  return { onTouchStart, onTouchEnd };
}
