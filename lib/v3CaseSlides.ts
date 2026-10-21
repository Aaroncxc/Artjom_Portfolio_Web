import { africaPartnerSlideHeadline, isAfricaPartnerCase } from '@/lib/v3AfricaPartners';
import type { CaseStudy, Locale, Media } from '@/lib/v3Content';
import { enrichSlide } from '@/lib/v3CaseEnrichment';

export type CaseSlideKind = 'challenge' | 'partners' | 'role' | 'approach' | 'result';

export type CaseSlide = {
  kind: CaseSlideKind;
  title: string;
  step: string;
  headline?: string;
  bullets?: string[];
  paragraph?: string;
  tools?: string[];
  workflowVariant?: 'heygen' | 'ai-department' | 'virtual-production';
  emphasizeNumbers?: boolean;
  sources?: string[];
};

const SLIDE_TITLES: Record<CaseSlideKind, { en: string; de: string }> = {
  challenge: { en: 'Starting point', de: 'Ausgangslage' },
  partners: { en: 'Partners', de: 'Partner' },
  role: { en: 'My role', de: 'Meine Rolle' },
  approach: { en: 'Approach', de: 'Vorgehen' },
  result: { en: 'Result', de: 'Ergebnis' },
};

function workflowFromMedia(media: Media[]) {
  const w = media.find((m) => m.kind === 'workflow');
  return w?.kind === 'workflow' ? w.variant : undefined;
}

function dedupe(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

export function buildCaseSlides(c: CaseStudy, locale: Locale): CaseSlide[] {
  const slides: CaseSlide[] = [];
  const t = (kind: CaseSlideKind) => (locale === 'de' ? SLIDE_TITLES[kind].de : SLIDE_TITLES[kind].en);

  const push = (kind: CaseSlideKind, partial: Omit<CaseSlide, 'kind' | 'title' | 'step'>) => {
    slides.push({
      kind,
      title: t(kind),
      step: '',
      ...partial,
    });
  };

  const hasChallenge = Boolean(c.problem?.trim() || c.summary?.trim());
  if (hasChallenge) {
    const e = enrichSlide(c.id, 'challenge', c, locale);
    push('challenge', {
      headline: e.headline,
      bullets: dedupe(e.bullets ?? (c.problem ? [c.problem] : [c.summary])),
      sources: e.sources,
    });
  }

  if (isAfricaPartnerCase(c.id)) {
    push('partners', {
      headline: africaPartnerSlideHeadline(locale),
      sources: ['Artjom briefing (partner roles)', 'lib/v3AfricaPartners.ts'],
    });
  }

  if (c.kicker?.trim()) {
    const e = enrichSlide(c.id, 'role', c, locale);
    push('role', {
      headline: e.headline ?? c.kicker,
      bullets: e.bullets,
      paragraph: e.bullets?.length ? undefined : c.kicker,
      sources: e.sources,
    });
  }

  if (c.action.length > 0) {
    const e = enrichSlide(c.id, 'approach', c, locale);
    push('approach', {
      headline: e.headline,
      bullets: dedupe([...(e.bullets ?? []), ...c.action]),
      tools: c.tools,
      workflowVariant: workflowFromMedia(c.media),
      sources: e.sources,
    });
  }

  if (c.result.length > 0) {
    const e = enrichSlide(c.id, 'result', c, locale);
    push('result', {
      headline: e.headline,
      bullets: dedupe(e.bullets ?? c.result),
      emphasizeNumbers: true,
      sources: e.sources,
    });
  }

  return slides.map((s, i) => ({
    ...s,
    step: String(i + 1).padStart(2, '0'),
  }));
}

export function visualMediaForCase(media: Media[]): Media[] {
  return media.filter((m) => m.kind !== 'workflow');
}

export function mediaIndexForSlide(slideIndex: number, slideKind: CaseSlideKind, visualCount: number): number {
  if (visualCount <= 0) return 0;
  if (slideKind === 'partners') return Math.min(1, visualCount - 1);
  if (slideKind === 'result') return visualCount - 1;
  if (slideKind === 'approach' && visualCount > 1) return Math.min(1, visualCount - 1);
  if (slideKind === 'role' && visualCount > 2) return Math.min(1, visualCount - 1);
  return Math.min(slideIndex, visualCount - 1);
}

export function slideCountsByCaseId(featured: CaseStudy[], cases: CaseStudy[], locale: Locale): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of [...featured, ...cases]) {
    out[c.id] = buildCaseSlides(c, locale).length;
  }
  return out;
}
