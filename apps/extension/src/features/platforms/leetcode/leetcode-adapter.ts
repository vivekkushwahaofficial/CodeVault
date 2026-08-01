import {
  isAcceptedSubmission as detectAcceptedSubmission,
} from "./detector/accepted-detector";
import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";

/**
 * Adapter for LeetCode.
 */
export class LeetCodeAdapter implements PlatformAdapter {
  /**
   * Returns true if an accepted submission is detected.
   */
  isAcceptedSubmission(): boolean {
    return detectAcceptedSubmission(document);
  }

  /**
   * Extract normalized metadata.
   * Will be implemented in the next commit.
   */
  async extractMetadata(): Promise<ProblemMetadata> {
    throw new Error("extractMetadata() not implemented.");
  }

  /**
   * Extract submitted source code.
   * Will be implemented in the next commit.
   */
  async extractSolution(): Promise<string> {
    throw new Error("extractSolution() not implemented.");
  }
}