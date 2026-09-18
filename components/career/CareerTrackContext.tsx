'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  type CareerTrackFilter,
  filterWorkGroups,
  CAREER_SELECTED_WORK,
  parseTrackParam,
} from '@/lib/careerContent';

interface CareerTrackContextValue {
  track: CareerTrackFilter;
  setTrack: (track: CareerTrackFilter) => void;
  applyTrack: (track: CareerTrackFilter, options?: { scrollToWork?: boolean }) => void;
  filteredGroups: ReturnType<typeof filterWorkGroups>;
}

const CareerTrackContext = createContext<CareerTrackContextValue | null>(null);

export function CareerTrackProvider({ children }: { children: ReactNode }) {
  const [track, setTrackState] = useState<CareerTrackFilter>('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTrackState(parseTrackParam(params.get('track')));
  }, []);

  const setTrack = useCallback((next: CareerTrackFilter) => {
    setTrackState(next);
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete('track');
    else url.searchParams.set('track', next);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const applyTrack = useCallback(
    (next: CareerTrackFilter, options?: { scrollToWork?: boolean }) => {
      setTrack(next);
      if (options?.scrollToWork) {
        requestAnimationFrame(() => {
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    },
    [setTrack],
  );

  const filteredGroups = useMemo(() => filterWorkGroups(CAREER_SELECTED_WORK, track), [track]);

  const value = useMemo(
    () => ({ track, setTrack, applyTrack, filteredGroups }),
    [track, setTrack, applyTrack, filteredGroups],
  );

  return <CareerTrackContext.Provider value={value}>{children}</CareerTrackContext.Provider>;
}

export function useCareerTrack() {
  const ctx = useContext(CareerTrackContext);
  if (!ctx) throw new Error('useCareerTrack must be used within CareerTrackProvider');
  return ctx;
}
