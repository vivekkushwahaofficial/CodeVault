/**
 * Detects whether the latest HackerRank submission was accepted.
 *
 * HackerRank displays a successful submission as:
 * <p class="status compile-success">Congratulations!</p>
 */
export function isAcceptedSubmission(
  document: Document,
): boolean {
  const resultElement = document.querySelector(
    "p.status.compile-success",
  );

  const result = resultElement?.textContent?.trim();

  return result === "Congratulations!";
}