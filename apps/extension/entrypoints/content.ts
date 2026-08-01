import { ContentOrchestrator } from "../src/features/content/content-orchestrator";

export default defineContentScript({
  matches: [
    "*://*.leetcode.com/*",
    "*://*.geeksforgeeks.org/*",
  ],

  async main() {
    await ContentOrchestrator.start();
  },
});