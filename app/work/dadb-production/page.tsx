import type { Metadata } from 'next';
import { ProducerShell } from '@/components/producer/ProducerShell';
import { CaseMetaGrid, CaseMetaItem, CaseSection, MediaFigure } from '@/components/producer/CaseBlocks';
import { buildHireMailto } from '@/lib/contact';
import { MAILTO_SUBJECTS, MEDIA } from '@/lib/producer/constants';

export const metadata: Metadata = {
  title: 'DADB Production — Case Study | Artjom Naninjan',
  description:
    'Head of Production at German Academy of Digital Education — multi-site KPI clarity, cadence, and XR delivery.',
};

export default function DadbProductionCasePage() {
  return (
    <ProducerShell>
      <header className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">Credibility case</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-mk-text sm:text-4xl">
          Head of Production — making multi-site output legible.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-mk-text-secondary">
          I built and ran the production function that kept multi-department course and realtime content shipping — with
          weekly KPI clarity for leadership.
        </p>

        <div className="mt-8 glass-panel p-5 sm:p-6">
          <CaseMetaGrid>
            <CaseMetaItem label="Org">German Academy of Digital Education (DADB)</CaseMetaItem>
            <CaseMetaItem label="Tenure">~2021 – Oct 2025</CaseMetaItem>
            <CaseMetaItem label="Path">
              3D Environment Artist → Mixed Reality Lead → Head of 3D → Head of Production
            </CaseMetaItem>
            <CaseMetaItem label="Scale">
              ~30–35 people · ~4 sites (Germany / India / Senegal) · up to ~6 parallel productions
            </CaseMetaItem>
            <CaseMetaItem label="Credential">IHK Projektleiter 88/100 (2024)</CaseMetaItem>
          </CaseMetaGrid>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-panel p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-mk-text">Problem</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mk-text-secondary sm:text-base">
            Editorial, 2D, 3D, post, Unreal interactive, and LMS ran in parallel without one trustworthy view of output,
            blockers, and capacity for CEO and stakeholders.
          </p>
        </div>
      </section>

      <CaseSection
        id="ownership"
        headline="Production overview, cadence, and KPI reporting."
        oneLiner="Owned deadlines, output, and department coordination; PMs and leads ran day-to-day teams inside that system."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-mk-text-secondary">
          <li>Daily team syncs, PM daily calls, monthly lead reporting.</li>
          <li>KPI system: Excel production data → automated weekly reports (chapters, modules, content hours, review status).</li>
          <li>Workflow docs for handoffs, QA, and ownership; Asana, Excel, internal systems, AI-assisted reporting on tables.</li>
        </ul>
        <div className="mt-8 glass-panel border-dashed p-6 text-sm text-mk-text-secondary">
          <p className="font-medium text-mk-text">Production Dashboard stills — gated</p>
          <p className="mt-2">
            Redacted KPI PDF frames exist for applications; public web stills are pending final redaction sign-off. No
            invented completion percentages or revenue — the system story is the weekly numbers leadership and teams shared.
          </p>
        </div>
      </CaseSection>

      <CaseSection
        id="xr"
        headline="Representative shipped experiences (supporting)."
        oneLiner="Trade-show XR under real booth constraints — not the hero of this case, but proof of delivery under pressure."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <MediaFigure
            src={MEDIA.dadb.senegal}
            alt="Senegal VR DC-motor assembly showcase"
            caption="Senegal VR DC-motor assembly (2023) — booth-ready XR."
          />
          <MediaFigure
            src={MEDIA.dadb.kigali}
            alt="Kigali AR inverter experience"
            caption="Kigali AR inverter / SMA partner triggers (2024) — Blender + Unreal."
          />
        </div>
        <p className="mt-4 text-sm text-mk-text-secondary">
          E-Learning Africa stand ops — demo, hardware, visitor flow, partner narrative (supporting beat).
        </p>
      </CaseSection>

      <CaseSection
        id="translation"
        headline="Producer translation for game studios."
        oneLiner="Milestones, risk, quality gates, cross-discipline coordination, stakeholder reporting, and tooling that makes production legible — not course teaching."
      />

      <section className="border-t border-[color:var(--surface-border)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-mk-text">Outcome</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mk-text-secondary">
            Multi-site production stays honest when leadership sees the same weekly numbers the teams feel. KPI clarity +
            cadence beat heroics — the same instinct behind Skyhaven&apos;s scope lock and ship pipelines.
          </p>
          <a href={buildHireMailto(MAILTO_SUBJECTS.dadb)} className="glass-button mt-8 inline-flex rounded-full px-5">
            Discuss production lead background
          </a>
        </div>
      </section>
    </ProducerShell>
  );
}
