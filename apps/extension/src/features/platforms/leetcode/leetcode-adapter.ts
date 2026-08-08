import {
  isAcceptedSubmission as detectAcceptedSubmission,
} from "./detector/accepted-detector";

import { extractMetadata } from "./metadata/extract-metadata";
import { extractSolution } from "./solution/extract-solution";
import { extractProblemStatement } from "./problem/extract-problem-statement";

import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";
import type { ProblemStatement } from "../shared/problem-statement";

import { waitForElement } from "../shared/wait/wait-for-element";

/**
 * Adapter for LeetCode.
 */
export class LeetCodeAdapter implements PlatformAdapter {
  async waitUntilReady(
    document: Document,
  ): Promise<void> {
    console.log("Waiting for submission result...");

    await waitForElement(
      document,
      '[data-e2e-locator="submission-result"]',
    );

    console.log("Submission result found");

    await waitForElement(
      document,
      "a[href^='/problems/']",
    );

    console.log("Problem title found");
  }

  isAcceptedSubmission(
    document: Document,
  ): boolean {
    return detectAcceptedSubmission(document);
  }

  async extractMetadata(
    document: Document,
  ): Promise<ProblemMetadata> {
    return extractMetadata(document);
  }

  async extractSolution(
    document: Document,
  ): Promise<string> {
    return extractSolution(document);
  }

  async extractProblemStatement(
    document: Document,
  ): Promise<ProblemStatement> {
    return extractProblemStatement(document);
  }
}
