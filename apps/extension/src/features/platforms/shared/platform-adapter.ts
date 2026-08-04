import type { ProblemMetadata } from "./problem-metadata";
import type { ProblemStatement } from "./problem-statement";

/**
 * Every coding platform must implement this contract.
 */
export interface PlatformAdapter {

  /**
   * Wait until the platform page is ready.
   */
  waitUntilReady(document: Document): Promise<void>;

  /**
   * Returns true if the current page contains
   * a successfully accepted submission.
   */
  isAcceptedSubmission(document: Document): boolean;

  /**
   * Extract normalized metadata.
   */
  extractMetadata(
    document: Document
  ): Promise<ProblemMetadata>;

  /**
   * Extract the submitted source code.
   */
  extractSolution(
    document: Document
  ): Promise<string>;

  /**
   * Extract the complete problem statement.
   */
  extractProblemStatement(
    document: Document
  ): Promise<ProblemStatement>;

}