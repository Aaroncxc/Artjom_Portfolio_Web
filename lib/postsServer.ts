import { readFile } from 'fs/promises';
import path from 'path';
import type { PostsData, Project } from '@/lib/types';
import { sortProjectsForPortfolio } from '@/lib/caseStudy';

/** Server-only loader for `public/posts.json` (App Router pages / generateStaticParams). */
export async function loadPostsServer(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'public', 'posts.json');
  const raw = await readFile(filePath, 'utf8');
  const data = JSON.parse(raw) as PostsData | Project[];
  const posts = Array.isArray(data) ? data : data.posts ?? [];
  return posts;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const posts = await loadPostsServer();
  return posts.find((p) => p.slug === slug);
}

export async function getSortedProjects(): Promise<Project[]> {
  return sortProjectsForPortfolio(await loadPostsServer());
}

export async function getAdjacentProjects(
  slug: string,
): Promise<{ prev: Project | null; next: Project | null; current: Project | null }> {
  const sorted = await getSortedProjects();
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index < 0) return { prev: null, next: null, current: null };
  return {
    current: sorted[index],
    prev: sorted[(index - 1 + sorted.length) % sorted.length] ?? null,
    next: sorted[(index + 1) % sorted.length] ?? null,
  };
}
