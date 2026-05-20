'use client';

import clsx from 'clsx';
import { RichText } from '@/lib/formatRichText';

export type CollapsibleSectionAccent = 'cyan' | 'purple';

const accentRing: Record<CollapsibleSectionAccent, string> = {
  cyan: 'hover:shadow-[0_0_28px_-8px_rgba(20,184,166,0.35),0_8px_32px_rgba(28,28,28,0.08)] hover:border-accent-cyan/30',
  purple:
    'hover:shadow-[0_0_28px_-8px_rgba(139,92,246,0.38),0_8px_32px_rgba(28,28,28,0.08)] hover:border-violet-400/35',
};

interface CollapsibleSectionBarProps {
  id?: string;
  eyebrow: string;
  headlineStairs: readonly [string, string, string];
  description: string;
  /** Optional meta line (e.g. project count). */
  meta?: string;
  isExpanded: boolean;
  onToggle: () => void;
  ariaControls: string;
  accent?: CollapsibleSectionAccent;
  expandLabel?: string;
  collapseLabel?: string;
}

/** Full-width glass bar — Multikunst-style staircase title left, summary right, chevron toggle. */
export function CollapsibleSectionBar({
  id,
  eyebrow,
  headlineStairs,
  description,
  meta,
  isExpanded,
  onToggle,
  ariaControls,
  accent = 'cyan',
  expandLabel = 'Expand section',
  collapseLabel = 'Collapse section',
}: CollapsibleSectionBarProps) {
  return (
    <button
      type="button"
      id={id}
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={ariaControls}
      aria-label={isExpanded ? collapseLabel : expandLabel}
      className={clsx(
        'group w-full rounded-2xl border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.85)] text-left shadow-[0_8px_32px_rgba(28,28,28,0.08)] backdrop-blur-[40px]',
        'cursor-pointer transition-[box-shadow,border-color,background-color] duration-300',
        'hover:bg-[rgba(255,255,255,0.92)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-blue',
        accentRing[accent],
      )}
    >
      <div className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:gap-10 lg:p-8">
        <div className="min-w-0 shrink-0 sm:max-w-[min(100%,14rem)] lg:max-w-[16rem]">
          <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-mk-text-muted">
            {eyebrow}
          </span>
          <span
            aria-hidden
            className="brand-tight block text-[clamp(1.35rem,4.2vw,1.72rem)] font-semibold leading-[1] tracking-tight text-mk-text sm:text-[clamp(1.55rem,2.8vw,1.95rem)] lg:text-[2rem]"
          >
            <span className="block">{headlineStairs[0]}</span>
            <span className="block pl-[2rem] pt-[0.2em] sm:pl-[2.5rem] md:pl-[3rem]">
              {headlineStairs[1]}
            </span>
            {headlineStairs[2] ? (
              <span className="block pl-[4rem] pt-[0.2em] sm:pl-[5.25rem] md:pl-[6.25rem]">
                {headlineStairs[2]}
              </span>
            ) : null}
          </span>
        </div>

        <div className="min-w-0 flex-1 sm:border-l sm:border-black/[0.06] sm:pl-6 lg:pl-8">
          <p className="text-[0.9375rem] leading-relaxed text-mk-text-secondary sm:text-[15px] lg:text-base">
            <RichText>{description}</RichText>
          </p>
          {meta ? <p className="mt-2 text-xs text-mk-text-muted sm:text-sm">{meta}</p> : null}
        </div>

        <div
          className="flex shrink-0 items-center justify-end gap-2 self-end sm:self-center"
          aria-hidden
        >
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-mk-text-muted sm:inline">
            {isExpanded ? 'Close' : 'Open'}
          </span>
          <span
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/80 shadow-sm transition-transform duration-300',
              isExpanded && 'rotate-180',
              accent === 'purple'
                ? 'group-hover:border-violet-400/40 group-hover:text-violet-600'
                : 'group-hover:border-accent-cyan/40 group-hover:text-accent-cyan',
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
