import { getGithubClient } from "../client/github-client";
import { getGithubSettings } from "../github-auth/github-storage";

/**
 * Reads a text file from the configured GitHub repository.
 *
 * Returns null when the file does not exist.
 */
export async function readRepositoryFile(
  path: string,
): Promise<string | null> {
  const settings =
    await getGithubSettings();

  if (!settings) {
    throw new Error(
      "GitHub settings not found.",
    );
  }

  if (!settings.branch) {
    throw new Error(
      "GitHub branch not configured.",
    );
  }

  const github =
    await getGithubClient();

  try {
    const response =
      await github.repos.getContent({
        owner: settings.owner,
        repo: settings.repo,
        path,
        ref: settings.branch,
      });

    if (Array.isArray(response.data)) {
      throw new Error(
        `Expected a file but "${path}" is a directory.`,
      );
    }

    if (!("content" in response.data)) {
      throw new Error(
        `GitHub did not return file content for "${path}".`,
      );
    }

    return decodeBase64(
      response.data.content,
    );
  } catch (error) {
    const requestError =
      error as { status?: number };

    if (requestError.status === 404) {
      return null;
    }

    throw error;
  }
}

/**
 * Decodes GitHub's Base64 file content.
 */
function decodeBase64(
  content: string,
): string {
  return decodeURIComponent(
    escape(
      atob(
        content.replace(/\n/g, ""),
      ),
    ),
  );
}