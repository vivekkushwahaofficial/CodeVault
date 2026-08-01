import type { ProblemMetadata } from "./problem-metadata";

/**
 * Every coding platform must implement this contract.
 */
export interface PlatformAdapter {
  /**
   * Returns true if the current page contains
   * a successfully accepted submission.
   */
  isAcceptedSubmission(): boolean;

  /**
   * Extract normalized metadata.
   */
  extractMetadata(): Promise<ProblemMetadata>;

  /**
   * Extract submitted source code.
   */
  extractSolution(): Promise<string>;
}