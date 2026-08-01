import {
  isAcceptedSubmission as detectAcceptedSubmission,
} from "./detector/accepted-detector";
import { extractMetadata } from "./metadata/extract-metadata";
import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";
import { waitForElement } from "../shared/wait/wait-for-element";

/**
 * Adapter for LeetCode.
 */
export class LeetCodeAdapter implements PlatformAdapter {
  /**
   * Wait until the submission result is rendered.
   */
  async waitUntilReady(document: Document): Promise<void> {
    await waitForElement(
      document,
      '[data-e2e-locator="submission-result"]',
    );

    await waitForElement(
      document,
      "div.text-title-large a",
    );
  }

  /**
   * Returns true if an accepted submission is detected.
   */
  isAcceptedSubmission(document: Document): boolean {
    return detectAcceptedSubmission(document);
  }

  /**
   * Extract normalized metadata.
   */
  async extractMetadata(document: Document): Promise<ProblemMetadata> {
    return extractMetadata(document);
  }

  /**
   * Extract submitted source code.
   * Will be implemented in a future feature.
   */
  async extractSolution(document: Document): Promise<string> {
    void document;
    throw new Error("extractSolution() not implemented.");
  }
}