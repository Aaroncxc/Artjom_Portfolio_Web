/**
 * Shared pill styles for overlays + tinted topic tags.
 */

/** Neutral: project medium, tools name; author pill on tool tiles. */
export const metaChipClass =
  'rounded-full border border-[rgba(28,28,28,0.1)] bg-[rgba(255,255,255,0.9)] px-2 py-0.5 text-[10px] font-medium text-mk-text shadow-sm backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[11px]';

/** Project tile: “Learning Experience” — lime (#A2D149), dark label for contrast. */
export const chipLearningExperienceClass =
  'rounded-full border border-[rgba(28,28,28,0.16)] bg-[#A2D149] px-2 py-0.5 text-[10px] font-semibold leading-tight text-[rgba(28,28,28,0.82)] shadow-sm sm:px-2.5 sm:py-1 sm:text-[11px]';

/** “Live” on tool/game tiles — indigo. */
export const liveChipClass =
  'flex items-center gap-1 rounded-full bg-[rgba(99,102,241,0.9)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white shadow-sm backdrop-blur-sm sm:text-xs';

/** “Test now” on highlight tiles — playable build / GitHub release. */
export const testNowChipClass =
  'flex items-center gap-1 rounded-full bg-[rgba(0,122,255,0.92)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white shadow-sm backdrop-blur-sm sm:text-xs';

/** “Demo live” on highlight tiles — public demo / early access build. */
export const demoLiveChipClass =
  'flex items-center gap-1 rounded-full bg-[rgba(16,185,129,0.92)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white shadow-sm backdrop-blur-sm sm:text-xs';

/** Project tile: 3D / VR / AR — solid brand blue (same as modal-only project pills). */
export const chipTileImmersionClass =
  'inline-flex items-center justify-center self-center rounded-full bg-system-blue px-2 py-0.5 text-[10px] font-semibold leading-tight text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-[11px]';

/** Aliases kept for backward-compatible imports — all match `chipTileImmersionClass`. */
export const chip3dInteractiveClass = chipTileImmersionClass;
export const chip3dModalOnlyClass = chipTileImmersionClass;
export const chip3dGrayClass = chipTileImmersionClass;

export const chipVrClass = chipTileImmersionClass;
export const chipArClass = chipTileImmersionClass;

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
