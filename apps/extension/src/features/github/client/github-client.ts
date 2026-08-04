import { Octokit } from "@octokit/rest";

import {
  getGithubSettings,
} from "../github-auth/github-storage";

export async function getGithubClient(): Promise<Octokit> {

  const settings =
    await getGithubSettings();

  if (!settings) {

    throw new Error(
      "GitHub settings not found."
    );

  }

  return new Octokit({

    auth: settings.token,

  });

}