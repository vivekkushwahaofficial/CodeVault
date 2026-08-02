import { exchangeGithubCode } from "../api/github-token";

const GITHUB_CLIENT_ID =
  "Ov23lixqgD0bTqArz6iL";

export async function authenticateGithub() {

  console.log("VIVEK TEST BUILD 12345");

  try {

    const redirectUri =
      browser.identity.getRedirectURL();

    alert(
      "Redirect URI:\n\n" +
      redirectUri
    );

    console.log(
      "Redirect URI:",
      redirectUri
    );

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
      "OAuth URL:",
      oauthUrl
    );

    prompt(
      "OAuth URL",
      oauthUrl
    );

    const responseUrl =
      await browser.identity.launchWebAuthFlow({

        url: oauthUrl,

        interactive: true,

      });

    console.log(
      "Response URL:",
      responseUrl
    );

    if (!responseUrl) {

      throw new Error(
        "GitHub did not return a redirect URL."
      );

    }

    const code =
      new URL(responseUrl)
        .searchParams
        .get("code");

    console.log(
      "Authorization Code:",
      code
    );

    if (!code) {

      throw new Error(
        "Authorization code not found."
      );

    }

    const accessToken =
      await exchangeGithubCode(code);

    console.log(
      "Access Token:",
      accessToken
    );

    return accessToken;

  } catch (error) {

    console.error(
      "========== FULL ERROR =========="
    );

    console.error(error);

    throw error;

  }

}