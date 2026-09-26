import Link from 'next/link';
import type { Metadata } from 'next';
import { ProducerShell } from '@/components/producer/ProducerShell';
import {
  CaseMetaGrid,
  CaseMetaItem,
  CaseSection,
  MediaFigure,
  VfxToGameShowcase,
} from '@/components/producer/CaseBlocks';
import { buildHireMailto } from '@/lib/contact';
import {
  MAILTO_SUBJECTS,
  MEDIA,
  REPO_SKYHAVEN,
  REPO_VFX_STUDIO,
  SKYHAVEN_LANDING,
} from '@/lib/producer/constants';

export const metadata: Metadata = {
  title: 'Skyhaven (CoinCraft) — Case Study | Artjom Naninjan',
  description:
    'Desktop companion RPG: Arena → Coins → Build. Producer ownership, scope lock, and VFX Studio ship:ingame pipeline.',
};

export default function SkyhavenCasePage() {
  return (
    <ProducerShell>
      <header className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">Hero case</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-mk-text sm:text-4xl">
          Skyhaven — a desktop companion RPG with a locked playable core.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-mk-text-secondary">
          Climb the Arena ladder, earn coins, build your home island — always at the edge of the screen. Tools exist
          because that loop needed them.
        </p>

        <div className="mt-8 glass-panel p-5 sm:p-6">
          <CaseMetaGrid>
            <CaseMetaItem label="Role">
              Producer / Creative Lead (scope, identity, pipeline) · art direction &amp; implementation
            </CaseMetaItem>
            <CaseMetaItem label="Status">
              In development · <strong>NOW:</strong> Arena + Build Companion (Tauri widget) · Focus/POI parked · Story
              Coming Soon
            </CaseMetaItem>
            <CaseMetaItem label="Loop">Arena → Coins → Home-Island Build</CaseMetaItem>
            <CaseMetaItem label="Stack">Tauri 2 · React · Three.js / R3F · TypeScript</CaseMetaItem>
            <CaseMetaItem label="Links">
              <a href={SKYHAVEN_LANDING} className="text-accent-cyan hover:underline" target="_blank" rel="noreferrer">
                Landing
              </a>
              {' · '}
              <a href={REPO_SKYHAVEN} className="text-accent-cyan hover:underline" target="_blank" rel="noreferrer">
                Coincraft_Skyhaven
              </a>
              {' · '}
              <a href={REPO_VFX_STUDIO} className="text-accent-cyan hover:underline" target="_blank" rel="noreferrer">
                skyhaven-vfx-studio
              </a>
            </CaseMetaItem>
          </CaseMetaGrid>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-panel p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-mk-text">Problem</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mk-text-secondary sm:text-base">
            Indie scope sprawl: Focus, Story, Social, Combat, and Build competed for one identity. Public copy risked
            selling Focus as the core while the playable truth was Arena + Build. Combat VFX lacked a reliable authoring
            → in-game ship path.
          </p>
        </div>
      </section>

      <CaseSection
        id="concept"
        headline="A companion that lives on the desktop edge."
        oneLiner="Skyhaven is designed to stay visible while you work — Arena runs, coins drop, island grows."
        tradeOff="Parking Focus/Story reduces feature-list marketing, but stops the portfolio from contradicting the build."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaFigure src={MEDIA.skyhaven.hub} alt="Skyhaven hub — airship and floating islands" />
          <MediaFigure
            src={MEDIA.skyhaven.buildJump}
            alt="Home island build — jump between floating platforms"
            caption="Build Companion + home island — NOW pillar alongside Arena."
          />
        </div>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-mk-text-secondary">
          <li>Product identity lock: Arena + Build = NOW; Focus/POI parked; Story = Coming Soon (not playable).</li>
          <li>Documented across pitch, wiki, landing, and portfolio so messaging stays consistent.</li>
        </ul>
      </CaseSection>

      <CaseSection
        id="style"
        headline="A readable fantasy desktop world."
        oneLiner="Arena spaces, home island, and UI modes that stay clear at companion scale."
        tradeOff="Strong stills over unfinished story cinematic — honesty beats lore dump."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MediaFigure src={MEDIA.skyhaven.arenaDash} alt="Arena overview" aspect="square" />
          <MediaFigure src={MEDIA.skyhaven.bow} alt="Bow aim telegraph in arena" aspect="square" />
          <MediaFigure src={MEDIA.skyhaven.arenaShop} alt="Arena armory shop UI" aspect="square" />
        </div>
      </CaseSection>

      <CaseSection
        id="combat"
        headline="Arena is the climb — capture must match the claim."
        oneLiner="Arena combat is part of the locked core; clean opponent / hit-feedback capture is still a filming gap (trailer uses a placeholder beat where needed)."
        tradeOff="Shipping preview media now with labeled honesty vs waiting for clean combat — prefer honesty + short clips in progress."
      >
        <MediaFigure
          src={MEDIA.skyhaven.arenaDash}
          alt="Arena melee — dash and enemy encounter"
          caption="Arena ingame stills — VFX hitch probe visible in some dev captures; combat showcase upgrades when localhost-free footage lands."
        />
        <p className="mt-4 text-sm text-mk-text-muted">
          Do not present placeholder swings as finished PvP polish beyond what screens prove.
        </p>
      </CaseSection>

      <CaseSection
        id="build-loop"
        headline="Coins from Arena feed the home island."
        oneLiner="Farm, gather, mine, and build on the island — the desk-side fantasy that makes the climb matter."
        tradeOff="Depth of build systems vs companion clarity — show playable island + widget modes, not every planned station."
      >
        <MediaFigure src={MEDIA.skyhaven.buildJump} alt="Island traversal and build fantasy" />
      </CaseSection>

      <CaseSection
        id="vfx-studio"
        headline="Combat needed VFX that actually ships — so the studio exists."
        oneLiner="VFX Studio authors effects bound to an action registry, then one-button ship:ingame into Coincraft_Skyhaven."
        tradeOff="Separate DCC + ship button vs full in-engine authoring — chose shippable content path over in-engine theater."
      >
        <MediaFigure
          src={MEDIA.skyhaven.vfxStudio}
          alt="Skyhaven VFX Instrument Studio"
          caption="Vertical slice: Cracked Mask + Greatsword Combo — repo Aaroncxc/skyhaven-vfx-studio."
        />
      </CaseSection>

      <CaseSection
        id="vfx-to-game"
        headline="One button: from VFX Studio into the live game."
        oneLiner="Author the effect in the studio, hit ship — the game takes over fullscreen with no overlay, so the pipeline is visible as a single action."
      >
        <VfxToGameShowcase />
      </CaseSection>

      <CaseSection
        id="dev-hub"
        headline="Build needed calibrated assets — Dev Hub makes Meshy usable."
        oneLiner="Building Lab calibrates Meshy→GLB so island / TPS content can land in the companion without one-off chaos."
        tradeOff="Internal lab vs waiting on perfect DCC — ship calibration path that unblocks Build."
      >
        <div className="glass-panel border-dashed p-6 text-sm text-mk-text-secondary">
          <p className="font-medium text-mk-text">Dev Hub Building Lab — footage stub</p>
          <p className="mt-2">
            Dev launcher + Building Lab UI capture is not ready for a clean public clip yet. Mentioned here because Build
            needed the pipeline — full walkthrough films next; no invented UI.
          </p>
          <Link href="/tools#dev-hub" className="mt-4 inline-flex text-sm font-semibold text-accent-cyan">
            Tools index → Dev Hub
          </Link>
        </div>
      </CaseSection>

      <section className="border-t border-[color:var(--surface-border)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-mk-text">Lock the identity; build the pipes; show the gap.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mk-text-secondary">
            A hard NOW/LATER lock keeps pitch and portfolio honest. Separate VFX DCC + ship button scales combat content.
            Next lever: clean Arena combat capture + trailer replace of any placeholder beat.
          </p>
          <p className="mt-4 text-xs text-mk-text-muted">
            Not presented as live: Story Mode · Focus/POI sessions · Taverne / Social Hub multiplayer · Shop &amp;
            Achievements beyond UI shells.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SKYHAVEN_LANDING} className="btn-solid rounded-full px-5 py-2.5 text-sm" target="_blank" rel="noreferrer">
              Open landing
            </a>
            <a href={buildHireMailto(MAILTO_SUBJECTS.technical)} className="glass-button rounded-full px-5">
              Technical Producer intro
            </a>
          </div>
        </div>
      </section>
    </ProducerShell>
  );
}
