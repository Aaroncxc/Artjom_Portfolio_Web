import type { Project } from './types';

/** Substrings (lowercase match) identifying Artjom’s work in listings. */
const OWNER_SUBSTRINGS = ['artjom', 'aaroncxc'] as const;

/** Collapses whitespace so e.g. "Aaron CxC" matches "aaroncxc". */
function normalizeForOwnerMatch(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '');
}

function includesOwnerSubstring(value: string): boolean {
  const compact = normalizeForOwnerMatch(value);
  return OWNER_SUBSTRINGS.some((sub) => compact.includes(sub.toLowerCase()));
}

/**
 * Keeps posts that mention Artjom or the AaronCxC handle in fields that normally
 * carry attribution or identity (slug, author, tags, etc.).
 */
export function projectMatchesPortfolioOwner(project: Project): boolean {
  const blob = [
    project.author ?? '',
    project.slug ?? '',
    project.title ?? '',
    project.description ?? '',
    ...(project.tags ?? []),
  ].join('\n');
  return includesOwnerSubstring(blob);
}

export interface ToolLikeForOwnerFilter {
  id?: string;
  author?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export function toolMatchesPortfolioOwner(item: ToolLikeForOwnerFilter): boolean {
  const blob = [
    item.author ?? '',
    item.title ?? '',
    item.description ?? '',
    item.id ?? '',
    ...(item.tags ?? []),
  ].join('\n');
  return includesOwnerSubstring(blob);
}
