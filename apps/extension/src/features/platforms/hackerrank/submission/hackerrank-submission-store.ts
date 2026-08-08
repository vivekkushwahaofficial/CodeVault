export interface HackerRankSubmission {
  id: number;
  status: string;
  language: string;
  code: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string;
  solvedAt: string;

  // Clean problem content returned by HackerRank API.
  problemStatement: string;
  inputFormat: string;
  constraints: string;
  outputFormat: string;
}

let latestSubmission: HackerRankSubmission | null = null;

export function setLatestSubmission(
  submission: HackerRankSubmission,
): void {
  latestSubmission = submission;
}

export function getLatestSubmission():
  HackerRankSubmission | null {
  return latestSubmission;
}

export function clearLatestSubmission(): void {
  latestSubmission = null;
}