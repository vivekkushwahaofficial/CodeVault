import { getGithubSettings } from "../github-auth/github-storage";

export interface CreateGithubRepositoryRequest {

  name: string;

  description?: string;

  private: boolean;

}

export interface GithubRepository {

  id: number;

  name: string;

  full_name: string;

  default_branch: string;

  private: boolean;

  html_url: string;

  owner: {

    login: string;

  };

}

export async function createGithubRepository(
  request: CreateGithubRepositoryRequest
): Promise<GithubRepository> {

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

        method: "POST",

        headers: {

          Authorization: `Bearer ${settings.token}`,

          Accept: "application/vnd.github+json",

          "Content-Type": "application/json",

        },

        body: JSON.stringify(request),

      }
    );

  if (!response.ok) {

    const error =
      await response.text();

    throw new Error(
      `Failed to create repository: ${error}`
    );

  }

  const repository =
    await response.json();

  return repository;

}