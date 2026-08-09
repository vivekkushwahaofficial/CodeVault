import { ContentOrchestrator } from "../src/features/content/content-orchestrator";
import { setLatestSubmission } from "../src/features/platforms/hackerrank/submission/hackerrank-submission-store";

export default defineContentScript({
  matches: [
    "*://leetcode.com/*",
    "*://*.leetcode.com/*",
    "*://geeksforgeeks.org/*",
    "*://*.geeksforgeeks.org/*",
    "*://hackerrank.com/*",
    "*://*.hackerrank.com/*",
  ],

  async main() {
    console.log("[CodeVault] Content script initialized.");

    const hostname = window.location.hostname;

    // --------------------------------------------------
    // LeetCode
    // --------------------------------------------------

    if (hostname.includes("leetcode.com")) {
      await injectScript("/leetcode-main-world.js", {
        keepInDom: true,
      });

      console.log(
        "[CodeVault] Waiting for LeetCode submission...",
      );

      const submitButton =
        await waitForLeetCodeSubmitButton();

      if (!submitButton) {
        console.log(
          "[CodeVault] LeetCode submit button not found.",
        );

        return;
      }

      submitButton.addEventListener("click", async () => {
        console.log(
          "[CodeVault] LeetCode Submit clicked. Checking result...",
        );

        setTimeout(async () => {
          await ContentOrchestrator.start();
        }, 2000);
      });

      return;
    }

    // --------------------------------------------------
    // GeeksforGeeks
    // --------------------------------------------------

    if (hostname.includes("geeksforgeeks.org")) {
      console.log(
        "[CodeVault] GFG content script initialized.",
      );

      // Inject the GFG page-world bridge.
      await injectScript("/gfg-page-bridge.js", {
        keepInDom: true,
      });

      console.log(
        "[CodeVault] GFG page bridge injected.",
      );

      const submitButton =
        await waitForGfgSubmitButton();

      if (!submitButton) {
        console.log(
          "[CodeVault] GFG submit button not found.",
        );

        return;
      }

      console.log(
        "[CodeVault] GFG submit button found.",
      );

      submitButton.addEventListener("click", async () => {
        console.log(
          "[CodeVault] GFG Submit clicked.",
        );

        const accepted =
          await waitForGfgAcceptedResult();

        if (!accepted) {
          console.log(
            "[CodeVault] GFG submission was not accepted.",
          );

          return;
        }

        console.log(
          "[CodeVault] GFG submission accepted.",
        );

        await ContentOrchestrator.start();
      });

      return;
    }

    // --------------------------------------------------
    // HackerRank
    // --------------------------------------------------

    if (
      hostname === "hackerrank.com" ||
      hostname.endsWith(".hackerrank.com")
    ) {
      console.log(
        "[CodeVault] HackerRank content script initialized.",
      );

      /*
       * Listen before injecting the MAINWORLD bridge.
       *
       * This guarantees that CodeVault is ready to receive
       * the accepted-submission event when HackerRank finishes
       * processing the submission.
       */
      window.addEventListener(
        "message",
        handleHackerRankSubmissionMessage,
      );

      await injectScript("/hackerrank-main-world.js", {
        keepInDom: true,
      });

      console.log(
        "[CodeVault] HackerRank MAINWORLD bridge injected.",
      );

      return;
    }
  },
});

// --------------------------------------------------
// HackerRank Submission Message
// --------------------------------------------------

function handleHackerRankSubmissionMessage(
  event: MessageEvent,
): void {
  /*
   * Only accept messages coming from the current page.
   */
  if (event.source !== window) {
    return;
  }

  const data = event.data;

  if (
    !data ||
    data.type !==
      "CODEVAULT_HACKERRANK_SUBMISSION_ACCEPTED"
  ) {
    return;
  }

  const submission =
    data.submission;

  if (!submission) {
    console.error(
      "[CodeVault] HackerRank accepted submission payload missing.",
    );

    return;
  }

  /*
   * Store the accepted HackerRank submission.
   *
   * HackerRankAdapter reads this same store when
   * ContentOrchestrator starts.
   */
  setLatestSubmission({
    id: Number(submission.id),
    status: String(submission.status ?? ""),
    language: String(submission.language ?? ""),
    code: String(submission.code ?? ""),
    title: String(submission.title ?? ""),
    slug: String(submission.slug ?? ""),
    difficulty: String(
      submission.difficulty ?? "Unknown",
    ),
    url: String(
      submission.url ?? window.location.href,
    ),
    solvedAt: String(
      submission.solvedAt ??
        new Date().toISOString(),
    ),

    problemStatement: String(
      submission.problemStatement ?? "",
    ),

    inputFormat: String(
      submission.inputFormat ?? "",
    ),

    constraints: String(
      submission.constraints ?? "",
    ),

    outputFormat: String(
      submission.outputFormat ?? "",
    ),
  });

  console.log(
    "[CodeVault] HackerRank accepted submission received.",
  );

  console.log(
    "[CodeVault] HackerRank submission:",
    {
      title: submission.title,
      language: submission.language,
      difficulty: submission.difficulty,
      slug: submission.slug,
    },
  );

  /*
   * Give the submission store a moment to update before
   * starting the common synchronization pipeline.
   */
  setTimeout(() => {
    void ContentOrchestrator.start();
  }, 100);
}

// --------------------------------------------------
// LeetCode Submit Button
// --------------------------------------------------

async function waitForLeetCodeSubmitButton(): Promise<HTMLButtonElement | null> {
  const timeout = 30_000;
  const interval = 500;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const button = document.querySelector(
      "button[data-e2e-locator='console-submit-button']",
    );

    if (button instanceof HTMLButtonElement) {
      return button;
    }

    await sleep(interval);
  }

  return null;
}

// --------------------------------------------------
// GFG Submit Button
// --------------------------------------------------

async function waitForGfgSubmitButton(): Promise<HTMLButtonElement | null> {
  const timeout = 30_000;
  const interval = 500;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const buttons = Array.from(
      document.querySelectorAll("button"),
    );

    const submitButton = buttons.find((button) => {
      const text =
        button.textContent?.trim();

      return (
        text === "Submit" &&
        !button.disabled
      );
    });

    if (submitButton) {
      return submitButton;
    }

    await sleep(interval);
  }

  return null;
}

// --------------------------------------------------
// GFG Accepted Result
// --------------------------------------------------

async function waitForGfgAcceptedResult(): Promise<boolean> {
  const timeout = 30_000;
  const interval = 500;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const bodyText =
      document.body.innerText;

    if (
      bodyText.includes(
        "Problem Solved Successfully",
      )
    ) {
      return true;
    }

    await sleep(interval);
  }

  return false;
}

// --------------------------------------------------
// Utility
// --------------------------------------------------

function sleep(
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      milliseconds,
    );
  });
}