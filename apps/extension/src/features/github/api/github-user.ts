import { getGithubSettings } from "../github-auth/github-storage";

export interface GithubUser {

  login: string;

  id: number;

  name: string | null;

  email: string | null;

  avatar_url: string;

}

export async function getGithubUser()
: Promise<GithubUser> {

  const settings =
    await getGithubSettings();

  if (!settings) {

    throw new Error(
      "GitHub settings not found."
    );

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

    throw new Error(
      "Failed to fetch GitHub user."
    );

  }

  return await response.json();

}