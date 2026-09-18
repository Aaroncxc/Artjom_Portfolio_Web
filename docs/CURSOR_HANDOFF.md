# Cursor Handoff — Role Landing Pages

Stand: Branch `cursor/role-landing-pages-45ac` (off `master`).

## Was shipped ist

- Dynamische Route **`/p/[slug]`** mit SSG aus `lib/roleLandings.ts`
- UI: `components/roleLanding/RoleLandingView.tsx`
- Zwei Beispiel-Inhalte:
  - `/p/stackfuel-ai-portfolio-lead`
  - `/p/intermate-creative-lead`
- Doku: `docs/ROLE_LANDING_MVP.md`

## Branch & Repo

```bash
git fetch origin
git checkout cursor/role-landing-pages-45ac
```

Basis: `master` — **ohne** Merge des Career-Branches. Route `/p/...` kollidiert nicht mit `/career` aus `origin/cursor/career-redesign-793b`.

## Dev starten

```bash
npm install          # falls nötig
npm run dev          # http://localhost:3000
```

Preview-URLs lokal:

- http://localhost:3000/p/stackfuel-ai-portfolio-lead
- http://localhost:3000/p/intermate-creative-lead

Build prüfen:

```bash
npm run build
npm start            # optional: Production-Server lokal
```

## Dateien (Einstiegspunkte)

| Datei | Aufgabe |
| --- | --- |
| `lib/roleLandings.ts` | Content-Modell + Slugs — **hier neue Stellen anlegen** |
| `app/p/[slug]/page.tsx` | Route, Metadata, `generateStaticParams` |
| `components/roleLanding/RoleLandingView.tsx` | Layout / Template |
| `docs/ROLE_LANDING_MVP.md` | Architektur + Bewerbungs-App-Integration |

## Nächste Tasks (Desktop-Cursor)

### Content & Slugs

1. **Neue Bewerbungen:** Pro Stelle einen `RoleLanding`-Eintrag in `ROLE_LANDINGS` — Slug-Konvention: `{firma-kurz}-{rolle-kurz}` (lowercase, Bindestriche).
2. **Copy review:** Headline + bullets an echte Stellenanzeige anpassen; nur belegbare Claims (Evidence Gate).
3. **Case-Auswahl:** Immer 3 Cases; bevorzugt `/project/[slug]` mit fertiger Case Study.

### UX / Design

4. **Career-Branch mergen** (wenn PR `#career-redesign` ready): zuerst `origin/cursor/career-redesign-793b` in `master`, dann Role-Landing-Branch rebasen — `/career` und `/p/` bleiben parallel.
5. Optional: Role Landing Footer-Link „Full career page“ → `/career` (nach Career-Merge).
6. Optional: OG-Images pro Slug (eigenes `openGraph.images` aus Case-Thumb).

### ultimative-bewerbung (Schwester-Repo)

7. Tracker-Feld `portfolioSlug` → URL via `https://artjomnaninjan.vercel.app/p/{slug}`.
8. Anschreiben-Generator: Satz mit Role-Landing-URL einfügen (siehe `docs/ROLE_LANDING_MVP.md`).
9. Slug-Liste aus Portfolio syncen (später: JSON-Export oder shared package — MVP: manuell).

### Qualität

10. `npm run build` vor jedem Push.
11. Vercel Preview beider Slugs nach Deploy smoke-testen.
12. Mobile + dark mode kurz prüfen (`ThemeToggle` in Header).

## Bekannte Nachbar-PR

- **Career redesign:** `origin/cursor/career-redesign-793b` — `/career`, `/career/one-pager`, `lib/careerContent.ts`
- Dieser Branch berührt **keine** Career-Dateien; Merge-Reihenfolge: Career → master, dann Role-Landing rebasen.

## Kontakt / CTA

Zentral: `lib/contact.ts` (`buildHireMailto`, `CONTACT_EMAIL`). Role Landings nutzen pro Slug `mailtoSubject` für stellenbezogene Betreffzeilen.
