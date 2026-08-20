import { SKYHAVEN_LOGO } from '@/lib/skyhavenVideos';

export type CaseStudyBannerGlow = 'amber' | 'blue' | 'violet' | 'indigo' | 'emerald' | 'neutral';

export type CaseStudyBannerMark =
  | { kind: 'image'; src: string; alt: string; width: number; height: number; className?: string }
  | { kind: 'agata-wordmark' }
  | { kind: 'title' };

export interface CaseStudyBannerConfig {
  glow: CaseStudyBannerGlow;
  mark: CaseStudyBannerMark;
  /** Optional cutout overlaid on the right (e.g. ninja beauty pass). */
  cutoutSrc?: string;
  cutoutAlt?: string;
  /** Skip duplicating videoUrl under the banner; keep it in case sections. */
  keepHeroInSections?: boolean;
}

const GLOW_CLASS: Record<CaseStudyBannerGlow, string> = {
  amber: 'bg-[radial-gradient(80%_60%_at_70%_40%,rgba(212,160,64,0.16),transparent_62%)]',
  blue: 'bg-[radial-gradient(80%_60%_at_70%_40%,rgba(59,130,246,0.22),transparent_62%)]',
  violet: 'bg-[radial-gradient(80%_60%_at_65%_35%,rgba(167,139,250,0.22),transparent_62%)]',
  indigo: 'bg-[radial-gradient(80%_60%_at_70%_40%,rgba(99,102,241,0.22),transparent_62%)]',
  emerald: 'bg-[radial-gradient(80%_60%_at_70%_40%,rgba(16,185,129,0.18),transparent_62%)]',
  neutral: 'bg-[radial-gradient(80%_60%_at_70%_40%,rgba(148,163,184,0.12),transparent_62%)]',
};

export function caseStudyBannerGlowClass(glow: CaseStudyBannerGlow): string {
  return GLOW_CLASS[glow];
}

const titleMark = (): CaseStudyBannerMark => ({ kind: 'title' });

/** Dark Skyhaven-style banner for tool / game case studies (not Drive posts). */
export const CASE_STUDY_BANNERS: Record<string, CaseStudyBannerConfig> = {
  skyhaven: {
    glow: 'amber',
    mark: {
      kind: 'image',
      src: SKYHAVEN_LOGO,
      alt: 'CoinCraft Skyhaven',
      width: 1776,
      height: 608,
      className: 'mt-8 h-auto w-full max-w-5xl drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:mt-10',
    },
    keepHeroInSections: true,
  },
  'agata-journal': {
    glow: 'blue',
    mark: { kind: 'agata-wordmark' },
    keepHeroInSections: true,
  },
  'ninja-mage': {
    glow: 'violet',
    mark: titleMark(),
    cutoutSrc: '/projects/ninja-mage/render-transparent.webp',
    cutoutAlt: 'Ninja Mage beauty pass',
    keepHeroInSections: true,
  },
  'skyhaven-vfx': {
    glow: 'emerald',
    mark: titleMark(),
    keepHeroInSections: true,
  },
  occupied: {
    glow: 'indigo',
    mark: titleMark(),
    keepHeroInSections: true,
  },
  'course-overview': {
    glow: 'neutral',
    mark: titleMark(),
    keepHeroInSections: true,
  },
  flasher: {
    glow: 'blue',
    mark: titleMark(),
    keepHeroInSections: true,
  },
  'multikunst-automation': {
    glow: 'indigo',
    mark: titleMark(),
    keepHeroInSections: true,
  },
  coincraft: {
    glow: 'amber',
    mark: titleMark(),
    keepHeroInSections: true,
  },
  'ryuk-pp': {
    glow: 'neutral',
    mark: titleMark(),
    keepHeroInSections: true,
  },
};

export function getCaseStudyBanner(slug: string): CaseStudyBannerConfig | undefined {
  return CASE_STUDY_BANNERS[slug];
}

export function usesCaseStudyBanner(slug: string): boolean {
  return Boolean(CASE_STUDY_BANNERS[slug]);
}
