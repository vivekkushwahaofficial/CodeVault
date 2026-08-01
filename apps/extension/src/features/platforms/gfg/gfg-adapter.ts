import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";

/**
 * Adapter for GeeksforGeeks.
 */
export class GfgAdapter implements PlatformAdapter {
  /**
   * Returns true if an accepted submission is detected.
   */
  isAcceptedSubmission(): boolean {
    return document.body.innerText.includes("Correct");
  }

  /**
   * Extract normalized metadata.
   */
  async extractMetadata(): Promise<ProblemMetadata> {
    throw new Error("extractMetadata() not implemented.");
  }

  /**
   * Extract submitted source code.
   */
  async extractSolution(): Promise<string> {
    throw new Error("extractSolution() not implemented.");
  }
}