import type { Locale } from '@/lib/v3Content';
import type { CaseSlideKind } from '@/lib/v3CaseSlides';

/** Artjom briefing — mission thread for DADB production case (2026). */
export const DADB_MISSION_ARC: Record<
  CaseSlideKind,
  { arc: { en: string; de: string }; headline: { en: string; de: string }; bullets: { en: string[]; de: string[] } }
> = {
  challenge: {
    arc: { en: '01 · Awareness in schools', de: '01 · Awareness in Schulen' },
    headline: {
      en: 'Into schools in India — open young people’s eyes to renewables.',
      de: 'In indische Schulen — junge Menschen für Erneuerbare sensibilisieren.',
    },
    bullets: {
      en: [
        'At DADB the point was not “more videos” alone: reach students where they are — in schools — and make the renewable-energy sector tangible.',
        'The target group: young people who should discover renewables as a career path before and during university.',
      ],
      de: [
        'Bei DADB ging es nicht nur um „mehr Videos“: Studierende dort erreichen, wo sie sind — in Schulen — und den Sektor Erneuerbare Energien greifbar machen.',
        'Zielgruppe: junge Menschen, die Erneuerbare als Karriereweg entdecken sollen — vor und während des Studiums.',
      ],
    },
  },
  partners: {
    arc: { en: '', de: '' },
    headline: { en: '', de: '' },
    bullets: { en: [], de: [] },
  },
  role: {
    arc: { en: '02 · Inspire for renewables', de: '02 · Begeisterung für Erneuerbare' },
    headline: {
      en: 'Head of Production — building the engine that ships that learning.',
      de: 'Head of Production — die Maschine bauen, die dieses Lernen ausliefert.',
    },
    bullets: {
      en: [
        'Built the production department from the ground up and led it as Head of Production — film-based courses first, then scaled parallel productions.',
        'Around 35 people across four sites in Germany, India, and Senegal; six course productions in parallel across editorial, 2D, 3D, cinematic, XR, and interactive modules.',
        'Owned PM from scratch: priorities, staffing, dependencies, risk, quality, and executive reporting — plus a live dashboard so teams and leadership shared one view of the pipeline.',
      ],
      de: [
        'Produktionsabteilung von null aufgebaut und als Head of Production geführt — zuerst filmische Kurse, dann parallele Produktionen skaliert.',
        'Etwa 35 Menschen an vier Standorten in Deutschland, Indien und Senegal; sechs Kursproduktionen parallel über Redaktion, 2D, 3D, Film, XR und interaktive Module.',
        'PM von Grund auf: Prioritäten, Personal, Abhängigkeiten, Risiko, Qualität, Reporting — plus Live-Dashboard, damit Teams und Führung dieselbe Pipeline-Sicht hatten.',
      ],
    },
  },
  approach: {
    arc: { en: '03 · Practice-ready qualifications', de: '03 · Praxisnah qualifizieren' },
    headline: {
      en: 'Production discipline, AI-assisted scripts, and feedback loops — editorial control in-house.',
      de: 'Produktionsdisziplin, KI-gestützte Skripte und Feedbackschleifen — Redaktion bleibt in-house.',
    },
    bullets: {
      en: [
        'Structured the team: 3 After Effects, 6 editors, 6 2D, 6 3D artists, plus 2 project managers in India — 23 direct reports under direct leadership.',
        'Assigned teams per course, owned roadmap, staffing, and production budget; coordinated freelancers, voice talent, and external SMEs with editorial and instructional design.',
        'Pushed AI into script work and editorial feedback loops (HeyGen, Synthesia, ElevenLabs) while keeping editorial sign-off in-house; built internal tools including the Course Overview Tool with Cursor.',
      ],
      de: [
        'Team strukturiert: 3 After Effects, 6 Cutter, 6 2D-, 6 3D-Artists plus 2 Projektmanager in Indien — 23 direct reports in der Linie.',
        'Teams pro Kurs, Roadmap, Personal und Produktionsbudget; Freelancer, Sprecher und externe SMEs mit Redaktion und Instructional Design gesteuert.',
        'KI in Skriptarbeit und Feedbackschleifen (HeyGen, Synthesia, ElevenLabs) — redaktionelle Freigabe bleibt in-house; interne Tools inkl. Course Overview Tool mit Cursor gebaut.',
      ],
    },
  },
  result: {
    arc: { en: '04 · Bridge to employers', de: '04 · Brücke zu Arbeitgebern' },
    headline: {
      en: 'Job-ready for renewables — easier path into the industry after university.',
      de: 'Jobready für Erneuerbare — leichterer Einstieg in die Branche nach dem Studium.',
    },
    bullets: {
      en: [
        'Courses were meant to qualify people in practice — so graduates can find work in the sector more easily, including at companies that build solar parks and similar projects.',
        'KPI held: six courses per year met and maintained — from 2025, six courses of roughly 30 hours each.',
        'No placement statistics claimed here — the production outcome is reliable course delivery at that cadence.',
      ],
      de: [
        'Kurse sollten praxisnah qualifizieren — damit Absolventinnen und Absolventen leichter in der Branche ankommen, auch bei Unternehmen, die Solarparks oder vergleichbare Projekte aufbauen.',
        'KPI gehalten: sechs Kurse pro Jahr erreicht und gehalten — ab 2025 sechs Kurse à ca. 30 Stunden.',
        'Keine Vermittlungszahlen — das Produktionsergebnis ist verlässliche Kursauslieferung in diesem Takt.',
      ],
    },
  },
};

export function dadbProductionArcLabel(kind: CaseSlideKind, locale: Locale): string | undefined {
  const arc = DADB_MISSION_ARC[kind]?.arc;
  if (!arc) return undefined;
  const label = locale === 'de' ? arc.de : arc.en;
  return label.trim() || undefined;
}

export function dadbProductionEnrichment(kind: CaseSlideKind, locale: Locale): {
  arcLabel?: string;
  headline: string;
  bullets: string[];
  sources: string[];
} {
  const block = DADB_MISSION_ARC[kind];
  const lang = locale === 'de' ? 'de' : 'en';
  const sources = ['Artjom briefing (DADB mission thread)'];
  if (kind === 'role' || kind === 'approach') {
    sources.push('lib/highlightSections.ts', 'lib/v3Content.ts');
  }
  if (kind === 'approach') {
    sources.push('lib/highlightSections.ts (AI_APP_DEV)', 'lib/v3Content.ts (ai-department)');
  }
  if (kind === 'result') {
    sources.push('lib/v3Content.ts');
  }
  return {
    arcLabel: dadbProductionArcLabel(kind, locale),
    headline: block.headline[lang],
    bullets: block.bullets[lang],
    sources,
  };
}
