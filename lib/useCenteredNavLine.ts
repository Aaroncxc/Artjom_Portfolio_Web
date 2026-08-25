'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_NAV_LINE, navLineForKey } from '@/lib/navLines';

const FOCUS_Y_RATIO = 0.48;
const SWITCH_GAP_PX = 36;

/**
 * Picks the nav line for whatever `[data-nav-key]` tile sits in the viewport
 * center. Smaller tiles win over their parent section so a project can take
 * over once it occupies the middle of the screen.
 */
export function useCenteredNavLine(active: boolean): string {
  const [line, setLine] = useState(DEFAULT_NAV_LINE);

  useEffect(() => {
    if (!active) {
      setLine(DEFAULT_NAV_LINE);
      return;
    }

    let frame = 0;
    let ticking = false;
    let lastKey = '';

    const pick = () => {
      ticking = false;
      const nodes = document.querySelectorAll<HTMLElement>('[data-nav-key]');
      if (nodes.length === 0) return;

      const focusX = window.innerWidth / 2;
      const focusY = window.innerHeight * FOCUS_Y_RATIO;
      const viewH = window.innerHeight;

      let containing: { key: string; area: number } | null = null;
      let nearest: { key: string; dist: number } | null = null;

      for (const el of nodes) {
        const key = el.dataset.navKey;
        if (!key || !navLineForKey(key)) continue;

        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        if (r.bottom < 72 || r.top > viewH - 24) continue;

        const contains =
          r.left <= focusX && r.right >= focusX && r.top <= focusY && r.bottom >= focusY;
        if (contains) {
          const area = r.width * r.height;
          if (!containing || area < containing.area) {
            containing = { key, area };
          }
        }

        const midY = (r.top + r.bottom) / 2;
        const dist = Math.abs(midY - focusY);
        if (!nearest || dist < nearest.dist) {
          nearest = { key, dist };
        }
      }

      const nextKey = containing?.key ?? nearest?.key;
      if (!nextKey || nextKey === lastKey) return;

      if (!containing && nearest && lastKey) {
        const current = document.querySelector<HTMLElement>(`[data-nav-key="${lastKey}"]`);
        if (current) {
          const r = current.getBoundingClientRect();
          const currentDist = Math.abs((r.top + r.bottom) / 2 - focusY);
          if (currentDist - nearest.dist < SWITCH_GAP_PX) return;
        }
      }

      const nextLine = navLineForKey(nextKey);
      if (!nextLine) return;
      lastKey = nextKey;
      setLine(nextLine);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [active]);

  return line;
}
