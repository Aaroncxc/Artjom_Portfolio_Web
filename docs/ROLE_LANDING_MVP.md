# Role Landing MVP — `/p/[slug]`

Stellen-spezifische Portfolio-Slices auf **einer** Vercel-Site. Kein Deploy und keine Extra-Kosten pro Bewerbung — nur eine neue Content-Zeile in `lib/roleLandings.ts`.

Live-Hauptseite: [artjomnaninjan.vercel.app](https://artjomnaninjan.vercel.app)

## Warum `/p/[slug]`?

| Ansatz | Problem |
| --- | --- |
| Neues Vercel-Projekt pro Stelle | Deploy-Zeit, Env-Duplikate, Kosten |
| PDF-only Anschreiben | Kein interaktives Portfolio, schwer aktualisierbar |
| Generische Homepage | Recruiter sehen nicht sofort die relevanten 3 Cases |

**Lösung:** Eine URL pro Rolle/Firma, kuratiert aus dem bestehenden Portfolio — Headline, 3 Cases, Skills, CTA.

Schwester-Produkt: **ultimative-bewerbung** (Bewerbungs-Tracker). Der Tracker speichert den Slug; das Portfolio rendert die Seite.

## Routing

```
app/p/[slug]/page.tsx   → dynamische Route (Next.js App Router)
lib/roleLandings.ts     → Content-Modell + alle Slugs
```

- **Static generation:** `generateStaticParams()` pre-buildet alle Einträge aus `ROLE_LANDINGS`.
- **404:** Unbekannte Slugs → `not-found.tsx`.
- **Kein Konflikt mit `/career`:** Die Career-Preview (`cursor/career-redesign-793b`, Route `/career`) ist ein separates, breiteres Hiring-Portfolio. Role Landings sind schmal und stellenbezogen.

### Beispiel-URLs (nach Merge + Deploy)

| Slug | URL |
| --- | --- |
| `stackfuel-ai-portfolio-lead` | https://artjomnaninjan.vercel.app/p/stackfuel-ai-portfolio-lead |
| `intermate-creative-lead` | https://artjomnaninjan.vercel.app/p/intermate-creative-lead |

## Content-Modell

Definiert in `lib/roleLandings.ts`:

```typescript
interface RoleLanding {
  slug: string;           // URL-Segment, z. B. "stackfuel-ai-portfolio-lead"
  roleTitle: string;      // "AI Portfolio Lead"
  company: string;        // "StackFuel"
  headline: string;       // Hero-Zeile — Rolle + Fit
  bullets: string[];      // 3–5 Belegpunkte (Why this fit)
  cases: [                // Genau 3 kuratierte Cases
    RoleLandingCase,
    RoleLandingCase,
    RoleLandingCase,
  ];
  skills?: string[];      // Optionale Chips unter dem Hero
  cta: RoleLandingCTA;    // Primärer Button (meist mailto)
  mailtoSubject?: string; // OG + E-Mail-Betreff
}

interface RoleLandingCase {
  title: string;
  summary: string;
  href: string;           // `/project/...` oder externe URL
  image?: string;         // Pfad unter `/public`
  tag?: string;           // z. B. "Live tool"
}
```

### Neuen Slug anlegen

1. Eintrag in `ROLE_LANDINGS` in `lib/roleLandings.ts` hinzufügen.
2. Cases auf **bestehende** `/project/[slug]`-Seiten oder verifizierte externe URLs verlinken (Evidence Gate — siehe `.cursor/rules/case-study-narrative.mdc`).
3. `npm run build` — Slug wird automatisch statisch generiert.
4. Optional: Slug im Bewerbungs-Tracker (ultimative-bewerbung) hinterlegen.

Hilfsfunktionen:

- `getRoleLandingBySlug(slug)` — Lookup
- `getAllRoleLandingSlugs()` — für SSG + Tracker-Sync
- `roleLandingUrl(slug)` — volle URL für Anschreiben/Tracker

## Seitenaufbau (Template)

1. **Header** — Logo → `/`, Link zu `/intro`, Theme-Toggle
2. **Hero** — Company · Role landing, `roleTitle`, `headline`, Skill-Chips
3. **Why this fit** — `bullets`
4. **Selected work** — 3 Case-Karten → `/project/...` oder extern
5. **CTA** — `cta.label` + E-Mail-Fallback

Styling nutzt bestehende Portfolio-Tokens (`GlassPanel`, `LightLeaksBackground`, dark/light via `ThemeProvider`).

## Integration: ultimative-bewerbung → Anschreiben

Flow (Zielbild für den Tracker):

```
Tracker-Eintrag (Firma, Rolle, slug)
        │
        ▼
roleLandingUrl(slug)  →  https://artjomnaninjan.vercel.app/p/{slug}
        │
        ▼
Anschreiben / E-Mail: "Passendes Portfolio: {url}"
        │
        ▼
Recruiter öffnet kuratierte 3-Case-Seite statt generischer Homepage
```

**Empfohlener Anschreiben-Satz (DE):**

> Für diese Rolle habe ich drei passende Projekte kuratiert:  
> https://artjomnaninjan.vercel.app/p/stackfuel-ai-portfolio-lead

**Empfohlener Satz (EN):**

> I curated three relevant case studies for this role:  
> https://artjomnaninjan.vercel.app/p/stackfuel-ai-portfolio-lead

Im Tracker-Feld (Vorschlag): `portfolioSlug` → wird zu `{ROLE_LANDING_BASE_URL}/{portfolioSlug}`.

Konstante im Repo: `ROLE_LANDING_BASE_URL` in `lib/roleLandings.ts`.

## Verhältnis zu anderen Portfolio-Routen

| Route | Zweck |
| --- | --- |
| `/` | Vollständiges Portfolio (Grid, Highlights, About) |
| `/intro` | 2-Min Pitch Deck |
| `/project/[slug]` | Einzelne Case Study (lang) |
| `/p/[slug]` | **Stellen-spezifischer Slice** (kurz, 3 Cases) |
| `/career` | Career-Preview (Branch `cursor/career-redesign-793b`) — breiteres Hiring-UX |

Role Landings verlinken **in** Case Studies, ersetzen sie nicht.

## Lokale Entwicklung

```bash
npm install
npm run dev
# → http://localhost:3000/p/stackfuel-ai-portfolio-lead
```

## Checkliste vor Merge

- [ ] Alle `cases[].href` lösen (interne Slugs existieren)
- [ ] Bilder unter `/public` vorhanden
- [ ] `npm run build` grün
- [ ] Vercel Preview für beide Beispiel-Slugs manuell geöffnet
