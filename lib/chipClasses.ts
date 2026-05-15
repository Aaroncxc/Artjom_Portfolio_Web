/**
 * Shared pill styles for overlays + tinted topic tags.
 */

/** Neutral: project medium, tools name; author pill on tool tiles. */
export const metaChipClass =
  'rounded-full border border-[rgba(28,28,28,0.1)] bg-[rgba(255,255,255,0.9)] px-2.5 py-1 text-[10px] font-medium text-mk-text shadow-sm backdrop-blur-sm sm:text-[11px]';

/** “Live” on tool/game tiles — indigo. */
export const liveChipClass =
  'flex items-center gap-1 rounded-full bg-[rgba(99,102,241,0.9)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white shadow-sm backdrop-blur-sm sm:text-xs';

/** Project tile: 3D badge variants (same logic as before neutral unification). */
export const chip3dInteractiveClass =
  'rounded-full bg-[rgba(99,102,241,0.92)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm backdrop-blur-sm';
export const chip3dModalOnlyClass =
  'rounded-full bg-system-blue px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm backdrop-blur-sm';
export const chip3dGrayClass =
  'rounded-full bg-[rgba(120,120,128,0.88)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm backdrop-blur-sm';

/** Subtle tinted topic tags (cycles — pink / violet / teal). */
const CONTENT_TAG_TINTS = [
  'rounded-full px-2.5 py-0.5 text-sm font-medium bg-[rgba(236,72,153,0.12)] text-[rgb(219,39,119)]',
  'rounded-full px-2.5 py-0.5 text-sm font-medium bg-[rgba(99,102,241,0.12)] text-[rgb(99,102,241)]',
  'rounded-full px-2.5 py-0.5 text-sm font-medium bg-[rgba(20,184,166,0.14)] text-[rgb(13,148,136)]',
] as const;

export function contentTagTintAt(index: number): string {
  return CONTENT_TAG_TINTS[index % CONTENT_TAG_TINTS.length]!;
}

/** Tool modal: game / tool / app type badge (tinted). */
export function toolModalTypeChipClass(type: 'game' | 'tool' | 'app'): string {
  const base = 'px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ';
  if (type === 'game') return `${base}bg-[rgba(236,72,153,0.1)] text-[rgb(236,72,153)]`;
  if (type === 'tool') return `${base}bg-[rgba(99,102,241,0.1)] text-[rgb(99,102,241)]`;
  return `${base}bg-[rgba(20,184,166,0.1)] text-[rgb(20,184,166)]`;
}
