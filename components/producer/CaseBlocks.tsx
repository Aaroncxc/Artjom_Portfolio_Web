import clsx from 'clsx';
import type { ReactNode } from 'react';

export function ProofChips({ chips, className }: { chips: readonly string[]; className?: string }) {
  return (
    <ul className={clsx('flex flex-wrap gap-2', className)}>
      {chips.map((chip) => (
        <li
          key={chip}
          className="theme-chip rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-mk-text-secondary sm:text-xs"
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}

export function CaseMetaGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</dl>
  );
}

export function CaseMetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mk-text-muted">{label}</dt>
      <dd className="mt-1.5 text-sm leading-snug text-mk-text">{children}</dd>
    </div>
  );
}

export function CaseSection({
  id,
  headline,
  oneLiner,
  children,
  tradeOff,
}: {
  id?: string;
  headline: string;
  oneLiner: string;
  children?: ReactNode;
  tradeOff?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-[color:var(--surface-border)] py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-xl font-semibold tracking-tight text-mk-text sm:text-2xl">{headline}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mk-text-secondary sm:text-base">
          {oneLiner}
        </p>
        {tradeOff ? (
          <p className="mt-4 max-w-3xl border-l-2 border-accent-cyan/40 pl-4 text-sm italic text-mk-text-muted">
            Trade-off: {tradeOff}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function MediaFigure({
  src,
  alt,
  caption,
  aspect = 'video',
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: 'video' | 'wide' | 'square';
}) {
  const aspectClass =
    aspect === 'square' ? 'aspect-square' : aspect === 'wide' ? 'aspect-[21/9]' : 'aspect-video';
  return (
    <figure className="overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-card)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={clsx('h-full w-full object-cover', aspectClass)} loading="lazy" />
      {caption ? (
        <figcaption className="border-t border-[color:var(--surface-border)] px-4 py-3 text-xs leading-relaxed text-mk-text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function VfxToGameShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,1.1fr)]">
      <MediaFigure
        src="/producer/skyhaven/vfx-studio-ui.webp"
        alt="Skyhaven VFX Instrument Studio — timeline, combat parameters, and Ins Game control"
        caption="VFX Instrument Studio — Cracked Mask + Greatsword Combo 3 slice; action registry + ship:ingame path in repo."
      />
      <div className="glass-panel flex flex-col justify-center p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">Showcase slot</p>
        <h3 className="mt-2 text-lg font-semibold text-mk-text">One-button VFX → fullscreen game</h3>
        <p className="mt-3 text-sm leading-relaxed text-mk-text-secondary">
          The production demo is a single <strong className="font-medium text-mk-text">Ins Game</strong> handoff:
          authored effect → ship into Coincraft_Skyhaven → live combat state with no tool chrome. A clean capture of
          that transition is the next filming step — this block is wired so the clip drops in without rewriting copy.
        </p>
        <div
          className="mt-6 flex aspect-video items-center justify-center rounded-xl border border-dashed border-[color:var(--surface-border)] bg-[color:var(--surface-card)] px-4 text-center"
          data-media-slot="vfx-to-game-capture"
        >
          <div>
            <p className="text-sm font-medium text-mk-text">Video placeholder</p>
            <p className="mt-1 text-xs text-mk-text-muted">
              Drop <code className="text-[11px]">/public/producer/skyhaven/vfx-to-game.mp4</code> when filmed
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-mk-text-muted">
          Not faking the transition — UI still + honest gap until a localhost-free ship capture lands.
        </p>
      </div>
    </div>
  );
}
