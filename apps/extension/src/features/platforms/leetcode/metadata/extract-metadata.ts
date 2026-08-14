import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";
import { extractLeetCodeLanguage } from "./leetcode-language";
import { requestLeetCodeMetadata } from "./leetcode-metadata-bridge";

/**
 * Extracts the current problem slug from
 * the browser URL.
 */
function getCurrentProblemSlug(): string {

  const match =
    window.location.pathname.match(
      /^\/problems\/([^/]+)/,
    );

  if (!match?.[1]) {

    throw new Error(
      "LeetCode problem slug could not be determined from current URL.",
    );
  }

  return decodeURIComponent(
    match[1],
  )
    .trim()
    .toLowerCase();
}

/**
 * Builds the canonical LeetCode URL.
 */
function buildLeetCodeUrl(
  slug: string,
): string {

  const currentUrl =
    new URL(
      window.location.href,
    );

  const pathParts =
    currentUrl.pathname
      .split("/")
      .filter(Boolean);

  const problemsIndex =
    pathParts.indexOf(
      "problems",
    );

  if (
    problemsIndex !== -1 &&
    pathParts.length >
    problemsIndex + 1
  ) {

    const remainingPath =
      pathParts.slice(
        problemsIndex + 1,
      );

    const submissionIndex =
      remainingPath.indexOf(
        "submissions",
      );

    if (
      submissionIndex !== -1 &&
      remainingPath.length >
      submissionIndex + 1
    ) {

      const submissionId =
        remainingPath[
        submissionIndex + 1
        ];

      return `https://leetcode.com/problems/${slug}/submissions/${submissionId}/`;
    }
  }

  return `https://leetcode.com/problems/${slug}/`;
}

/**
 * Extracts normalized metadata from the
 * CURRENT LeetCode problem.
 *
 * The current URL is the source of truth.
 * Metadata is fetched using that exact slug.
 */
export async function extractMetadata(
  _document: Document,
): Promise<ProblemMetadata> {

  const currentSlug =
    getCurrentProblemSlug();

  console.log(
    "[CodeVault] Extracting metadata for:",
    currentSlug,
  );

  /*
   * Get metadata for the exact problem currently
   * represented by the URL.
   */
  const metadata =
    await requestLeetCodeMetadata(
      currentSlug,
    );

  /*
   * Final identity validation.
   */
  const metadataSlug =
    metadata.titleSlug
      .trim()
      .toLowerCase();

  if (
    metadataSlug !==
    currentSlug
  ) {

    throw new Error(
      `LeetCode metadata belongs to "${metadataSlug}", but current problem is "${currentSlug}".`,
    );
  }

  const title =
    metadata.title.trim();

  const difficulty =
    metadata.difficulty
      .trim()
      .toLowerCase();

  if (!title) {

    throw new Error(
      `LeetCode problem title not found for "${currentSlug}".`,
    );
  }

  if (!difficulty) {

    throw new Error(
      `LeetCode difficulty not found for "${title}".`,
    );
  }

  /*
   * Language still comes from the current editor UI.
   */
  const language =
    extractLeetCodeLanguage(
      _document,
    );

  console.log(
    "[CodeVault] LeetCode language:",
    language || "NOT FOUND",
  );

  if (!language) {

    throw new Error(
      `LeetCode programming language could not be detected for "${title}".`,
    );
  }

  const url =
    buildLeetCodeUrl(
      currentSlug,
    );

  console.log(
    "[CodeVault] LeetCode URL:",
    url,
  );

  return {

    platform:
      PlatformType.LEETCODE,

    title,

    slug:
      currentSlug,

    difficulty,

    language,

    url,

    solvedAt:
      new Date(),
  };
}