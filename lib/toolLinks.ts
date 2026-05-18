/** Tool tile id in `ToolsGamesGrid` — used for deep links from CV / About. */
export const DADB_COURSE_OVERVIEW_TOOL_ID = 'dadb-course-overview';

/** Live URL of the Course Overview Tool (matches the `url` on the same tile in `ToolsGamesGrid`). */
export const DADB_COURSE_OVERVIEW_TOOL_URL = 'https://v0-image-analysis-taupe-beta.vercel.app';

export function toolDeepLink(toolId: string): string {
  return `?tool=${encodeURIComponent(toolId)}#tools-games`;
}
