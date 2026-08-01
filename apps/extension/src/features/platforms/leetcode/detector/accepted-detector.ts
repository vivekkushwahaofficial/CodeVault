export function isAcceptedSubmission(document: Document): boolean {
  const result = document.querySelector<HTMLElement>(
    '[data-e2e-locator="submission-result"]',
  );

  return result?.textContent?.trim() === "Accepted";
}