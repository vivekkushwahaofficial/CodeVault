import { ContentOrchestrator } from "../src/features/content/content-orchestrator";

export default defineContentScript({
  matches: [
    "*://leetcode.com/*",
    "*://*.leetcode.com/*",
    "*://geeksforgeeks.org/*",
    "*://*.geeksforgeeks.org/*",
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
  },
});

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
      const text = button.textContent?.trim();

      return text === "Submit" && !button.disabled;
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
    const bodyText = document.body.innerText;

    if (bodyText.includes("Problem Solved Successfully")) {
      return true;
    }

    await sleep(interval);
  }

  return false;
}

// --------------------------------------------------
// Utility
// --------------------------------------------------

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}