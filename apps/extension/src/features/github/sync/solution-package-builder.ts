import { generateReadme } from "../readme/readme-generator";
import { generateSolutionPath } from "./file-generator";

import type { SolutionMetadata } from "./file-generator";
import type { ProblemStatement } from "../../platforms/shared/problem-statement";
import type { SolutionPackage } from "./types/solution-package";

export function buildSolutionPackage(
  metadata: SolutionMetadata,
  sourceCode: string,
  problemStatement: ProblemStatement,
): SolutionPackage {

  const solutionPath =
    generateSolutionPath(metadata);

  const readmePath =
    solutionPath.replace(
      /[^/]+$/,
      "README.md",
    );

  const commitMessage =
    `feat(${metadata.platform.toLowerCase()}): Add ${metadata.title}`;

  console.log("================================");
  console.log("📦 Building Solution Package");
  console.log("Platform:", metadata.platform);
  console.log("Difficulty:", metadata.difficulty);
  console.log("Title:", metadata.title);
  console.log("Language:", metadata.language);
  console.log("Solution Path:", solutionPath);
  console.log("README Path:", readmePath);
  console.log("================================");

  return {

    metadata,

    commitMessage,

    files: [

      {

        path: readmePath,

        content: generateReadme(
          problemStatement,
        ),

      },

      {

        path: solutionPath,

        content: sourceCode,

      },

    ],

  };

}