import Link from 'next/link';
import type { Metadata } from 'next';
import { ProducerShell } from '@/components/producer/ProducerShell';
import { GlassPanel } from '@/components/GlassPanel';
import { MEDIA, REPO_VFX_STUDIO } from '@/lib/producer/constants';

export const metadata: Metadata = {
  title: 'Tools | Artjom Naninjan',
  description: 'Tools born from game and org need — VFX Studio, Dev Hub, Production Dashboard.',
};

const tools = [
  {
    id: 'vfx-studio',
    name: 'Skyhaven VFX Studio',
    need: 'Skyhaven combat',
    line: 'Author combat VFX bound to action IDs; one-button ship:ingame.',
    proof: 'UI + Cracked Mask / Greatsword slice · repo skyhaven-vfx-studio',
    anchors: [
      { href: '/work/skyhaven#vfx-studio', label: 'Case — VFX pipeline' },
      { href: '/work/skyhaven#vfx-to-game', label: 'Showcase — VFX → game (clip pending)' },
    ],
    image: MEDIA.skyhaven.vfxStudio,
    external: REPO_VFX_STUDIO,
  },
  {
    id: 'dev-hub',
    name: 'Dev Hub Building Lab',
    need: 'Skyhaven build / TPS',
    line: 'Calibrate Meshy→GLB for island and build content.',
    proof: 'Dev launcher + lab UI — public capture filming next',
    anchors: [{ href: '/work/skyhaven#dev-hub', label: 'Case — Build pipeline' }],
    stub: true,
  },
  {
    id: 'production-dashboard',
    name: 'Production Dashboard (DADB)',
    need: 'Multi-track org',
    line: 'Excel KPI → weekly reports for leadership.',
    proof: 'Redacted KPI stills — pending public redaction',
    anchors: [{ href: '/work/dadb-production#ownership', label: 'Case — KPI system' }],
    stub: true,
  },
];

export default function ToolsPage() {
  return (
    <ProducerShell>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">Technical Producer</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-mk-text sm:text-4xl">Tools born from the need.</h1>
        <p className="mt-4 max-w-2xl text-base text-mk-text-secondary">
          Systems exist because the game needed them; tools exist because the systems needed them. Nothing here is a
          separate product brand.
        </p>

        <div className="mt-10 grid gap-6">
          {tools.map((tool) => (
            <GlassPanel key={tool.id} id={tool.id} padding="none" className="overflow-hidden scroll-mt-28">
              <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-mk-text-muted">Nest under · {tool.need}</p>
                  <h2 className="mt-2 text-xl font-semibold text-mk-text">{tool.name}</h2>
                  <p className="mt-2 text-sm text-mk-text-secondary">{tool.line}</p>
                  <p className="mt-3 text-xs text-mk-text-muted">{tool.proof}</p>
                  {tool.stub ? (
                    <p className="mt-3 text-xs font-medium text-accent-coral">Stub — footage or redacted still pending</p>
                  ) : null}
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {tool.anchors.map((a) => (
                      <li key={a.href}>
                        <Link href={a.href} className="glass-button rounded-full px-4 py-2 text-xs">
                          {a.label}
                        </Link>
                      </li>
                    ))}
                    {tool.external ? (
                      <li>
                        <a
                          href={tool.external}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button rounded-full px-4 py-2 text-xs"
                        >
                          GitHub
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
                {tool.image ? (
                  <div className="relative min-h-[200px] bg-[color:var(--surface-card)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tool.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-t border-[color:var(--surface-border)] p-8 md:border-l md:border-t-0">
                    <p className="text-sm text-mk-text-muted">No public UI yet</p>
                  </div>
                )}
              </div>
            </GlassPanel>
          ))}

          <GlassPanel padding="lg" className="border-dashed">
            <h2 className="text-lg font-semibold text-mk-text">Logo Creator</h2>
            <p className="mt-2 text-sm text-mk-text-secondary">
              Path unconfirmed in repo/Drive — not listed as a shipped tool until Artjom confirms asset location. No invented
              UI or feature copy.
            </p>
          </GlassPanel>
        </div>
      </div>
    </ProducerShell>
  );
}
