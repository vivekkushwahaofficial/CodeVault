import { createGithubFile }
from "../src/features/github/github-client";


export default defineBackground(() => {


  browser.runtime.onMessage.addListener(
    async (message: any) => {


      if(message.type === "CREATE_GITHUB_FILE") {


        console.log(
          "Background GitHub Sync:",
          message.payload
        );


        await createGithubFile(
          message.payload
        );


      }


    }
  );


});