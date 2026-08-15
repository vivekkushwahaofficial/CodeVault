import type {
  RepositoryIndex,
  RepositorySolution,
} from "./types";

/**
 * Generates the repository-level CodeVault portfolio README.
 *
 * The README is derived entirely from the repository index.
 * No statistics are hardcoded.
 */
export function generatePortfolioReadme(
  index: RepositoryIndex,
): string {

  const solutions =
    index.solutions;

  const total =
    solutions.length;

  const easy =
    countByDifficulty(
      solutions,
      "easy",
    );

  const medium =
    countByDifficulty(
      solutions,
      "medium",
    );

  const hard =
    countByDifficulty(
      solutions,
      "hard",
    );

  const languages =
    countBy(
      solutions,
      (solution) =>
        solution.metadata.language,
    );

  const platforms =
    countBy(
      solutions,
      (solution) =>
        solution.metadata.platform,
    );

  const patterns =
    countByMany(
      solutions,
      (solution) =>
        solution.metadata.patterns ?? [],
    );

  const topics =
    countByMany(
      solutions,
      (solution) =>
        solution.metadata.topics ?? [],
    );

  const recentSolutions =
    [...solutions]
      .sort(
        (a, b) =>
          getSolvedTime(b) -
          getSolvedTime(a),
      )
      .slice(
        0,
        10,
      );

  return [
    "# ⚡ Coding Solutions Portfolio",
    "",
    "> Automatically organized and updated by **CodeVault**.",
    "",
    "---",
    "",
    "## 📊 Overview",
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    `| 🏆 Total Solved | ${total} |`,
    `| 🟢 Easy | ${easy} |`,
    `| 🟠 Medium | ${medium} |`,
    `| 🔴 Hard | ${hard} |`,
    "",
    "## 🧩 Patterns",
    "",
    generateCountTable(
      patterns,
      "Pattern",
    ),
    "",
    "## 📚 Topics",
    "",
    generateCountTable(
      topics,
      "Topic",
    ),
    "",
    "## 💻 Languages",
    "",
    generateCountTable(
      languages,
      "Language",
    ),
    "",
    "## 🌐 Platforms",
    "",
    generateCountTable(
      platforms,
      "Platform",
    ),
    "",
    "## 🕒 Recently Solved",
    "",
    generateRecentSolutions(
      recentSolutions,
    ),
    "",
    "## 🗂 Repository",
    "",
    "- 📚 [Solution Index](.codevault/index.json)",
    "- 🧩 [Patterns](patterns/)",
    "- 📚 [Topics](topics/)",
    "",
    "---",
    "",
    "### 🤖 Powered by CodeVault",
    "",
    "This README is generated automatically from the CodeVault repository index.",
    "",
  ].join("\n");
}

/**
 * Counts solutions for one difficulty.
 */
function countByDifficulty(
  solutions: RepositorySolution[],
  difficulty: string,
): number {

  return solutions.filter(
    (solution) =>
      solution.metadata.difficulty
        .toLowerCase() ===
      difficulty,
  ).length;
}

/**
 * Counts one value per solution.
 *
 * Example:
 *
 * Java → 2
 * Python → 1
 */
function countBy(
  solutions: RepositorySolution[],
  selector: (
    solution: RepositorySolution,
  ) => string,
): Map<string, number> {

  const counts =
    new Map<string, number>();

  for (
    const solution of solutions
  ) {

    const value =
      selector(solution).trim();

    if (!value) {
      continue;
    }

    counts.set(
      value,
      (counts.get(value) ?? 0) + 1,
    );
  }

  return counts;
}

/**
 * Counts values where each solution
 * can belong to multiple categories.
 *
 * Example:
 *
 * Two Sum
 *   → Hash Map
 *
 * Valid Parentheses
 *   → Stack
 */
function countByMany(
  solutions: RepositorySolution[],
  selector: (
    solution: RepositorySolution,
  ) => string[],
): Map<string, number> {

  const counts =
    new Map<string, number>();

  for (
    const solution of solutions
  ) {

    for (
      const rawValue of selector(solution)
    ) {

      const value =
        rawValue.trim();

      if (!value) {
        continue;
      }

      counts.set(
        value,
        (counts.get(value) ?? 0) + 1,
      );
    }
  }

  return counts;
}

/**
 * Generates a Markdown table
 * from category counts.
 */
function generateCountTable(
  counts: Map<string, number>,
  label: string,
): string {

  const entries =
    [...counts.entries()]
      .sort(
        (a, b) =>
          b[1] - a[1] ||
          a[0].localeCompare(
            b[0],
          ),
      );

  if (
    entries.length === 0
  ) {
    return "_No data yet._";
  }

  return [
    `| ${label} | Problems |`,
    "| --- | ---: |",
    ...entries.map(
      ([name, count]) =>
        `| ${name} | ${count} |`,
    ),
  ].join("\n");
}

/**
 * Generates the recently solved table.
 */
function generateRecentSolutions(
  solutions: RepositorySolution[],
): string {

  if (
    solutions.length === 0
  ) {
    return "_No solutions yet._";
  }

  return [
    "| Problem | Difficulty | Language |",
    "| --- | --- | --- |",
    ...solutions.map(
      (solution) => {

        const metadata =
          solution.metadata;

        const readmePath =
          solution.path.replace(
            /\/Solution\.[^/]+$/,
            "/README.md",
          );

        return (
          `| [${metadata.title}](${readmePath}) | ` +
          `${capitalize(metadata.difficulty)} | ` +
          `${metadata.language} |`
        );
      },
    ),
  ].join("\n");
}

/**
 * Returns the solution timestamp.
 */
function getSolvedTime(
  solution: RepositorySolution,
): number {

  if (
    solution.solvedAt
  ) {
    return new Date(
      solution.solvedAt,
    ).getTime();
  }

  return 0;
}

/**
 * Capitalizes difficulty for display.
 */
function capitalize(
  value: string,
): string {

  if (!value) {
    return value;
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}