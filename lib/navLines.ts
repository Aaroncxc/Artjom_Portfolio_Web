import type { HighlightProjectId } from '@/lib/highlightProjects';

/** Default line — About, and fallback before the first section is measured. */
export const DEFAULT_NAV_LINE = 'I build worlds you can ship.';

const SECTION_NAV_LINES: Record<string, string> = {
  about: DEFAULT_NAV_LINE,
  highlights: 'I keep productions on time.',
  'highlights-ai-apps': 'I ship apps with AI in the loop.',
  'highlights-architecture': 'Spaces you can walk through.',
  'highlights-skyhaven': 'A game that lives on your desktop.',
  'highlights-vfx': 'Combat you can read in a frame.',
  'highlights-multikunst': 'Made with friends. Shipped as Multikunst.',
  projects: 'Work I still stand behind.',
  'tools-games': 'Tools and games you can open.',
  footer: "Let's build the next one.",
};

const PROJECT_NAV_LINES: Record<HighlightProjectId, string> = {
  lexsolar: 'Solar labs that scale on screen.',
  kigali: 'A booth that had to hold a crowd.',
  'course-overview': 'The dashboard that kept courses honest.',
  dakar: 'Dakar, live — the room is the brief.',
  emobility: 'Rekuperation, taught as motion.',
  'solar-tech-campus': 'A campus you can walk in Unreal.',
  'the-house-highlight': 'A house you can enter, not just render.',
  'multikunst-multiply': 'A fragrance film with type in the lead.',
  'multikunst-multiwatch': 'A watch that has to sell in seconds.',
  'multikunst-occupied': 'VFX you play live, not export.',
  skyhaven: 'A game that lives on your desktop.',
  'skyhaven-vfx': 'VFX bound to the game, not a timeline.',
  'ninja-mage': 'An Avatar-cut combat short.',
  flasher: 'Flashcards you can actually finish.',
  'multikunst-automation': 'Pipelines you can reopen tomorrow.',
  'agata-journal': 'A journal you speak, not type.',
};

export function navLineForKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  if (key.startsWith('project:')) {
    return PROJECT_NAV_LINES[key.slice('project:'.length) as HighlightProjectId];
  }
  return SECTION_NAV_LINES[key];
}
