import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";
import type { ProblemStatement } from "../shared/problem-statement";

import { isAcceptedSubmission } from "./detector/accepted-detector";
import { extractMetadata } from "./metadata/extract-metadata";
import { extractSolution } from "./solution/extract-solution";
import { extractProblemStatement } from "./statement/extract-problem-statement";

export class GfgAdapter implements PlatformAdapter {

  async waitUntilReady(
    document: Document,
  ): Promise<void> {
    return;
  }

  isAcceptedSubmission(
    document: Document,
  ): boolean {
    return isAcceptedSubmission(document);
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