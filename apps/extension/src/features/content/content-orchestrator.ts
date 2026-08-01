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

    await adapter.waitUntilReady(document);

    if (!adapter.isAcceptedSubmission(document)) {
      return;
    }

    const metadata = await adapter.extractMetadata(document);
    const solution = await adapter.extractSolution(document);

    console.log("CodeVault detected accepted solution.");
    console.log(metadata);
    console.log(solution);
  }
}