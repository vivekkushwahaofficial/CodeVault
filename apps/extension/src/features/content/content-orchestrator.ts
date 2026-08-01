import { PlatformFactory } from "../platforms/factory/platform-factory";

/**
 * Coordinates the content script workflow.
 */
export class ContentOrchestrator {
  /**
   * Starts the CodeVault content workflow.
   */
  static async start(): Promise<void> {
    console.log("🚀 CodeVault: Content script started");

    const adapter = PlatformFactory.create();

    await adapter.waitUntilReady(document);
    console.log(
      "Accepted?",
      adapter.isAcceptedSubmission(document),
    );

    const accepted = adapter.isAcceptedSubmission(document);

    console.log("Accepted?", accepted);

    if (!accepted) {
      console.log("Submission is NOT accepted");
      return;
    }

    console.log("Submission IS accepted");

    console.log("Before metadata extraction");

    const metadata = await adapter.extractMetadata(document);

    console.log("After metadata extraction");
    console.log("Before solution extraction");

    const solution = await adapter.extractSolution(document);

    console.log("After solution extraction");
    console.log(solution);
    // Temporary logs for testing
    console.log("Extracted metadata:", metadata);
    console.log("Extracted solution:", solution);

    console.log("CodeVault detected accepted solution.");
  }
}