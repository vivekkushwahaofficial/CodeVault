import { exchangeGithubCode } from "../api/github-token";
import { saveGithubSettings } from "./github-storage";

const GITHUB_CLIENT_ID =
  "Ov23liPu0u6Ux2Q6GgRS";

export async function authenticateGithub() {

  console.log(
    "[CodeVault] Starting GitHub OAuth..."
  );

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

    const oauthUrl =
      githubUrl.toString();

    console.log(
      "[CodeVault] Starting web auth flow..."
    );

    let responseUrl: string | undefined;

    try {

      responseUrl =
        await browser.identity.launchWebAuthFlow({

          url: oauthUrl,

          interactive: true,

        });

    } catch (oauthError) {

console.error(
  "[CodeVault] GitHub OAuth request failed."
);

      throw oauthError;

    }

    if (!responseUrl) {

      throw new Error(
        "GitHub did not return response URL"
      );

    }

    const response =
      new URL(responseUrl);

    const code =
      response.searchParams.get("code");

    const githubError =
      response.searchParams.get("error");

    if (githubError) {

      throw new Error(
        `GitHub OAuth error: ${githubError}`
      );

    }

    if (!code) {

      throw new Error(
        "Authorization code not found"
      );

    }

    console.log(
      "[CodeVault] Sending code to backend..."
    );

    const accessToken =
      await exchangeGithubCode(code);

    console.log(
  "[CodeVault] GitHub authentication successful."
  );

    await saveGithubSettings({

      owner: "",

      repo: "",

      branch: "main",

      token: accessToken,

    });

    console.log(
      "[CodeVault] GitHub settings saved"
    );

    return accessToken;

  } catch (error) {

    console.error(
      "[CodeVault] GitHub OAuth failed:",
    );

    alert(
      error instanceof Error
        ? error.message
        : String(error)
    );

    throw error;

  }

}