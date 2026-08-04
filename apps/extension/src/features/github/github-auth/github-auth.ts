import { getGithubSettings } from "./github-storage";

export async function verifyGithubConnection() {

  try {

    const settings =
      await getGithubSettings();

    if (!settings) {

      return {

        success: false,

        message: "GitHub settings not found",

      };

    }

    const response =
      await fetch(
        "https://api.github.com/user",
        {

          headers: {

            Authorization: `Bearer ${settings.token}`,

            Accept: "application/vnd.github+json",

          },

        }
      );

    if (!response.ok) {

      return {

        success: false,

        message: "Invalid GitHub token",

      };

    }

    const user =
      await response.json();

    return {

      success: true,

      username: user.login,

    };

  } catch {

    return {

      success: false,

      message: "GitHub connection failed",

    };

  }

}