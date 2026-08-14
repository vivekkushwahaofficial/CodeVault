import { generateReadme } from "../readme/readme-generator";
import { readRepositoryFile } from "../services/github-repository-reader";

import { RepositoryEngine } from "../../repository-engine/repository-engine";

import { generateSolutionPath } from "./solution-path-generator";

import type { SolutionMetadata } from "./solution-path-generator";
import type { ProblemStatement } from "../../platforms/shared/problem-statement";
import type { SolutionPackage } from "./types/solution-package";

export async function buildSolutionPackage(
  metadata: SolutionMetadata,
  sourceCode: string,
  problemStatement: ProblemStatement,
): Promise<SolutionPackage> {
  const solutionPath =
    generateSolutionPath(
      metadata,
    );

  const readmePath =
    solutionPath.replace(
      /[^/]+$/,
      "README.md",
    );

  const commitMessage =
    `feat(${metadata.platform.toLowerCase()}): Add ${metadata.title}`;

  console.log(
    "================================",
  );

  console.log(
    "📦 Building Solution Package",
  );

  console.log(
    "Platform:",
    metadata.platform,
  );

  console.log(
    "Difficulty:",
    metadata.difficulty,
  );

  console.log(
    "Title:",
    metadata.title,
  );

  console.log(
    "Language:",
    metadata.language,
  );

  console.log(
    "Solution Path:",
    solutionPath,
  );

  console.log(
    "README Path:",
    readmePath,
  );

  console.log(
    "================================",
  );

  const existingIndex =
    await readRepositoryFile(
      ".codevault/index.json",
    );

  const repositoryEngine =
    RepositoryEngine.fromIndex(
      existingIndex,
    );

  const repositoryResult =
    repositoryEngine.process({
      path: solutionPath,
      metadata,
    });

  console.log(
    "[CodeVault] Repository Engine result:",
    repositoryResult,
  );

  return {
    metadata,

    commitMessage,

    files: [
      {
        path: readmePath,

        content:
          generateReadme(
            problemStatement,
          ),
      },

      {
        path: solutionPath,

        content: sourceCode,
      },

      ...repositoryResult.files,
    ],
  };
}