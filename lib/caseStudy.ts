import type {
  CaseSection,
  CaseSectionMedia,
  Project,
  ProjectMedia,
} from '@/lib/types';
import { getProjectMediaGroupsConfig } from '@/lib/projectMediaGroups';

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

/**
 * Build editorial sections when a project has no explicit `caseSections`.
 * Uses explanation (or description) as intro, then groups gallery media.
 */
export function buildFallbackCaseSections(project: Project): CaseSection[] {
  const sections: CaseSection[] = [];
  const story = (project.explanation?.trim() || project.description || '').trim();

  if (story) {
    sections.push({
      heading: 'The story',
      body: story,
      layout: 'text-left',
    });
  }

  const gallery = project.gallery ?? [];
  const groupsConfig = getProjectMediaGroupsConfig(project.slug);
  const usedSrcs = new Set<string>();

  if (groupsConfig?.groups?.length && gallery.length) {
    for (const group of groupsConfig.groups) {
      const media = gallery
        .filter((g) => {
          if (usedSrcs.has(g.src)) return false;
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
        .map(mediaFromGalleryItem);

      if (!media.length) continue;
      media.forEach((m) => usedSrcs.add(m.src));
      sections.push({
        heading: group.label,
        media,
        layout: media.length === 1 ? 'full-media' : 'gallery',
      });
    }
  }

  const leftover = gallery
    .filter((g) => !usedSrcs.has(g.src))
    .map(mediaFromGalleryItem);

  if (leftover.length) {
    sections.push({
      heading: sections.some((s) => s.media?.length) ? 'More media' : 'Gallery',
      media: leftover,
      layout: leftover.length === 1 ? 'full-media' : 'gallery',
    });
  }

  // Interactive embeds
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

  // Blueprints as full-media iframes (html kind via url)
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

export function resolveCaseSections(project: Project): CaseSection[] {
  if (project.caseSections?.length) return project.caseSections;
  return buildFallbackCaseSections(project);
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
