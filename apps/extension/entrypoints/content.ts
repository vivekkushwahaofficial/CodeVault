import { cleanSolution }
  from "../src/features/platforms/leetcode/solution/clean-solution";

import { extractLeetCodeMetadata }
  from "../src/features/platforms/leetcode/metadata/leetcode-metadata";

import { extractLeetCodeLanguage }
  from "../src/features/platforms/leetcode/metadata/leetcode-language";

import { normalizeLanguage }
  from "../src/features/platforms/leetcode/metadata/normalize-language";

import { getFileExtension }
  from "../src/features/platforms/leetcode/metadata/file-extension";

import { githubConfig }
  from "../src/features/github/github-config";

export default defineContentScript({

  matches: [
    "*://leetcode.com/*",
    "*://*.leetcode.com/*",
  ],


  async main() {

    console.log("CodeVault content started");


    await injectScript(
      "/leetcode-main-world.js",
      {
        keepInDom: true,
      },
    );


    window.addEventListener(
      "message",
      async (event) => {


        if (event.data?.type === "CODEVAULT_SOLUTION") {


          const rawSolution =
            event.data.solution;


          const cleanedSolution =
            cleanSolution(rawSolution);


          const metadata =
            extractLeetCodeMetadata();


          const language =
            normalizeLanguage(
              extractLeetCodeLanguage(),
            );


          const extension =
            getFileExtension(language);



          const solutionData = {

            ...metadata,

            language,

            code: cleanedSolution,

            solvedAt:
              new Date().toISOString(),

          };



          console.log(
            "CodeVault Solution Object:",
            solutionData,
          );



          browser.runtime.sendMessage({

            type: "CREATE_GITHUB_FILE",

            payload: {

              owner: githubConfig.owner,

              repo: githubConfig.repo,

              path:
                `LeetCode/${metadata.difficulty}/${metadata.title.replaceAll(" ", "-")}.${extension}`,

              content: cleanedSolution,

              message:
                `feat(leetcode): Add ${metadata.title}`,

            },

          });


        }

      },
    );


  },

});