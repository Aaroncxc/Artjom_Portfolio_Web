import type {
  CaseSection,
  CaseSectionMedia,
  Project,
  ProjectMedia,
} from '@/lib/types';
import { getProjectMediaGroupsConfig } from '@/lib/projectMediaGroups';
import { getCaseStudyBanner } from '@/lib/caseStudyBanners';

/** Year extracted from ISO date for chips / tiles. */
export function projectYear(date: string): string | null {
  const m = /^(\d{4})/.exec(date?.trim() ?? '');
  return m ? m[1] : null;
}

/** Format ISO date as “May 2023”. */
export function formatProjectMonthYear(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = m[3] ? Number(m[3]) : 1;
  if (!Number.isFinite(y) || mo < 1 || mo > 12) return null;
  const d = new Date(y, mo - 1, day);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(d);
}

/** Sort for grid / prev-next: curated `order`, then date desc. */
export function sortProjectsForPortfolio(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Collapse thumb/full variants and encoding noise into one key so the same
 * shot is not listed twice (e.g. `vr-scene-07-thumb.jpg` vs `vr-scene-07.webp`).
 */
export function normalizeMediaKey(src: string): string {
  try {
    const decoded = decodeURIComponent(src.trim());
    return decoded
      .toLowerCase()
      .replace(/\\/g, '/')
      .replace(/-thumb(?=\.[a-z0-9]+$)/i, '')
      .replace(/_thumb(?=\.[a-z0-9]+$)/i, '')
      .replace(/\.(jpe?g|png|webp|gif|avif|mp4|webm|mov)$/i, '');
  } catch {
    return src.trim().toLowerCase();
  }
}

export function dedupeMediaByKey<T extends { src: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = normalizeMediaKey(item.src);
    if (!item.src || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function mediaFromGalleryItem(item: ProjectMedia): CaseSectionMedia {
  const kind =
    item.type === 'video'
      ? 'video'
      : item.type === 'html'
        ? 'html'
        : item.type === 'model3d'
          ? 'model3d'
          : 'image';
  return {
    src: item.src,
    kind,
    caption: item.caption,
    title: item.title,
  };
}

/** Hero key visual: prefer video, else thumbnail / first image. */
export function resolveHeroMedia(project: Project): CaseSectionMedia | null {
  if (project.videoUrl) {
    return {
      src: project.videoUrl,
      kind: 'video',
      caption: project.description,
    };
  }
  if (project.thumbnail) {
    return { src: project.thumbnail, kind: 'image' };
  }
  const firstImage = project.images?.[0] ?? project.gallery?.find((g) => g.type === 'image')?.src;
  if (firstImage) return { src: firstImage, kind: 'image' };
  return null;
}

/**
 * Build editorial sections when a project has no explicit `caseSections`.
 * Always answers What / Why / How from description + explanation + tools,
 * then interleaves leftover gallery media.
 */
export function buildFallbackCaseSections(project: Project): CaseSection[] {
  const sections: CaseSection[] = [];
  const what = (project.description || '').trim();
  const whyHow = (project.explanation || '').trim();
  const toolsLine =
    project.tools?.length ? `Built with ${project.tools.join(', ')}.` : '';
  const hero = resolveHeroMedia(project);
  const heroKey = hero ? normalizeMediaKey(hero.src) : null;

  const gallery = project.gallery ?? [];
  const groupsConfig = getProjectMediaGroupsConfig(project.slug);
  const usedKeys = new Set<string>();
  if (heroKey) usedKeys.add(heroKey);

  const pickInline = (count: number): CaseSectionMedia[] => {
    const picked: CaseSectionMedia[] = [];
    for (const g of gallery) {
      if (picked.length >= count) break;
      const key = normalizeMediaKey(g.src);
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      picked.push(mediaFromGalleryItem(g));
    }
    return picked;
  };

  if (what) {
    sections.push({
      heading: 'What it is',
      body: what,
      layout: 'text-left',
      media: pickInline(1),
    });
  }

  if (whyHow) {
    // Prefer a clean Why section; put process cues + tools into How.
    const paragraphs = whyHow.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    const whyBody = paragraphs[0] ?? whyHow;
    const howFromStory = paragraphs.slice(1).join('\n\n');
    sections.push({
      heading: 'What it is for',
      body: whyBody,
      layout: 'text-right',
      media: pickInline(1),
    });
    const howBody = [howFromStory, toolsLine].filter(Boolean).join('\n\n');
    if (howBody) {
      sections.push({
        heading: 'How it was made',
        body: howBody,
        layout: 'text-left',
        media: pickInline(1),
      });
    }
  } else if (toolsLine) {
    sections.push({
      heading: 'How it was made',
      body: toolsLine,
      layout: 'text-left',
      media: pickInline(1),
    });
  } else if (!what) {
    // Last resort so empty projects still get a story shell.
    sections.push({
      heading: 'What it is',
      body: project.title,
      layout: 'text-left',
      media: pickInline(1),
    });
  }

  if (groupsConfig?.groups?.length && gallery.length) {
    for (const group of groupsConfig.groups) {
      const media = dedupeMediaByKey(
        gallery
          .filter((g) => {
            const key = normalizeMediaKey(g.src);
            if (usedKeys.has(key)) return false;
            const kind =
              g.type === 'video'
                ? 'video'
                : g.type === 'html'
                  ? 'html'
                  : g.type === 'model3d'
                    ? 'model3d'
                    : 'image';
            return group.match({ kind, src: g.src });
          })
          .map(mediaFromGalleryItem),
      );

      if (!media.length) continue;
      media.forEach((m) => usedKeys.add(normalizeMediaKey(m.src)));
      sections.push({
        heading: group.label,
        media,
        layout: media.length === 1 ? 'full-media' : 'gallery',
      });
    }
  }

  const leftover = dedupeMediaByKey(
    gallery
      .filter((g) => !usedKeys.has(normalizeMediaKey(g.src)))
      .map(mediaFromGalleryItem),
  );

  if (leftover.length) {
    sections.push({
      heading: sections.some((s) => s.media?.length) ? 'More media' : 'Gallery',
      media: leftover,
      layout: leftover.length === 1 ? 'full-media' : 'gallery',
    });
  }

  const liveMedia: CaseSectionMedia[] = [];
  if (project.htmlPath) {
    liveMedia.push({
      src: project.htmlPath,
      kind: 'html',
      title: 'Live prototype',
      caption: 'Interactive browser build.',
    });
  }
  if (project.model3dPath && project.showModel3dInModal !== false) {
    liveMedia.push({
      src: project.model3dPath,
      kind: 'model3d',
      title: '3D model',
      caption: 'Orbit the asset in the browser.',
    });
  }
  if (liveMedia.length) {
    sections.push({
      heading: 'Try it live',
      media: liveMedia,
      layout: 'live-embed',
    });
  }

  if (project.unrealBlueprints?.length) {
    sections.push({
      heading: 'Unreal blueprints',
      body: 'Interactive blueprint embeds from the production pipeline.',
      media: project.unrealBlueprints.map((bp) => ({
        src: bp.url,
        kind: 'html' as const,
        title: bp.title,
        caption: bp.caption,
      })),
      layout: 'live-embed',
    });
  }

  return sections;
}

/** Drop media that already appears as the page hero (avoid double presentation). */
function stripHeroFromSections(
  sections: CaseSection[],
  hero: CaseSectionMedia | null,
): CaseSection[] {
  if (!hero) return sections;
  const heroKey = normalizeMediaKey(hero.src);
  return sections
    .map((section) => {
      if (!section.media?.length) return section;
      const media = section.media.filter((m) => normalizeMediaKey(m.src) !== heroKey);
      if (media.length === section.media.length) return section;
      if (!media.length && !section.body && !section.heading) return null;
      if (!media.length && section.body) {
        return { ...section, media: undefined, layout: 'text-left' as const };
      }
      if (!media.length) return null;
      return { ...section, media };
    })
    .filter((s): s is CaseSection => s != null);
}

function dedupeWithinSections(sections: CaseSection[]): CaseSection[] {
  const used = new Set<string>();
  return sections
    .map((section) => {
      if (!section.media?.length) return section;
      const media: CaseSectionMedia[] = [];
      for (const item of section.media) {
        const key = normalizeMediaKey(item.src);
        if (used.has(key)) continue;
        used.add(key);
        media.push(item);
      }
      if (!media.length && !section.body) return null;
      if (!media.length) {
        return { ...section, media: undefined, layout: 'text-left' as const };
      }
      return { ...section, media };
    })
    .filter((s): s is CaseSection => s != null);
}

export function resolveCaseSections(project: Project): CaseSection[] {
  const hero = resolveHeroMedia(project);
  const raw = project.caseSections?.length
    ? project.caseSections
    : buildFallbackCaseSections(project);
  // Dark banner case studies keep videoUrl / thumb in story sections (no duplicate hero strip).
  const keepHeroInSections = Boolean(getCaseStudyBanner(project.slug)?.keepHeroInSections);
  const sections = keepHeroInSections ? raw : stripHeroFromSections(raw, hero);
  return dedupeWithinSections(sections);
}
