import { readFile } from 'fs/promises';
import path from 'path';
import type { PostsData, Project } from '@/lib/types';
import { sortProjectsForPortfolio } from '@/lib/caseStudy';
import {
  getSortedToolProjects,
  getToolProjectBySlug,
  TOOL_PROJECTS,
} from '@/lib/toolProjects';

/** Server-only loader for `public/posts.json` (App Router pages / generateStaticParams). */
export async function loadPostsServer(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'public', 'posts.json');
  const raw = await readFile(filePath, 'utf8');
  const data = JSON.parse(raw) as PostsData | Project[];
  const posts = Array.isArray(data) ? data : data.posts ?? [];
  return posts;
}

/** Portfolio grid posts only (no tools). */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const posts = await loadPostsServer();
  return posts.find((p) => p.slug === slug) ?? getToolProjectBySlug(slug);
}

/** All case-study slugs: posts ∪ tools. */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  const posts = await loadPostsServer();
  return [...posts.map((p) => p.slug), ...TOOL_PROJECTS.map((p) => p.slug)];
}

export async function getSortedProjects(): Promise<Project[]> {
  return sortProjectsForPortfolio(await loadPostsServer());
}

/**
 * Prev/next: grid posts stay in the posts ring; tools stay in the tool ring.
 */
export async function getAdjacentProjects(
  slug: string,
): Promise<{ prev: Project | null; next: Project | null; current: Project | null }> {
  const tool = getToolProjectBySlug(slug);
  if (tool) {
    const sorted = getSortedToolProjects();
    const index = sorted.findIndex((p) => p.slug === slug);
    if (index < 0) return { prev: null, next: null, current: null };
    return {
      current: sorted[index],
      prev: sorted[(index - 1 + sorted.length) % sorted.length] ?? null,
      next: sorted[(index + 1) % sorted.length] ?? null,
    };
  }

  const sorted = await getSortedProjects();
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index < 0) return { prev: null, next: null, current: null };
  return {
    current: sorted[index],
    prev: sorted[(index - 1 + sorted.length) % sorted.length] ?? null,
    next: sorted[(index + 1) % sorted.length] ?? null,
  };
}
