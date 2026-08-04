import { commitSolution } from "../services/github-commit-service";

import type { SolutionPackage } from "./types/solution-package";

export interface SyncResult {

  success: boolean;

  message: string;

}

export async function syncSolution(
  solution: SolutionPackage,
): Promise<SyncResult> {

  if (solution.files.length === 0) {

    throw new Error(
      "No files to synchronize.",
    );

  }

  for (const file of solution.files) {

    if (!file.path.trim()) {

      throw new Error(
        "A file path is missing.",
      );

    }

    if (!file.content.trim()) {

      throw new Error(
        `File "${file.path}" is empty.`,
      );

    }

  }

  if (!solution.commitMessage.trim()) {

    throw new Error(
      "Commit message is missing.",
    );

  }

  await commitSolution(solution);

  return {

    success: true,

    message: "Solution committed successfully.",

  };

}