import { ContentOrchestrator }
from "../src/features/content/content-orchestrator";


export default defineContentScript({

  matches: [
    "*://leetcode.com/*",
    "*://*.leetcode.com/*",
  ],


  async main() {

    console.log(
      "[CodeVault] Content script initialized.",
    );


    await injectScript(
      "/leetcode-main-world.js",
      {
        keepInDom: true,
      },
    );


    console.log(
      "[CodeVault] Waiting for LeetCode submission...",
    );


    const submitButton =
      document.querySelector(
        "button[data-e2e-locator='console-submit-button']"
      );


    if (!submitButton) {

      console.log(
        "[CodeVault] Submit button not found. Waiting...",
      );

      return;

    }


    submitButton.addEventListener(
      "click",
      async () => {

        console.log(
          "[CodeVault] Submit clicked. Checking result...",
        );


        setTimeout(
          async () => {

            await ContentOrchestrator.start();

          },
          2000,
        );


      },
    );


  },

});