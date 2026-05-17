/** Tool tile id in `ToolsGamesGrid` — used for deep links from CV / About. */
export const DADB_COURSE_OVERVIEW_TOOL_ID = 'dadb-course-overview';

export function toolDeepLink(toolId: string): string {
  return `?tool=${encodeURIComponent(toolId)}#tools-games`;
}
