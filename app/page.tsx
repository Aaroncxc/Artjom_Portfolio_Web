import Link from 'next/link';
import { ProducerShell } from '@/components/producer/ProducerShell';
import { ProofChips } from '@/components/producer/CaseBlocks';
import { WorkCard } from '@/components/producer/WorkCard';
import { buildHireMailto } from '@/lib/contact';
import { HOME, MAILTO_SUBJECTS, MEDIA, SKYHAVEN_LANDING } from '@/lib/producer/constants';

export default function ProducerHomePage() {
  return (
    <ProducerShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-cyan">
              Game Producer · Technical Producer
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-tight text-mk-text sm:text-4xl md:text-[2.65rem]">
              {HOME.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-mk-text-secondary">{HOME.oneLiner}</p>
            <ProofChips chips={HOME.proofChips} className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/work/skyhaven" className="btn-solid inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold">
                View Skyhaven case
              </Link>
              <a
                href={SKYHAVEN_LANDING}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button inline-flex min-h-[44px] items-center rounded-full px-5"
              >
                Play / landing
              </a>
              <a
                href={buildHireMailto(MAILTO_SUBJECTS.producer)}
                className="glass-button inline-flex min-h-[44px] items-center rounded-full px-5"
              >
                Contact
              </a>
            </div>
            <p className="mt-4 text-xs text-mk-text-muted">
              2-page PDF one-pager — same copy as the site; export in progress (redacted KPI frames pending).
            </p>
          </div>

          <div>
            <div className="overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-black shadow-[var(--glass-shadow)]">
              <video
                className="aspect-video w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={MEDIA.skyhaven.hub}
              >
                <source src={MEDIA.trailerPreview} type="video/mp4" />
              </video>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-mk-text-muted">{HOME.trailerCaption}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--surface-border)] bg-[color:var(--surface-card)]/30 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-mk-text-muted">Selected work</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <WorkCard
              href="/work/skyhaven"
              title="Skyhaven / CoinCraft"
              roleLine="Producer / Creative Lead"
              statusLine="Playable Arena + Build Companion"
              imageSrc={MEDIA.skyhaven.arenaDash}
              imageAlt="Skyhaven arena combat — dash and melee"
              tags={['Tauri', 'Arena → Build', 'NOW lock']}
            />
            <WorkCard
              href="/work/dadb-production"
              title="DADB Production"
              roleLine="Head of Production"
              statusLine="~30–35 people · KPI system · XR showcases"
              imageSrc={MEDIA.dadb.kigali}
              imageAlt="DADB XR showcase — Kigali trade show"
              tags={['Multi-site', 'IHK 88/100', 'Reporting']}
            />
            <WorkCard
              href="/tools"
              title="Tools"
              roleLine="Built from game / org need"
              statusLine="VFX Studio · Dev Hub · Production Dashboard"
              imageSrc={MEDIA.skyhaven.vfxStudio}
              imageAlt="Skyhaven VFX Instrument Studio UI"
              tags={['ship:ingame', 'Meshy→GLB', 'KPI']}
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-xl font-semibold text-mk-text">Tools nest under the need.</h2>
          <p className="mt-3 text-sm leading-relaxed text-mk-text-secondary">
            Combat needed shippable VFX → VFX Studio. Build needed calibrated assets → Dev Hub Building Lab.
            Multi-track org needed weekly clarity → Production Dashboard at DADB.
          </p>
        </div>
      </section>

      <section className="border-t border-[color:var(--surface-border)] py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 sm:px-6">
          <a
            href={SKYHAVEN_LANDING}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button rounded-full px-5"
          >
            Skyhaven landing
          </a>
          <Link href="/contact" className="glass-button rounded-full px-5">
            Email · LinkedIn
          </Link>
        </div>
      </section>
    </ProducerShell>
  );
}
