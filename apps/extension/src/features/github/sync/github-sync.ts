import { commitSolution } from "../services/github-commit-service";

import type { SolutionPackage } from "./types/solution-package";


export interface SyncResult {

  success: boolean;

  message: string;

}


export async function syncSolution(
  solution: SolutionPackage,
): Promise<SyncResult> {


  console.log(
    "🔄 Starting GitHub Sync",
  );


  console.log(
    "Solution Package:",
    solution,
  );



  if (
    !solution.files ||
    solution.files.length === 0
  ) {

    throw new Error(
      "No files to synchronize.",
    );

  }



  for (const file of solution.files) {


    console.log(
      "Checking file:",
      file.path,
    );



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



  if (
    !solution.commitMessage ||
    !solution.commitMessage.trim()
  ) {

    throw new Error(
      "Commit message is missing.",
    );

  }



  console.log(
    "✅ Validation passed",
  );



  console.log(
    "📂 Files before GitHub upload:",
  );



  solution.files.forEach(
    (file) => {

      console.log(
        "PATH:",
        file.path,
      );


    },
  );



  await commitSolution(
    solution,
  );



  console.log(
    "🚀 GitHub sync completed",
  );



  return {

    success: true,

    message:
      "Solution committed successfully.",

  };


}