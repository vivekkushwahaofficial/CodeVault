import type { PlatformAdapter } from "../shared/platform-adapter";
import type { ProblemMetadata } from "../shared/problem-metadata";
import type { ProblemStatement } from "../shared/problem-statement";

import {
  getLatestSubmission,
} from "./submission/hackerrank-submission-store";

export class HackerRankAdapter
  implements PlatformAdapter {
  async waitUntilReady(
    document: Document,
  ): Promise<void> {
    void document;

    const timeout = 30_000;
    const interval = 250;
    const startTime = Date.now();

    while (
      Date.now() - startTime < timeout
    ) {
      if (getLatestSubmission()) {
        return;
      }

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            interval,
          ),
      );
    }

    throw new Error(
      "HackerRank submission data not available",
    );
  }

  isAcceptedSubmission(
    document: Document,
  ): boolean {
    void document;

    return (
      getLatestSubmission()
        ?.status === "Accepted"
    );
  }

  async extractMetadata(
    document: Document,
  ): Promise<ProblemMetadata> {
    void document;

    const submission =
      getLatestSubmission();

    if (!submission) {
      throw new Error(
        "HackerRank submission data not available",
      );
    }

    return {
      platform:
        "HackerRank" as ProblemMetadata["platform"],

      title:
        submission.title,

      slug:
        submission.slug,

      difficulty:
        submission.difficulty,

      language:
        submission.language,

      url:
        submission.url,

      solvedAt:
        new Date(
          submission.solvedAt,
        ),
    };
  }

  async extractSolution(
    document: Document,
  ): Promise<string> {
    void document;

    const submission =
      getLatestSubmission();

    if (!submission) {
      throw new Error(
        "HackerRank submission data not available",
      );
    }

    return submission.code;
  }

  async extractProblemStatement(
    document: Document,
  ): Promise<ProblemStatement> {
    const submission =
      getLatestSubmission();

    if (!submission) {
      throw new Error(
        "HackerRank submission data not available",
      );
    }

    const statement =
      document.querySelector(
        ".challenge-body-html",
      );

    if (!statement) {
      throw new Error(
        "HackerRank problem statement not found",
      );
    }

    // Clone the problem statement so we never
    // modify the actual HackerRank page.
    const cleanedStatement =
      statement.cloneNode(
        true,
      ) as HTMLElement;

    // Remove HackerRank internal elements
    // that should never appear in README.md.
    cleanedStatement
      .querySelectorAll(
        "style, script, noscript",
      )
      .forEach(
        (element) =>
          element.remove(),
      );

    // Remove HackerRank UI elements that are
    // not part of the actual problem statement.
    cleanedStatement
      .querySelectorAll(
        "button, input, textarea, select",
      )
      .forEach(
        (element) =>
          element.remove(),
      );

    // Remove empty elements created by
    // HackerRank's internal rendering.
    cleanedStatement
      .querySelectorAll(
        "[aria-hidden='true']",
      )
      .forEach(
        (element) =>
          element.remove(),
      );

    return {
      title:
        submission.title,

      difficulty:
        submission.difficulty,

      url:
        submission.url,

      html:
        cleanedStatement.innerHTML.trim(),
    };
  }
}