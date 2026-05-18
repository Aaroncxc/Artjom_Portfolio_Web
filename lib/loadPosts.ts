import type { PostsData, Project } from '@/lib/types';

let cache: Promise<Project[]> | null = null;

export function loadPosts(): Promise<Project[]> {
  if (cache) return cache;
  cache = fetch('/posts.json', { cache: 'no-store' })
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<PostsData | Project[]>;
    })
    .then((data) => (Array.isArray(data) ? data : data.posts ?? []))
    .catch(() => [] as Project[]);
  return cache;
}

export async function findPostBySlug(slug: string): Promise<Project | undefined> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug);
}
