import type { CaseStudy, Locale } from '@/lib/v3Content';

export type MonthYear = { year: number; month: number };

export type V3Period =
  | { status: 'known'; start: MonthYear; end: MonthYear | 'present' | 'tbd' }
  | { status: 'tbd' };

/** Documented in code — do not invent dates; see TODO where status is tbd. */
export const V3_CASE_PERIODS: Record<string, { period: V3Period; source: string }> = {
  lernwerk: {
    period: { status: 'known', start: { year: 2026, month: 9 }, end: 'present' },
    source: 'lib/toolProjects.ts (date 2026-09-01, timeframe “2026 — active”)',
  },
  sokra: {
    period: { status: 'known', start: { year: 2026, month: 3 }, end: { year: 2026, month: 5 } },
    source: 'lib/v3Content.ts kicker · lib/toolProjects.ts (March–May 2026)',
  },
  production: {
    period: { status: 'known', start: { year: 2024, month: 1 }, end: { year: 2025, month: 10 } },
    source: 'components/AboutSection.tsx (Head of Production, Jan 2024 — Oct 2025)',
  },
  heygen: {
    period: { status: 'tbd' },
    // TODO(Artjom): add documented start/end for HeyGen avatar rollout at DADB.
    source: 'TBD — no month/year range in repo',
  },
  'ai-department': {
    period: { status: 'tbd' },
    // TODO(Artjom): add documented start/end for AI department setup.
    source: 'TBD — no month/year range in repo',
  },
  'course-overview': {
    period: { status: 'known', start: { year: 2024, month: 6 }, end: 'tbd' },
    // TODO(Artjom): end date when tool was retired or handed off.
    source: 'lib/toolProjects.ts (date 2024-06-01, timeframe 2024)',
  },
  'digital-campus': {
    period: { status: 'tbd' },
    // TODO(Artjom): month range — highlightProjects.ts lists year 2025 only (solar-tech-campus).
    source: 'lib/highlightProjects.ts (year 2025) — months TBD',
  },
  'learning-games': {
    period: { status: 'tbd' },
    // TODO(Artjom): span for VP / rekuperation — highlightProjects emobility year 2024 only.
    source: 'lib/highlightProjects.ts (Rekuperation year 2024) — full span TBD',
  },
  kigali: {
    period: { status: 'tbd' },
    // TODO(Artjom): eLearning Africa 2024 — month not in repo.
    source: 'lib/highlightProjects.ts / v3Content kicker (2024)',
  },
  'elearning-africa': {
    period: { status: 'tbd' },
    // TODO(Artjom): Dakar 2023 + Kigali 2024 — event months not in repo.
    source: 'documents/Arbeitszeugnis_DADB_Artjom_Naninjan.html (years 2023, 2024)',
  },
};

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const DE_MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;

function fmtMonth(m: MonthYear, locale: Locale): string {
  const names = locale === 'de' ? DE_MONTHS : EN_MONTHS;
  return `${names[m.month - 1]} ${m.year}`;
}

export function formatV3Period(period: V3Period, locale: Locale): string {
  if (period.status === 'tbd') return 'TBD';
  const start = fmtMonth(period.start, locale);
  if (period.end === 'present') {
    return locale === 'de' ? `${start} – heute` : `${start} – present`;
  }
  if (period.end === 'tbd') {
    return `${start} – TBD`;
  }
  return `${start} – ${fmtMonth(period.end, locale)}`;
}

/** Sort key: higher = newer (for descending sort). TBD sorts by id stable at end of year group. */
export function periodSortKey(period: V3Period): number {
  if (period.status === 'tbd') return 0;
  const end =
    period.end === 'present'
      ? { year: 9999, month: 12 }
      : period.end === 'tbd'
        ? period.start
        : period.end;
  return end.year * 100 + end.month;
}

export function periodGroupYear(period: V3Period): number | 'tbd' {
  if (period.status === 'tbd') return 'tbd';
  if (period.end === 'present') return period.start.year;
  if (period.end === 'tbd') return period.start.year;
  return period.end.year;
}

export type TimelineCase = CaseStudy & { period: V3Period; periodLabel: string };

export function buildTimelineCases(featured: CaseStudy[], cases: CaseStudy[], locale: Locale): TimelineCase[] {
  const all = [...featured, ...cases];
  return all
    .map((c) => {
      const meta = V3_CASE_PERIODS[c.id] ?? { period: { status: 'tbd' as const }, source: 'missing' };
      return {
        ...c,
        period: meta.period,
        periodLabel: formatV3Period(meta.period, locale),
      };
    })
    .sort((a, b) => periodSortKey(b.period) - periodSortKey(a.period));
}

export function groupCasesByYear(
  items: TimelineCase[],
  locale: Locale,
): { year: number | 'tbd'; label: string; cases: TimelineCase[] }[] {
  const map = new Map<number | 'tbd', TimelineCase[]>();
  for (const c of items) {
    const y = periodGroupYear(c.period);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(c);
  }
  const keys = [...map.keys()].sort((a, b) => {
    if (a === 'tbd') return 1;
    if (b === 'tbd') return -1;
    return (b as number) - (a as number);
  });
  return keys.map((year) => ({
    year,
    label: year === 'tbd' ? (locale === 'de' ? 'Datum offen' : 'Date TBD') : String(year),
    cases: map.get(year)!,
  }));
}

export function getPeriodMeta(id: string) {
  return V3_CASE_PERIODS[id];
}
