import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";

/**
 * Extract normalized metadata from a GeeksforGeeks problem page.
 */
export function extractMetadata(
  document: Document,
): ProblemMetadata {
  // Find the GFG problem title.
  const titleElement =
    document.querySelector("h3.g-m-0");

  // Read the title text.
  const title =
    titleElement?.textContent?.trim();

  // Stop if the title cannot be found.
  if (!title) {
    throw new Error(
      "GFG problem title not found",
    );
  }

  // Get the current GFG problem URL.
  const url =
    window.location.href;

  // Split the URL path into individual parts.
  const pathParts =
    window.location.pathname
      .split("/")
      .filter(Boolean);

  // Find the "problems" part of the URL.
  const problemIndex =
    pathParts.indexOf("problems");

  // Default slug.
  let slug = "unknown";

  // Extract the slug safely.
  if (problemIndex !== -1) {
    const possibleSlug =
      pathParts[problemIndex + 1];

    if (possibleSlug) {
      slug = possibleSlug;
    }
  }

  // Extract the difficulty.
  const difficulty =
    extractDifficulty(document);

  // Extract the selected programming language.
  const language =
    extractLanguage(document);

  // Return normalized metadata.
  return {
    platform: PlatformType.GFG,
    title,
    slug,
    difficulty,
    language,
    url,
    solvedAt: new Date(),
  };
}

/**
 * Extract the difficulty from the visible GFG page text.
 *
 * Expected examples:
 * Difficulty: Basic
 * Difficulty: Easy
 * Difficulty: Medium
 * Difficulty: Hard
 */
function extractDifficulty(
  document: Document,
): string {
  // Read the visible text from the complete page.
  const pageText =
    document.body?.innerText ?? "";

  // Look for "Difficulty:" followed by a known difficulty.
  const match =
    pageText.match(
      /Difficulty\s*:\s*(Basic|Easy|Medium|Hard)/i,
    );

  // Return the detected difficulty.
  if (match?.[1]) {
    return match[1];
  }

  // Difficulty was not detected.
  return "Unknown";
}

/**
 * Extract the selected programming language.
 */
function extractLanguage(
  document: Document,
): string {
  // Find all select elements.
  const selects =
    Array.from(
      document.querySelectorAll("select"),
    );

  // Check each select element.
  for (const select of selects) {
    // Get the currently selected option.
    const selectedOption =
      select.selectedOptions[0]
        ?.textContent
        ?.trim();

    // Return it if available.
    if (selectedOption) {
      return selectedOption;
    }
  }

  // Find possible language buttons.
  const languageCandidates =
    Array.from(
      document.querySelectorAll(
        "button, [role='button']",
      ),
    );

  // Check each candidate.
  for (
    const element of languageCandidates
  ) {
    // Read button text.
    const text =
      element.textContent?.trim();

    // Check for common programming languages.
    if (
      text &&
      /^(Java|Python|C\+\+|C|JavaScript|Go|Rust|C#)$/i.test(
        text,
      )
    ) {
      return text;
    }
  }

  // Language was not detected.
  return "";
}