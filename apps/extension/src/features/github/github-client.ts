import type { GitHubFileRequest } from "./github-types";
import { getGithubSettings } from "./github-auth/github-storage";

export async function createGithubFile(
  request: GitHubFileRequest
) {

  const {
    owner,
    repo,
    path,
    content,
    message,
  } = request;

  const settings =
    await getGithubSettings();

  if (!settings) {

    throw new Error(
      "GitHub settings not found."
    );

  }

  const encodedContent =
    btoa(
      unescape(
        encodeURIComponent(content)
      )
    );

  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const existing =
    await fetch(
      url,
      {

        headers: {

          Authorization: `Bearer ${settings.token}`,

          Accept: "application/vnd.github+json",

        },

      }
    );

  let sha: string | undefined;

  if (existing.ok) {

    const data =
      await existing.json();

    sha = data.sha;

  }

  const response =
    await fetch(
      url,
      {

        method: "PUT",

        headers: {

          Authorization: `Bearer ${settings.token}`,

          Accept: "application/vnd.github+json",

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          message,

          content: encodedContent,

          ...(sha && { sha }),

        }),

      }
    );

  if (!response.ok) {

    throw new Error(
      "Failed to create GitHub file."
    );

  }

  return await response.json();

}