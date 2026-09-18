'use client';

import { useCareerTrack } from './CareerTrackContext';
import { CareerTrackFilter } from './CareerTrackFilter';
import { CareerWorkCard } from './CareerWorkCard';

export function CareerSelectedWork() {
  const { filteredGroups, track } = useCareerTrack();

  return (
    <section id="work" className="career-section">
      <div className="career-container">
        <div className="mb-[var(--space-8)] flex flex-col gap-[var(--space-4)] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="career-eyebrow mb-[var(--space-2)]">Selected work</p>
            <h2 className="career-heading">Projects that ship</h2>
          </div>
          <CareerTrackFilter />
        </div>

        {filteredGroups.length === 0 ? (
          <p className="career-body" style={{ color: 'var(--fg-muted)' }}>
            No projects match this track — try All or another filter.
          </p>
        ) : (
          <div className="flex flex-col gap-[var(--space-12)] md:gap-[var(--space-16)]">
            {filteredGroups.map((group) => (
              <div key={group.id}>
                <div className="mb-[var(--space-6)] max-w-2xl">
                  <h3 className="career-group-title">{group.title}</h3>
                  {group.summary && track === 'all' && (
                    <p className="career-body mt-[var(--space-2)]">{group.summary}</p>
                  )}
                </div>

                <div className="career-work-grid">
                  {group.items.map((item) => (
                    <CareerWorkCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
