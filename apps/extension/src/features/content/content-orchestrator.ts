import { syncSolution } 
from "../github/sync/github-sync";

import { buildSolutionPackage } 
from "../github/sync/solution-package-builder";

import {
  generateFingerprint,
  isFingerprintSynced,
  saveFingerprint,
} from "../github/sync/sync-fingerprint-service";

import { PlatformFactory } 
from "../platforms/factory/platform-factory";


/**
 * Coordinates the content script workflow.
 */
export class ContentOrchestrator {


  /**
   * Starts the CodeVault content workflow.
   */
  static async start(): Promise<void> {


    console.log(
      "🚀 CodeVault: Content script started",
    );



    const adapter =
      PlatformFactory.create();



    await adapter.waitUntilReady(
      document,
    );



    const accepted =
      adapter.isAcceptedSubmission(
        document,
      );



    console.log(
      "Accepted?",
      accepted,
    );



    if (!accepted) {

      console.log(
        "Submission is NOT accepted",
      );

      return;

    }



    console.log(
      "Submission IS accepted",
    );




    const metadata =
      await adapter.extractMetadata(
        document,
      );


    console.log(
      "✅ Metadata extracted",
    );





    const solution =
      await adapter.extractSolution(
        document,
      );



    if (!solution.trim()) {

      console.log(
        "❌ Solution extraction failed. Skipping sync.",
      );

      return;

    }



    console.log(
      "✅ Solution extracted",
    );





    const fingerprint =
      await generateFingerprint(

        metadata.platform,

        metadata.slug,

        solution,

      );



    console.log(
      "🔐 Fingerprint:",
      fingerprint,
    );





    const alreadySynced =
      await isFingerprintSynced(
        fingerprint,
      );



    if (alreadySynced) {


      console.log(
        "⏭️ Solution already synced. Skipping GitHub commit.",
      );


      return;

    }





    const problemStatement =
      await adapter.extractProblemStatement(
        document,
      );



    console.log(
      "✅ Problem statement extracted",
    );







    const solutionPackage =
      buildSolutionPackage(

        metadata,

        solution,

        problemStatement,

      );




    console.log(
      "📦 Solution Package",
      solutionPackage,
    );







    const result =
      await syncSolution(
        solutionPackage,
      );



    console.log(
      "✅ Sync Result",
      result,
    );






    await saveFingerprint(
      fingerprint,
    );



    console.log(
      "💾 Fingerprint saved",
    );


  }


}