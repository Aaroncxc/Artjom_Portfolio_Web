import type { Locale } from '@/lib/v3Content';

export const INDIA_EXCHANGE_ID = 'india-germany-exchange';

export type ExchangeCopy = {
  kicker: { en: string; de: string };
  title: { en: string; de: string };
  summary: { en: string; de: string };
  arc: { en: string[]; de: string[] };
  bullets: { en: string[]; de: string[] };
  roleTodo: { en: string; de: string };
  photoTodo: { en: string; de: string };
  partnerOffenburgRole: { en: string; de: string };
};

export const INDIA_EXCHANGE_COPY: ExchangeCopy = {
  kicker: {
    en: 'Bridge · India ↔ Germany',
    de: 'Brücke · Indien ↔ Deutschland',
  },
  title: {
    en: 'Exchange program — two weeks in Germany',
    de: 'Austauschprogramm — zwei Wochen in Deutschland',
  },
  summary: {
    en: 'A joint project of the Indian and German company units — in cooperation with Hochschule Offenburg. Where courses were already running or sold at universities, students could join a two-week exchange in Germany.',
    de: 'Projekt der indischen und der deutschen Gesellschaftseinheit — in Zusammenarbeit mit der Hochschule Offenburg. An Universitäten, an denen Kurse bereits liefen oder verkauft waren, konnten Studierende an einem zweiwöchigen Austausch in Deutschland teilnehmen.',
  },
  arc: {
    en: [
      'Courses already live at partner universities',
      'Exchange program as India–Germany bridge',
      'Students meet course authors and professors in person',
    ],
    de: [
      'Kurse liefen bereits an Partner-Universitäten',
      'Austauschprogramm als Brücke Indien–Deutschland',
      'Studierende treffen Kursersteller und Professoren persönlich',
    ],
  },
  bullets: {
    en: [
      'Artjom describes it as a major project — students travelled to Germany for two weeks.',
      'They met the professors who helped build the courses, could talk, get information, network, and attend classes.',
      'No participant counts, university names, or years stated here — not documented in the repo.',
    ],
    de: [
      'Artjom beschreibt es als riesiges Projekt — Studierende reisten zwei Wochen nach Deutschland.',
      'Sie lernten die Professoren kennen, die an den Kursen mitgewirkt haben, konnten reden, Informationen holen, netzwerken und Unterricht erleben.',
      'Keine Teilnehmerzahlen, Uni-Namen oder Jahre — im Repo nicht belegt.',
    ],
  },
  roleTodo: {
    en: 'TODO · Artjom’s role in the exchange program — not documented in repo',
    de: 'TODO · Artjoms Rolle im Austauschprogramm — im Repo nicht belegt',
  },
  photoTodo: {
    en: 'TODO · exchange-program photos — none identified in repo',
    de: 'TODO · Fotos zum Austauschprogramm — im Repo nicht eindeutig vorhanden',
  },
  partnerOffenburgRole: {
    en: 'Cooperation partner · course co-development (see Solar Technician / campus work)',
    de: 'Kooperationspartner · Kurs-Mitentwicklung (vgl. Solarteur / Campus)',
  },
};

export const EXCHANGE_ENTITY_LABELS = {
  india: { en: 'DADB India', de: 'DADB India' },
  germany: { en: 'DADB Germany', de: 'DADB Germany' },
} as const;

export function exchangeT(locale: Locale, block: { en: string; de: string }): string {
  return locale === 'de' ? block.de : block.en;
}

export function exchangeList(locale: Locale, block: { en: string[]; de: string[] }): string[] {
  return locale === 'de' ? block.de : block.en;
}
