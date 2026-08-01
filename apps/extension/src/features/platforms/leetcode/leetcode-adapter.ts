import {
  isAcceptedSubmission as detectAcceptedSubmission,
} from "./detector/accepted-detector";
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
  }

  /**
   * Returns true if an accepted submission is detected.
   */
  isAcceptedSubmission(document: Document): boolean {
    return detectAcceptedSubmission(document);
  }

  /**
   * Extract normalized metadata.
   * Will be implemented in a future feature.
   */
  async extractMetadata(document: Document): Promise<ProblemMetadata> {
    void document;
    throw new Error("extractMetadata() not implemented.");
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