import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";
import type { ProblemStatement } from "../shared/problem-statement";

/**
 * Adapter for GeeksforGeeks.
 */
export class GfgAdapter implements PlatformAdapter {

  /**
   * Wait until the page is ready.
   */
  async waitUntilReady(
    document: Document
  ): Promise<void> {

    return;

  }

  /**
   * Returns true if an accepted submission is detected.
   */
  isAcceptedSubmission(
    document: Document
  ): boolean {

    return document.body.innerText.includes("Correct");

  }

  /**
   * Extract normalized metadata.
   */
  async extractMetadata(
    document: Document
  ): Promise<ProblemMetadata> {

    throw new Error(
      "extractMetadata() not implemented."
    );

  }

  /**
   * Extract submitted source code.
   */
  async extractSolution(
    document: Document
  ): Promise<string> {

    throw new Error(
      "extractSolution() not implemented."
    );

  }

  /**
   * Extract the complete problem statement.
   */
  async extractProblemStatement(
    document: Document
  ): Promise<ProblemStatement> {

    throw new Error(
      "extractProblemStatement() not implemented."
    );

  }

}