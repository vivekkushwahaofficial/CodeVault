import { getGithubClient } from "../client/github-client";
import { getGithubSettings } from "../github-auth/github-storage";

import type {
  SolutionFile,
  SolutionPackage,
} from "../sync/types/solution-package";

async function commitFile(
  file: SolutionFile,
  commitMessage: string,
): Promise<void> {

  const settings =
    await getGithubSettings();

  if (!settings) {

    throw new Error(
      "GitHub settings not found.",
    );

  }

  const github =
    await getGithubClient();

  console.log("================================");
  console.log("📤 Uploading File");
  console.log("Path:", file.path);
  console.log("================================");

  const content =
    btoa(file.content);

  let sha: string | undefined;

  try {

    const response =
      await github.repos.getContent({

        owner: settings.owner,

        repo: settings.repo,

        path: file.path,

      });

    if (!Array.isArray(response.data)) {

      sha = response.data.sha;

      console.log("Existing file found");

    }

  } catch (error) {

    const requestError =
      error as { status?: number };

    if (requestError.status !== 404) {

      throw error;

    }

    console.log("Creating new file");

  }

  await github.repos.createOrUpdateFileContents({

    owner: settings.owner,

    repo: settings.repo,

    path: file.path,

    message: commitMessage,

    content,

    sha,

  });

  console.log("✅ Uploaded:", file.path);

}

export async function commitSolution(
  solution: SolutionPackage,
): Promise<void> {

  console.log("================================");
  console.log("📦 Solution Package");
  console.log(solution);
  console.log("================================");

  console.log("Files to upload:");

  for (const file of solution.files) {

    console.log(file.path);

  }

  for (const file of solution.files) {

    await commitFile(

      file,

      solution.commitMessage,

    );

  }

  console.log("✅ All files uploaded.");

}