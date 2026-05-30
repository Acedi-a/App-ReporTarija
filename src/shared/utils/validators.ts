export const REPORT_TITLE_MIN_LENGTH = 5;
export const REPORT_TITLE_MAX_LENGTH = 100;

export function isValidReportTitle(title: string): boolean {
  const trimmed = title.trim();
  if (trimmed.length === 0) return false;
  return trimmed.length >= REPORT_TITLE_MIN_LENGTH && trimmed.length <= REPORT_TITLE_MAX_LENGTH;
}
