import type { ProblemStatement } from "../../platforms/shared/problem-statement";

/**
 * Generates a README.md for a coding problem.
 */
export function generateReadme(
  problem: ProblemStatement,
): string {

  return `# ${problem.title}

![Difficulty](https://img.shields.io/badge/Difficulty-${problem.difficulty}-brightgreen)

## Problem

${problem.url}

---

${problem.html}
`;

}