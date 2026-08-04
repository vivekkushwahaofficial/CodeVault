import { getGithubSettings } from "../github-auth/github-storage";

export interface GithubRepository {

  id: number;

  name: string;

  full_name: string;

  private: boolean;

  default_branch: string;

  html_url: string;

  owner: {

    login: string;

  };

}

export async function getGithubRepositories()
: Promise<GithubRepository[]> {

  const settings =
    await getGithubSettings();

  if (!settings) {

    throw new Error(
      "GitHub settings not found."
    );

  }

  const response =
    await fetch(
      "https://api.github.com/user/repos",
      {

        headers: {

          Authorization: `Bearer ${settings.token}`,

          Accept: "application/vnd.github+json",

        },

      }
    );

  if (!response.ok) {

    throw new Error(
      "Failed to fetch GitHub repositories."
    );

  }

  return await response.json();

}