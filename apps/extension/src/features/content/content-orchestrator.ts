import { PlatformFactory } from "../platforms/factory/platform-factory";

/**
 * Coordinates the content script workflow.
 */
export class ContentOrchestrator {
  /**
   * Starts the CodeVault content workflow.
   */
  static async start(): Promise<void> {
    const adapter = PlatformFactory.create();

    if (!adapter.isAcceptedSubmission()) {
      return;
    }

    const metadata = await adapter.extractMetadata();
    const solution = await adapter.extractSolution();

    console.log("CodeVault detected accepted solution.");
    console.log(metadata);
    console.log(solution);
  }
}