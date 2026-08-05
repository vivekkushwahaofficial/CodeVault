import { exchangeGithubCode } from "../api/github-token";
import { saveGithubSettings } from "./github-storage";

const GITHUB_CLIENT_ID =
  "Ov23liPu0u6Ux2Q6GgRS";

export async function authenticateGithub() {

  console.log("Starting GitHub OAuth...");

  try {

    const redirectUri =
      browser.identity.getRedirectURL();

    const githubUrl =
      new URL(
        "https://github.com/login/oauth/authorize"
      );

    githubUrl.searchParams.set(
      "client_id",
      GITHUB_CLIENT_ID
    );

    githubUrl.searchParams.set(
      "redirect_uri",
      redirectUri
    );

    githubUrl.searchParams.set(
      "scope",
      "repo user"
    );

    const responseUrl =
      await browser.identity.launchWebAuthFlow({

        url: githubUrl.toString(),

        interactive: true,

      });

    if (!responseUrl) {

      throw new Error(
        "GitHub did not return a redirect URL."
      );

    }

    const code =
      new URL(responseUrl)
        .searchParams
        .get("code");

    if (!code) {

      throw new Error(
        "Authorization code not found."
      );

    }

    const accessToken =
      await exchangeGithubCode(code);

    await saveGithubSettings({

      owner: "",

      repo: "",

      branch: "main",

      token: accessToken,

    });

    return accessToken;

  } catch (error) {

    console.error(
      "GitHub OAuth failed:",
      error
    );

    throw error;

  }

}