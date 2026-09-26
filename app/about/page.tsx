import type { Metadata } from 'next';
import { ProducerShell } from '@/components/producer/ProducerShell';
import { SKYHAVEN_LANDING } from '@/lib/producer/constants';

export const metadata: Metadata = {
  title: 'About | Artjom Naninjan',
  description: 'Production lead who still ships the playable slice — DADB path, IHK, Skyhaven producer.',
};

const spine = [
  {
    title: 'Now — Skyhaven Producer / Creative Lead',
    body: 'Arena + Build Companion lock; VFX Studio + Dev Hub from game need; live landing at coincraft-skyhaven.vercel.app.',
  },
  {
    title: 'DADB (~2021–Oct 2025)',
    body: '3D Environment Artist → Mixed Reality Lead → Head of 3D → Head of Production · ~30–35 · ~4 sites · up to ~6 parallel productions · KPI system.',
  },
  {
    title: 'IHK Projektleiter — 88/100 (2024)',
    body: 'Live Online certification — project leadership credential alongside production track record.',
  },
  {
    title: 'XR delivery (compressed)',
    body: 'Senegal VR 2023 · Kigali AR / SMA 2024 · E-Learning Africa stand supporting beats.',
  },
  {
    title: 'Multikunst — Creative Director since ~2026',
    body: 'Supporting role only — not co-equal with game producer positioning on this site.',
  },
];

const howIWork = [
  'Scope locks written down (NOW / LATER) so pitch and build match',
  'Pipelines over heroics (ship:ingame, weekly KPI)',
  'Trade-offs named in public cases',
  'Tools nested under product need',
];

export default function AboutPage() {
  return (
    <ProducerShell>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-mk-text sm:text-4xl">
          Production lead who still ships the playable slice.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-mk-text-secondary">
          From multi-site Head of Production to producing Skyhaven — same instinct: lock scope, make pipelines real, keep
          the story honest.
        </p>

        <ol className="mt-12 space-y-8">
          {spine.map((item, i) => (
            <li key={item.title} className="glass-panel p-5 sm:p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">Station {i + 1}</span>
              <h2 className="mt-2 text-lg font-semibold text-mk-text">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mk-text-secondary">{item.body}</p>
              {i === 0 ? (
                <a
                  href={SKYHAVEN_LANDING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-accent-cyan"
                >
                  Skyhaven landing →
                </a>
              ) : null}
            </li>
          ))}
        </ol>

        <section className="mt-14">
          <h2 className="text-lg font-semibold text-mk-text">How I work</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-mk-text-secondary">
            {howIWork.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 glass-panel p-5 text-sm text-mk-text-secondary">
          <h2 className="text-base font-semibold text-mk-text">Stack (factual)</h2>
          <p className="mt-2">
            Tauri · React · Three.js / R3F · TypeScript · Blender / Unreal (XR context) · Asana / Excel / internal
            reporting · AI-assisted production reporting
          </p>
        </section>
      </div>
    </ProducerShell>
  );
}
