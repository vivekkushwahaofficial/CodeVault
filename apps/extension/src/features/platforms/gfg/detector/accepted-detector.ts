/**
 * Detects whether the latest GFG submission was accepted.
 *
 * GFG displays "Problem Solved Successfully" after
 * a successful submission.
 */
export function isAcceptedSubmission(document: Document): boolean {
  const bodyText = document.body.innerText;

  return bodyText.includes("Problem Solved Successfully");
}