import type { Locale } from '@/lib/v3Content';

export const AFRICA_PARTNER_CASE_IDS = ['digital-campus', 'kigali', 'elearning-africa'] as const;

export type AfricaPartnerCaseId = (typeof AFRICA_PARTNER_CASE_IDS)[number];

export function isAfricaPartnerCase(caseId: string): caseId is AfricaPartnerCaseId {
  return (AFRICA_PARTNER_CASE_IDS as readonly string[]).includes(caseId);
}

export type AfricaPartnerLogo = {
  id: string;
  name: string;
  /** null → render TODO wordmark placeholder in UI */
  src: string | null;
  role: { en: string; de: string };
  invertInDark?: boolean;
};

export const AFRICA_SOLAR_PARTNERS: AfricaPartnerLogo[] = [
  {
    id: 'hs-offenburg',
    name: 'Hochschule Offenburg',
    src: '/client-logos/hs-offenburg.svg',
    role: {
      en: 'German partner — co-built the solar technician course for vocational training.',
      de: 'Deutscher Partner — gemeinsam den Solarteur-Kurs für die Berufsausbildung aufgebaut.',
    },
  },
  {
    id: 'fraunhofer',
    name: 'Fraunhofer',
    src: null,
    role: {
      en: 'Contributed to the solar technician course as an institute partner.',
      de: 'Am Solarteur-Kurs als Institutspartner mitgearbeitet.',
    },
  },
  {
    id: 'lexsolar',
    name: 'leXsolar',
    src: '/projects/lexsolar-digital-learning-kit/lexsolar-logo.svg',
    role: {
      en: 'Built and visualised the physical solar training case (“Koffer”) — digital twin in Unity.',
      de: 'Hat den Solar-Lernkoffer gebaut und visualisiert — digitaler Zwilling in Unity.',
    },
    invertInDark: false,
  },
];

export type AfricaFlowStep = { label: { en: string; de: string }; detail: { en: string; de: string } };

export const AFRICA_MARKET_COURSE_FLOW: AfricaFlowStep[] = [
  {
    label: { en: 'Market', de: 'Markt' },
    detail: {
      en: 'Vocational training in Africa — many people need to become solar technicians.',
      de: 'Berufsausbildung in Afrika — viele Menschen müssen zum Solarteur ausgebildet werden.',
    },
  },
  {
    label: { en: 'Course', de: 'Kurs' },
    detail: {
      en: 'Solar technician course built with Hochschule Offenburg as the German partner.',
      de: 'Solarteur-Kurs gemeinsam mit der Hochschule Offenburg als deutschem Partner.',
    },
  },
  {
    label: { en: 'Training kit', de: 'Koffer' },
    detail: {
      en: 'leXsolar’s hands-on case — built, visualised, and mirrored digitally where the project shows it.',
      de: 'leXsolars Hands-on-Koffer — gebaut, visualisiert und digital gespiegelt, wo das Projekt es zeigt.',
    },
  },
];

/** Artjom briefing (2026) — allowed factual layer on top of repo narratives. */
export function africaChallengeCopy(locale: Locale): { headline: string; bullets: string[] } {
  if (locale === 'de') {
    return {
      headline: 'Berufsausbildung in Afrika braucht Solarteure in großer Zahl.',
      bullets: [
        'Der Zielmarkt ist die berufliche Bildung — nicht Einzel-Workshops, sondern qualifizierte Solarteure für den Arbeitsmarkt.',
        'Gemeinsam mit der Hochschule Offenburg wurde ein Kurs aufgebaut, der Menschen zum Solarteur ausbildet.',
        'Fraunhofer wirkte am Solarteur-Kurs mit; leXsolar lieferte den physischen Lernkoffer und dessen Visualisierung.',
      ],
    };
  }
  return {
    headline: 'Africa’s vocational training market needs solar technicians at scale.',
    bullets: [
      'The target market is vocational training — qualified solar technicians for work, not one-off demos alone.',
      'Together with Hochschule Offenburg as the German partner, a course was built to train people as solar technicians.',
      'Fraunhofer contributed to the solar technician course; leXsolar built and visualised the physical training kit.',
    ],
  };
}

export function africaPartnerSlideTitle(locale: Locale): string {
  return locale === 'de' ? 'Partner & Zusammenspiel' : 'Partners & how it fits';
}

export function africaPartnerSlideHeadline(locale: Locale): string {
  return locale === 'de'
    ? 'Markt → Kurs → Koffer — drei Partner, eine Ausbildungslinie'
    : 'Market → course → training kit — three partners, one training line';
}
