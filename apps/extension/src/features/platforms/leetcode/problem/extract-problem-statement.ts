import { extractMetadata } from "../metadata/extract-metadata";

import type { ProblemStatement } from "../../shared/problem-statement";

/**
 * Extracts the problem statement from the current LeetCode page.
 */
export function extractProblemStatement(
  document: Document,
): ProblemStatement {

  const metadata =
    extractMetadata(document);

  const description =
    document.querySelector<HTMLElement>(
      '[data-track-load="description_content"]',
    );

  if (!description) {

    throw new Error(
      "LeetCode problem description not found.",
    );

  }

  return {

    title: metadata.title,

    difficulty: metadata.difficulty,

    url: metadata.url,

    html: description.innerHTML,

  };

}