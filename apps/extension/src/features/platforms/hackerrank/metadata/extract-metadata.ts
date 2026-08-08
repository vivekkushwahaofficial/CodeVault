import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";
import { getLatestSubmission } from "../submission/hackerrank-submission-store";

/**
 * Extract normalized metadata from a HackerRank problem page.
 */
export function extractMetadata(
  document: Document,
): ProblemMetadata {
  // Find the HackerRank problem title.
  const titleElement =
    document.querySelector("h1.page-label");

  // Read the title text.
  const title =
    titleElement?.textContent?.trim();

  // Stop if the title cannot be found.
  if (!title) {
    throw new Error(
      "HackerRank problem title not found",
    );
  }

  // Get the current HackerRank problem URL.
  const url =
    window.location.href;

  // Split the URL path into individual parts.
  const pathParts =
    window.location.pathname
      .split("/")
      .filter(Boolean);

  // Find the "challenges" part of the URL.
  const challengeIndex =
    pathParts.indexOf("challenges");

  // Default slug.
  let slug = "unknown";

  // Extract the challenge slug safely.
  if (challengeIndex !== -1) {
    const possibleSlug =
      pathParts[challengeIndex + 1];

    if (possibleSlug) {
      slug = possibleSlug;
    }
  }

  // Get the latest accepted HackerRank submission.
  const submission =
    getLatestSubmission();

  // Use the difficulty received from HackerRank's API.
  const difficulty =
    submission?.difficulty?.trim() ||
    "Unknown";

  // Extract the selected programming language.
  const language =
    submission?.language?.trim() ||
    extractLanguage(document);

  // Return normalized metadata.
  return {
    platform: PlatformType.HACKERRANK,
    title,
    slug,
    difficulty,
    language,
    url,
    solvedAt:
      submission?.solvedAt
        ? new Date(submission.solvedAt)
        : new Date(),
  };
}

/**
 * Extract the programming language from the
 * HackerRank domain breadcrumb.
 */
function extractLanguage(
  document: Document,
): string {
  const languageElement =
    document.querySelector(
      'a[href^="/domains/"] .breadcrumb-item-text',
    );

  const language =
    languageElement?.textContent?.trim();

  return language ?? "";
}