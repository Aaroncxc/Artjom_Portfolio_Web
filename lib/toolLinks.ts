/** Tool tile id in `ToolsGamesGrid` — used for deep links from CV / About. */
export const DADB_COURSE_OVERVIEW_TOOL_ID = 'dadb-course-overview';

/** Public Skyhaven marketing site (same project as the desktop game — not a separate portfolio entry). */
export const SKYHAVEN_SITE_URL = 'https://coincraft-skyhaven.vercel.app/en/';

export const SKYHAVEN_RELEASES_URL = 'https://github.com/Aaroncxc/Coincraft_Skyhaven/releases';

/** Live URL of the Course Overview Tool. */
export const DADB_COURSE_OVERVIEW_TOOL_URL = 'https://v0-image-analysis-taupe-beta.vercel.app';

/** Case-study route for the Course Overview Tool. */
export const DADB_COURSE_OVERVIEW_CASE_PATH = '/project/course-overview';

/** @deprecated Prefer case study path; kept for legacy `?tool=` redirects. */
export function toolDeepLink(toolId: string): string {
  if (toolId === DADB_COURSE_OVERVIEW_TOOL_ID) return DADB_COURSE_OVERVIEW_CASE_PATH;
  return `/project/${toolId}`;
}
