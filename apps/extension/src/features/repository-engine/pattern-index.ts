import type { RepositorySolution } from "./types";

/**
 * Builds a Markdown index for one pattern.
 *
 * Example:
 *
 * # HashMap
 *
 * ## Problems
 *
 * - [Two Sum](../LeetCode/Java/Easy/Two-Sum/README.md)
 */
export function generatePatternIndex(
  pattern: string,
  solutions: RepositorySolution[],
): string {
  const matchingSolutions =
    solutions.filter(
      (solution) =>
        solution.metadata.patterns?.includes(pattern),
    );

  const lines: string[] = [
    `# ${pattern}`,
    "",
    "## Problems",
    "",
  ];

  if (matchingSolutions.length === 0) {
    lines.push(
      "_No problems classified under this pattern yet._",
      "",
    );

    return lines.join("\n");
  }

  for (const solution of matchingSolutions) {
    const metadata =
      solution.metadata;

    const readmePath =
      solution.path.replace(
        /\/Solution\.[^/]+$/,
        "/README.md",
      );

    lines.push(
      `- [${metadata.title}](${readmePath}) — ${metadata.platform} · ${metadata.language} · ${metadata.difficulty}`,
    );
  }

  lines.push("");

  return lines.join("\n");
}