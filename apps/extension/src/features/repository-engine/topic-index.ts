import type { RepositorySolution } from "./types";

/**
 * Builds a Markdown index for one topic.
 */
export function generateTopicIndex(
  topic: string,
  solutions: RepositorySolution[],
): string {
  const matchingSolutions =
    solutions.filter(
      (solution) =>
        solution.metadata.topics?.includes(topic),
    );

  const lines: string[] = [
    `# ${topic}`,
    "",
    "## Problems",
    "",
  ];

  if (matchingSolutions.length === 0) {
    lines.push(
      "_No problems classified under this topic yet._",
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