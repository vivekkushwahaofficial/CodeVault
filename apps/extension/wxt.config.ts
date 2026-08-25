import { defineConfig } from "wxt";

export default defineConfig({
  modules: [
    "@wxt-dev/module-react",
  ],

  manifest: {
    name: "CodeVault",

    short_name: "CodeVault",

    version: "1.4.0",

    description:
      "Automatically extract and sync coding solutions to GitHub.",

    // Stable extension ID
    action: {
      default_title: "CodeVault",
    },

    permissions: [
      "identity",
      "storage",
    ],

    host_permissions: [
      "https://github.com/*",
      "https://api.github.com/*",
      "https://codevault-backend-me91.onrender.com/*",
    ],

    icons: {
      "16": "/icons/icon16.png",
      "32": "/icons/icon32.png",
      "48": "/icons/icon48.png",
      "96": "/icons/icon96.png",
      "128": "/icons/icon128.png",
    },

    web_accessible_resources: [
      {
        resources: [
          "leetcode-main-world.js",
        ],
        matches: [
          "*://leetcode.com/*",
          "*://*.leetcode.com/*",
        ],
      },
      {
        resources: [
          "gfg-page-bridge.js",
        ],
        matches: [
          "*://geeksforgeeks.org/*",
          "*://*.geeksforgeeks.org/*",
        ],
      },
      {
        resources: [
          "hackerrank-main-world.js",
        ],
        matches: [
          "*://hackerrank.com/*",
          "*://*.hackerrank.com/*",
        ],
      },
    ],
  },
});