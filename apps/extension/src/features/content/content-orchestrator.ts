import { syncSolution } from "../github/sync/github-sync";

import { buildSolutionPackage } from "../github/sync/solution-package-builder";

import {
  generateFingerprint,
  isFingerprintSynced,
  saveFingerprint,
} from "../github/sync/sync-fingerprint-service";

import { PlatformFactory } from "../platforms/factory/platform-factory";

/**
 * Coordinates the CodeVault content workflow.
 */
export class ContentOrchestrator {

  /**
   * Starts the CodeVault content workflow.
   */
  static async start(): Promise<void> {
    console.log(
      "🚀 CodeVault: Content script started",
    );

    try {
      /*
       * Create platform adapter.
       */
      const adapter =
        PlatformFactory.create();

      /*
       * Wait until the platform page is ready.
       */
      await adapter.waitUntilReady(
        document,
      );

      /*
       * Check whether the submission
       * was accepted.
       */
      const accepted =
        adapter.isAcceptedSubmission(
          document,
        );

      console.log(
        "[CodeVault] Accepted:",
        accepted,
      );

      if (!accepted) {
        console.log(
          "[CodeVault] Submission is NOT accepted.",
        );

        return;
      }

      console.log(
        "[CodeVault] Submission IS accepted.",
      );

      /*
       * Extract metadata.
       */
      const metadata =
        await adapter.extractMetadata(
          document,
        );

      console.log(
        "[CodeVault] Metadata extracted:",
        metadata,
      );

      /*
       * Validate metadata BEFORE doing
       * any GitHub synchronization.
       *
       * This prevents invalid folders such as:
       *
       * Unknown/
       * Solution.txt
       */
      ContentOrchestrator.validateMetadata(
        metadata,
      );

      console.log(
        "[CodeVault] Metadata validated.",
      );

      /*
       * Extract source code.
       */
      const solution =
        await adapter.extractSolution(
          document,
        );

      if (!solution.trim()) {
        console.log(
          "[CodeVault] Solution extraction failed. Skipping sync.",
        );

        return;
      }

      console.log(
        "[CodeVault] Solution extracted:",
        solution.length,
        "characters",
      );

      /*
       * Generate deterministic fingerprint.
       */
      const fingerprint =
        await generateFingerprint(
          metadata.platform,
          metadata.slug,
          solution,
        );

      console.log(
        "[CodeVault] Fingerprint:",
        fingerprint,
      );

      /*
       * Check whether the solution was
       * already synchronized.
       */
      const alreadySynced =
        await isFingerprintSynced(
          fingerprint,
        );

      if (alreadySynced) {
        console.log(
          "[CodeVault] Solution already synced. Skipping GitHub commit.",
        );

        return;
      }

      /*
       * Extract problem statement.
       */
      const problemStatement =
        await adapter.extractProblemStatement(
          document,
        );

      console.log(
        "[CodeVault] Problem statement extracted.",
      );

      /*
       * Build the complete solution package.
       */
      const solutionPackage =
        buildSolutionPackage(
          metadata,
          solution,
          problemStatement,
        );

      console.log(
        "[CodeVault] Solution package built:",
        solutionPackage,
      );

      /*
       * Synchronize with GitHub.
       */
      const result =
        await syncSolution(
          solutionPackage,
        );

      console.log(
        "[CodeVault] GitHub sync result:",
        result,
      );

      /*
       * Save fingerprint only after
       * successful GitHub synchronization.
       */
      await saveFingerprint(
        fingerprint,
      );

      console.log(
        "[CodeVault] Fingerprint saved.",
      );

    } catch (error) {
      console.error(
        "[CodeVault] ContentOrchestrator failed:",
        error,
      );

      throw error;
    }
  }

  /**
   * Validate metadata before synchronization.
   *
   * The purpose is to prevent malformed GitHub
   * structures such as:
   *
   * HackerRank/
   *   Unknown/
   *     Medium/
   *       Problem/
   *         Solution.txt
   */
  private static validateMetadata(
    metadata: {
      platform?: string;
      title?: string;
      slug?: string;
      difficulty?: string;
      language?: string;
    },
  ): void {
    /*
     * Platform is mandatory.
     */
    if (!metadata.platform?.trim()) {
      throw new Error(
        "Solution metadata validation failed: platform is missing.",
      );
    }

    /*
     * Problem title is mandatory.
     */
    if (!metadata.title?.trim()) {
      throw new Error(
        "Solution metadata validation failed: title is missing.",
      );
    }

    /*
     * Problem slug is mandatory because
     * it is used for deterministic fingerprints.
     */
    if (!metadata.slug?.trim()) {
      throw new Error(
        `Solution metadata validation failed: slug is missing for "${metadata.title}".`,
      );
    }

    /*
     * Programming language is mandatory.
     *
     * Never allow an empty language to reach
     * GitHub synchronization.
     */
    if (!metadata.language?.trim()) {
      throw new Error(
        `Solution metadata validation failed: language is missing for "${metadata.title}".`,
      );
    }

    /*
     * Difficulty can be Unknown because
     * some platforms may not expose it.
     */
    if (!metadata.difficulty?.trim()) {
      metadata.difficulty =
        "Unknown";
    }

    console.log(
      "[CodeVault] Validated metadata:",
      {
        platform:
          metadata.platform,

        title:
          metadata.title,

        slug:
          metadata.slug,

        difficulty:
          metadata.difficulty,

        language:
          metadata.language,
      },
    );
  }
}