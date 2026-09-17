'use client';

import { CAREER_TRACK_IDS, type CareerTrackFilter } from '@/lib/careerContent';
import { useCareerTrack } from './CareerTrackContext';

const FILTER_OPTIONS: { id: CareerTrackFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'elearning', label: 'eLearning' },
  { id: 'creative', label: 'Creative' },
  { id: 'gaming', label: 'Gaming' },
];

const TRACK_LABEL: Record<(typeof CAREER_TRACK_IDS)[number], string> = {
  elearning: 'eLearning',
  creative: 'Creative',
  gaming: 'Gaming',
};

export function CareerTrackFilter() {
  const { track, setTrack } = useCareerTrack();

  return (
    <div className="career-track-filter" role="group" aria-label="Filter work by track">
      {FILTER_OPTIONS.map((opt) => {
        const active = track === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            className={`career-track-filter__btn${active ? ' career-track-filter__btn--active' : ''}`}
            onClick={() => {
              setTrack(opt.id);
              if (opt.id !== 'all') {
                requestAnimationFrame(() => {
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
              }
            }}
          >
            {opt.label}
          </button>
        );
      })}
      {track !== 'all' && (
        <span className="career-track-filter__hint">
          Showing {TRACK_LABEL[track]} work
        </span>
      )}
    </div>
  );
}
