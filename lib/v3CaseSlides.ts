import type { CaseStudy, Locale, Media } from '@/lib/v3Content';

export type CaseSlideKind = 'challenge' | 'role' | 'approach' | 'result';

export type CaseSlide = {
  kind: CaseSlideKind;
  title: string;
  bullets?: string[];
  paragraph?: string;
  tools?: string[];
  workflowVariant?: 'heygen' | 'ai-department' | 'virtual-production';
  emphasizeNumbers?: boolean;
};

const SLIDE_TITLES: Record<CaseSlideKind, { en: string; de: string }> = {
  challenge: { en: 'Starting point', de: 'Ausgangslage' },
  role: { en: 'My role', de: 'Meine Rolle' },
  approach: { en: 'Approach', de: 'Vorgehen' },
  result: { en: 'Result', de: 'Ergebnis' },
};

function workflowFromMedia(media: Media[]) {
  const w = media.find((m) => m.kind === 'workflow');
  return w?.kind === 'workflow' ? w.variant : undefined;
}

export function buildCaseSlides(c: CaseStudy, locale: Locale): CaseSlide[] {
  const slides: CaseSlide[] = [];
  const t = (kind: CaseSlideKind) => (locale === 'de' ? SLIDE_TITLES[kind].de : SLIDE_TITLES[kind].en);

  if (c.problem?.trim()) {
    slides.push({ kind: 'challenge', title: t('challenge'), paragraph: c.problem });
  } else if (c.summary?.trim()) {
    slides.push({ kind: 'challenge', title: t('challenge'), paragraph: c.summary });
  }

  if (c.kicker?.trim()) {
    slides.push({ kind: 'role', title: t('role'), paragraph: c.kicker });
  }

  if (c.action.length > 0) {
    slides.push({
      kind: 'approach',
      title: t('approach'),
      bullets: c.action,
      tools: c.tools,
      workflowVariant: workflowFromMedia(c.media),
    });
  }

  if (c.result.length > 0) {
    slides.push({
      kind: 'result',
      title: t('result'),
      bullets: c.result,
      emphasizeNumbers: true,
    });
  }

  return slides;
}

export function visualMediaForCase(media: Media[]): Media[] {
  return media.filter((m) => m.kind !== 'workflow');
}

/** Pick right-rail media for slide index (reuse assets; no new content). */
export function mediaIndexForSlide(slideIndex: number, slideKind: CaseSlideKind, visualCount: number): number {
  if (visualCount <= 0) return 0;
  if (slideKind === 'result') return visualCount - 1;
  if (slideKind === 'approach' && visualCount > 1) return Math.min(1, visualCount - 1);
  return 0;
}

export function slideCountsByCaseId(featured: CaseStudy[], cases: CaseStudy[], locale: Locale): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of [...featured, ...cases]) {
    out[c.id] = buildCaseSlides(c, locale).length;
  }
  return out;
}
