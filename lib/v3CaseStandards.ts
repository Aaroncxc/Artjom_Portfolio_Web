import type { CaseStudy, Locale } from '@/lib/v3Content';
import type { CaseSlide, CaseSlideKind } from '@/lib/v3CaseSlides';

const THREAD: Record<CaseSlideKind, { en: string; de: string }> = {
  challenge: { en: 'Problem', de: 'Problem' },
  role: { en: 'Approach', de: 'Ansatz' },
  approach: { en: 'Delivery', de: 'Umsetzung' },
  result: { en: 'Outcome', de: 'Ergebnis' },
  partners: { en: 'Partners', de: 'Partner' },
};

const TODO_RESULT = {
  en: 'TODO · Additional measurable outcome not documented in repo',
  de: 'TODO · Weiteres messbares Ergebnis im Repo nicht belegt',
};

const TODO_DETAIL = {
  en: 'TODO · Detail pending from Artjom / repo sources',
  de: 'TODO · Detail folgt von Artjom / Repo-Quellen',
};

function firstSentence(text: string): string {
  const t = text.trim();
  const m = t.match(/^[^.!?]+[.!?]/);
  return (m?.[0] ?? t).trim();
}

function splitSentences(text: string, max = 3): string[] {
  return text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 14)
    .slice(0, max);
}

function hasMetric(text: string): boolean {
  return /€|\d[\d.,]*\s*(k|×|%|000|380|23|6|15|30)|KPI|six courses|sechs Kurse|15\+|380\.000/i.test(text);
}

function gatherFromCase(c: CaseStudy, kind: CaseSlideKind): string[] {
  switch (kind) {
    case 'challenge':
      return [...splitSentences(c.summary, 2), c.problem].filter(Boolean) as string[];
    case 'role':
      return [c.kicker, firstSentence(c.summary), c.action[0]].filter(Boolean) as string[];
    case 'approach':
      return c.action.slice(0, 4);
    case 'result':
      return c.result.slice(0, 4);
    default:
      return [];
  }
}

function padBullets(existing: string[], fallback: string[], locale: Locale, kind: CaseSlideKind): string[] {
  const merged = [...existing];
  for (const b of fallback) {
    if (merged.length >= 4) break;
    if (b && !merged.includes(b)) merged.push(b);
  }
  while (merged.length < 2) {
    merged.push(locale === 'de' ? TODO_DETAIL.de : TODO_DETAIL.en);
  }
  if (kind === 'result' && !merged.some((b) => hasMetric(b))) {
    if (merged.length < 4) merged.push(locale === 'de' ? TODO_RESULT.de : TODO_RESULT.en);
  }
  return merged.slice(0, 4);
}

export function threadLabel(kind: CaseSlideKind, locale: Locale): string | undefined {
  if (kind === 'partners') return undefined;
  const row = THREAD[kind];
  return locale === 'de' ? row.de : row.en;
}

export function defaultHeadline(c: CaseStudy, kind: CaseSlideKind): string {
  switch (kind) {
    case 'challenge':
      return firstSentence(c.summary);
    case 'role':
      return c.kicker;
    case 'approach':
      return c.action[0] ? firstSentence(c.action[0]) : firstSentence(c.summary);
    case 'result':
      return c.result[0] ?? firstSentence(c.summary);
    default:
      return c.title;
  }
}

/** Apply Artjom case checklist: thread label, 2–4 bullets, tools on role/approach, result metrics/TODO. */
export function applyCaseStandards(c: CaseStudy, slides: CaseSlide[], locale: Locale): CaseSlide[] {
  return slides.map((slide) => {
    if (slide.kind === 'partners') {
      return slide;
    }
    const fallback = gatherFromCase(c, slide.kind);
    const bullets = padBullets(slide.bullets ?? [], fallback, locale, slide.kind);

    let tools = slide.tools;
    if ((!tools || tools.length === 0) && (slide.kind === 'approach' || slide.kind === 'role') && c.tools.length > 0) {
      tools = c.tools;
    }

    const headline = slide.headline?.trim() ? slide.headline : defaultHeadline(c, slide.kind);
    const arcLabel = slide.arcLabel ?? threadLabel(slide.kind, locale);

    return {
      ...slide,
      headline,
      bullets,
      tools,
      arcLabel,
      emphasizeNumbers: slide.kind === 'result' ? true : slide.emphasizeNumbers,
    };
  });
}
