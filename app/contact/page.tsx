import type { Metadata } from 'next';
import { ProducerShell } from '@/components/producer/ProducerShell';
import { buildHireMailto, CONTACT_EMAIL } from '@/lib/contact';
import { LINKEDIN_URL, MAILTO_SUBJECTS, SKYHAVEN_LANDING } from '@/lib/producer/constants';

export const metadata: Metadata = {
  title: 'Contact | Artjom Naninjan',
  description: 'Associate / Producer and Technical Producer roles — indie & midsize studios (DE/EU).',
};

export default function ContactPage() {
  return (
    <ProducerShell>
      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-mk-text sm:text-4xl">Let&apos;s talk production.</h1>
        <p className="mt-4 text-base text-mk-text-secondary">
          Associate / Producer and Technical Producer roles at indie &amp; midsize studios (DE/EU).
        </p>

        <div className="mt-10 space-y-4">
          <a
            href={buildHireMailto(MAILTO_SUBJECTS.producer)}
            className="glass-panel flex min-h-[56px] flex-col justify-center px-5 py-4 transition-colors hover:border-accent-cyan/40"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-mk-text-muted">Email</span>
            <span className="mt-1 text-lg font-medium text-mk-text">{CONTACT_EMAIL}</span>
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel flex min-h-[56px] flex-col justify-center px-5 py-4 transition-colors hover:border-accent-cyan/40"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-mk-text-muted">LinkedIn</span>
            <span className="mt-1 text-lg font-medium text-accent-cyan">artjom-naninjan</span>
          </a>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-mk-text-muted">Mail subject starters</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(MAILTO_SUBJECTS).map(([key, subject]) => (
              <li key={key}>
                <a href={buildHireMailto(subject)} className="text-accent-cyan hover:underline">
                  {subject}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <a href={SKYHAVEN_LANDING} target="_blank" rel="noopener noreferrer" className="glass-button rounded-full px-4">
            Skyhaven landing
          </a>
          <span className="inline-flex items-center rounded-full px-4 text-mk-text-muted">
            2-page PDF — export in progress
          </span>
        </div>
      </div>
    </ProducerShell>
  );
}
