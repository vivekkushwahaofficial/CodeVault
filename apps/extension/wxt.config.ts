import { defineConfig } from "wxt";

export default defineConfig({

  modules: [
    "@wxt-dev/module-react",
  ],

  manifest: {

    name: "CodeVault",

    short_name: "CodeVault",

    description:
      "Automatically extract and sync coding solutions to GitHub.",

    // ✅ Correct public key generated from chrome-mv3-dev.pem
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAypcjscEcKDcypZLj0Z79vMDQU38YLEqGOrZNMfI9RsdpladRCUvLEdCjSGosDyNCOtn1VT1bedAZ/Ficjaf0566H2Rdm5olPdx4wdoflSBwm0amjDKssueoQEjOlKAbW/fvFJutZHI+5Q9QODhTQHtuZDV+FT+mgAdVib2k+Qmu8nvwXVZ+fl+QcSldG7RnNIXAd49gwVZur03LojXgWImwDO5lQ0gntosuG/25UfGFn7U3p2mWolfOWSPuDeyfjbPA5Rl5w5Jb4fpBRzwmQHbZWOijaIdxccWTRs/mAGwkkFBTmxTL5fghY1dwiKUgg+dOPYQs0MQNvbP3RPkzqGQIDAQAB",

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
    ],

  },

});