import { africaChallengeCopy } from '@/lib/v3AfricaPartners';
import { dadbProductionEnrichment } from '@/lib/v3DadbProductionStory';
import { CASE_STUDY_NARRATIVES } from '@/lib/caseStudyNarratives';
import { AI_APP_DEV_HIGHLIGHT_SECTION } from '@/lib/highlightSections';
import { TOOL_PROJECTS } from '@/lib/toolProjects';
import type { CaseStudy, Locale } from '@/lib/v3Content';
import type { CaseSlideKind } from '@/lib/v3CaseSlides';

export type SlideEnrichment = {
  arcLabel?: string;
  headline?: string;
  bullets?: string[];
  sources: string[];
};

function stripMd(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentences(text: string, max = 4): string[] {
  return stripMd(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12)
    .slice(0, max);
}

function narrativeBullets(slug: string, sectionIndex: number): { bullets: string[]; source: string } | null {
  const sections = CASE_STUDY_NARRATIVES[slug];
  if (!sections?.[sectionIndex]) return null;
  return {
    bullets: sentences(sections[sectionIndex].body, 4),
    source: `lib/caseStudyNarratives.ts (${slug})`,
  };
}

function toolProject(id: string) {
  return TOOL_PROJECTS.find((p) => p.id === id);
}

function toolSectionBullets(id: string, sectionIndex: number): { bullets: string[]; source: string } | null {
  const p = toolProject(id);
  const section = p?.caseSections?.[sectionIndex];
  if (!section?.body) return null;
  return { bullets: sentences(section.body, 4), source: `lib/toolProjects.ts (${id})` };
}

function firstSentence(text: string): string {
  const s = sentences(text, 1)[0];
  return s ?? stripMd(text).slice(0, 120);
}

/** Extra slide copy from repo sources — EN pulls narratives/tools; DE reuses v3Content structure. */
export function enrichSlide(
  caseId: string,
  kind: CaseSlideKind,
  c: CaseStudy,
  locale: Locale,
): SlideEnrichment {
  const sources: string[] = [];
  const base = (): SlideEnrichment => ({ sources });

  if (locale === 'de') {
    if (caseId === 'production' && (kind === 'challenge' || kind === 'role' || kind === 'approach' || kind === 'result')) {
      return dadbProductionEnrichment(kind, 'de');
    }
    if (kind === 'challenge' && (caseId === 'digital-campus' || caseId === 'kigali' || caseId === 'elearning-africa')) {
      const a = africaChallengeCopy('de');
      return { headline: a.headline, bullets: a.bullets, sources: ['Artjom briefing', 'lib/v3Content.ts'] };
    }
  }

  switch (caseId) {
    case 'production': {
      if (kind === 'challenge' || kind === 'role' || kind === 'approach' || kind === 'result') {
        return dadbProductionEnrichment(kind, 'en');
      }
      break;
    }
    case 'heygen': {
      if (kind === 'challenge') {
        sources.push('lib/highlightSections.ts (AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1)');
        return {
          headline: locale === 'de' ? 'Sprecherkosten pro Kurs — skalierbarer Avatar-Workflow nötig' : 'Per-course narrator cost — need a scalable avatar pipeline',
          bullets: [c.summary, ...sentences(AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1!, 2)].slice(0, 4),
          sources,
        };
      }
      if (kind === 'role') {
        sources.push('lib/highlightSections.ts (AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1)');
        const b = sentences(AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1!, 3);
        return {
          headline: locale === 'de' ? 'Workflow mit dem Produktionsteam — Redaktion behält Freigabe' : 'Workflow with production — editorial keeps sign-off',
          bullets: [c.kicker, ...b],
          sources,
        };
      }
      if (kind === 'approach') {
        return {
          headline: locale === 'de' ? 'HeyGen-Avatare in der VP-Pipeline' : 'HeyGen avatars inside the VP pipeline',
          bullets: c.action,
          sources: ['lib/v3Content.ts'],
        };
      }
      if (kind === 'result') {
        return {
          headline: locale === 'de' ? '€380.000 pro Jahr eingespart' : '€380,000 saved per year',
          bullets: c.result,
          sources: ['lib/v3Content.ts'],
        };
      }
      break;
    }
    case 'lernwerk': {
      const map: Record<CaseSlideKind, number> = { challenge: 0, role: 0, approach: 2, result: 5 };
      const idx = map[kind];
      if (kind === 'role') {
        const t = toolProject('lernwerk');
        sources.push('lib/toolProjects.ts (lernwerk role/team)');
        return {
          headline: 'Learning product & delivery',
          bullets: t?.team ? [stripMd(t.team)] : [c.kicker],
          sources,
        };
      }
      const n = toolSectionBullets('lernwerk', idx);
      if (n) {
        sources.push(n.source);
        return { headline: n.bullets[0], bullets: n.bullets, sources };
      }
      break;
    }
    case 'sokra': {
      if (kind === 'challenge') {
        const t = toolProject('sokra');
        sources.push('lib/toolProjects.ts (sokra description)');
        return {
          headline: 'Schools-facing AI learning context',
          bullets: t?.description ? sentences(t.description, 2) : [c.summary],
          sources,
        };
      }
      if (kind === 'role') {
        return { headline: c.kicker, bullets: [stripMd(toolProject('sokra')?.explanation ?? c.summary)], sources: ['lib/toolProjects.ts'] };
      }
      if (kind === 'approach') {
        const n = toolSectionBullets('sokra', 0);
        if (n) sources.push(n.source);
        return { headline: 'Internal AI processes & school outreach', bullets: c.action.concat(n?.bullets.slice(0, 2) ?? []), sources };
      }
      if (kind === 'result') {
        return { headline: c.result[0], bullets: c.result, sources: ['lib/v3Content.ts'] };
      }
      break;
    }
    case 'ai-department': {
      if (kind === 'challenge') {
        return {
          headline: locale === 'de' ? 'KI in der Kursproduktion — schnell lernen, kontrolliert liefern' : 'AI in course production — learn fast, ship with control',
          bullets: [c.summary, ...sentences(AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1!, 2)].slice(0, 4),
          sources: ['lib/v3Content.ts', 'lib/highlightSections.ts'],
        };
      }
      if (kind === 'role') {
        sources.push('lib/highlightSections.ts (AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1)');
        return {
          headline: locale === 'de' ? 'KI-Abteilung aufgebaut — Change in der Produktion' : 'Built the AI department — change across production',
          bullets: [c.kicker, ...sentences(AI_APP_DEV_HIGHLIGHT_SECTION.bodyP1!, 2)],
          sources,
        };
      }
      if (kind === 'approach') {
        return {
          headline: locale === 'de' ? 'Tools + Feedbackschleifen mit Redaktion' : 'Tools + feedback loops with editorial',
          bullets: c.action,
          sources: ['lib/v3Content.ts'],
        };
      }
      if (kind === 'result') {
        return { headline: c.result[0], bullets: c.result, sources: ['lib/v3Content.ts'] };
      }
      break;
    }
    case 'course-overview': {
      const idxMap: Record<CaseSlideKind, number> = { challenge: 0, role: 1, approach: 2, result: 2 };
      if (kind === 'role') {
        const t = toolProject('course-overview');
        sources.push('lib/toolProjects.ts');
        return { headline: t?.role ?? c.kicker, bullets: t?.outcomes ?? [], sources };
      }
      const n = toolSectionBullets('course-overview', idxMap[kind]);
      if (n) {
        sources.push(n.source);
        return { headline: n.bullets[0], bullets: kind === 'approach' ? c.action.concat(n.bullets.slice(1, 3)) : n.bullets, sources };
      }
      break;
    }
    case 'digital-campus': {
      if (kind === 'challenge') {
        const a = africaChallengeCopy('en');
        const n = narrativeBullets('dadb-solar-technician-digital-campus', 1);
        if (n) sources.push(n.source);
        return {
          headline: a.headline,
          bullets: [...a.bullets, ...(n?.bullets.slice(0, 1) ?? [])],
          sources: ['Artjom briefing', ...(n ? [n.source] : ['lib/v3Content.ts'])],
        };
      }
      if (kind === 'role') {
        const n = narrativeBullets('dadb-solar-technician-digital-campus', 2);
        if (n) sources.push(n.source);
        return { headline: c.kicker, bullets: n?.bullets.slice(0, 2) ?? [c.kicker], sources };
      }
      if (kind === 'approach') {
        const solar = narrativeBullets('dadb-solar-technician-digital-campus', 2);
        const lex = narrativeBullets('lexsolar-digital-learning-kit', 2);
        sources.push('lib/caseStudyNarratives.ts (campus + lexsolar)');
        return {
          headline: 'Archicad ↔ Unreal plus Unity kit prototype',
          bullets: [...c.action, ...(lex?.bullets.slice(0, 1) ?? [])],
          sources,
        };
      }
      if (kind === 'result') {
        return { headline: c.result[0], bullets: c.result, sources: ['lib/v3Content.ts'] };
      }
      break;
    }
    case 'learning-games': {
      if (kind === 'challenge') {
        return {
          headline: 'Virtual Production after architecture',
          bullets: [c.summary],
          sources: ['lib/v3Content.ts'],
        };
      }
      if (kind === 'role') {
        return {
          headline: 'Mixed Reality & 3D for learning experiences',
          bullets: [
            '3D Artist → Mixed Reality Lead → Head of 3D → Head of Production at DADB.',
            'Unreal for virtual-production parts, small learning games and VR applications.',
          ],
          sources: ['lib/introCopy.ts (path timeline)'],
        };
      }
      if (kind === 'approach') {
        return { headline: 'Unreal → film → post pipeline', bullets: c.action, sources: ['lib/v3Content.ts'] };
      }
      if (kind === 'result') {
        return { headline: c.result[0], bullets: c.result, sources: ['lib/v3Content.ts'] };
      }
      break;
    }
    case 'kigali': {
      const n0 = narrativeBullets('elearning-africa-kigali-2024', 0);
      const n2 = narrativeBullets('elearning-africa-kigali-2024', 2);
      if (kind === 'challenge') {
        const a = africaChallengeCopy('en');
        sources.push('Artjom briefing');
        if (n0) sources.push(n0.source);
        return {
          headline: a.headline,
          bullets: [...a.bullets, ...(n0?.bullets.slice(0, 1) ?? [])],
          sources,
        };
      }
      if (kind === 'role') {
        sources.push(n2?.source ?? 'lib/v3Content.ts');
        return { headline: c.kicker, bullets: n2?.bullets.slice(0, 2) ?? [c.kicker], sources };
      }
      if (kind === 'approach') {
        return { headline: 'Booth narrative to live AR demo', bullets: c.action, sources: ['lib/v3Content.ts'] };
      }
      if (kind === 'result') {
        return { headline: c.result[0], bullets: c.result, sources: ['lib/v3Content.ts'] };
      }
      break;
    }
    case 'elearning-africa': {
      if (kind === 'challenge') {
        const a = africaChallengeCopy('en');
        const d = narrativeBullets('elearning-africa-dakar-senegal-2023', 0);
        if (d) sources.push(d.source);
        sources.push('Artjom briefing');
        return {
          headline: a.headline,
          bullets: [...a.bullets, ...(d?.bullets.slice(0, 1) ?? [])],
          sources,
        };
      }
      if (kind === 'role') {
        return { headline: c.kicker, bullets: [c.summary], sources: ['lib/v3Content.ts'] };
      }
      if (kind === 'approach') {
        const d = narrativeBullets('elearning-africa-dakar-senegal-2023', 2);
        const k = narrativeBullets('elearning-africa-kigali-2024', 2);
        sources.push('lib/caseStudyNarratives.ts (dakar + kigali)');
        return {
          headline: 'VR in Dakar · coordinated AR in Kigali',
          bullets: c.action.concat(k?.bullets.slice(0, 1) ?? []),
          sources,
        };
      }
      if (kind === 'result') {
        return { headline: c.result[0], bullets: c.result, sources: ['lib/v3Content.ts'] };
      }
      break;
    }
  }

  return base();
}
