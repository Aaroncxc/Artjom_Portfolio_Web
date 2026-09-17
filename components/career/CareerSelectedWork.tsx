import { CAREER_SELECTED_WORK } from '@/lib/careerContent';
import { CareerWorkCard } from './CareerWorkCard';

export function CareerSelectedWork() {
  return (
    <section id="work" className="career-section">
      <div className="career-container">
        <p className="career-eyebrow mb-[var(--space-3)]">Selected work</p>
        <h2 className="career-heading mb-[var(--space-12)]">Proof of delivery</h2>

        <div className="flex flex-col gap-[var(--space-16)]">
          {CAREER_SELECTED_WORK.map((group) => (
            <div key={group.id}>
              <div className="mb-[var(--space-6)] max-w-2xl">
                <h3
                  className="mb-[var(--space-2)] text-xl font-semibold md:text-2xl"
                  style={{ letterSpacing: 'var(--tracking-tight)', color: 'var(--fg)' }}
                >
                  {group.title}
                </h3>
                {group.summary && (
                  <p
                    style={{
                      fontSize: 'var(--text-base)',
                      lineHeight: 'var(--leading-body)',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    {group.summary}
                  </p>
                )}
              </div>

              <div className="grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <CareerWorkCard key={`${group.id}-${item.title}`} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
