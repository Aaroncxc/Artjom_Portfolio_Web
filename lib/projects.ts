import { Project, PostsData, ProjectType } from './types';

export async function getProjects(): Promise<Project[]> {
  try {
    /** Avoid stale grids/modals during local edits — `posts.json` is source of truth. */
    const response = await fetch('/posts.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data: PostsData = await response.json();
    return data.posts;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export function filterByType(projects: Project[], type: ProjectType | 'all'): Project[] {
  if (type === 'all') return projects;
  return projects.filter(p => p.type === type);
}

export function filterByTag(projects: Project[], tag: string | 'all'): Project[] {
  if (tag === 'all') return projects;
  return projects.filter(p => p.tags.includes(tag));
}

export function getAllTags(projects: Project[]): string[] {
  const tagSet = new Set<string>();
  projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function sortByDate(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
