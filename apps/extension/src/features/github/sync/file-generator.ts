export interface SolutionMetadata {
  platform: string;
  difficulty: string;
  title: string;
  language: string;
}

/**
 * Cleans a value so it can safely be used as a GitHub path segment.
 */
function cleanPath(value: string): string {
  return value
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Returns the correct source-code file extension
 * for the programming language.
 */
function getExtension(language: string): string {
  switch (language.toLowerCase().trim()) {
    case "java":
      return "java";

    case "python":
    case "python3":
      return "py";

    case "javascript":
      return "js";

    case "typescript":
      return "ts";

    case "c++":
    case "cpp":
      return "cpp";

    case "c":
      return "c";

    case "c#":
    case "csharp":
      return "cs";

    case "go":
      return "go";

    case "rust":
      return "rs";

    case "kotlin":
      return "kt";

    case "swift":
      return "swift";

    default:
      return "txt";
  }
}

/**
 * Generates the GitHub path for a solution.
 *
 * IMPORTANT:
 * - LeetCode uses:
 *     LeetCode/<Language>/<Difficulty>/<Problem>/Solution.ext
 *
 * - GFG and HackerRank keep their existing structure:
 *     Platform/<Difficulty>/<Problem>/Solution.ext
 *
 * This keeps the existing GFG and HackerRank pipelines unchanged.
 */
export function generateSolutionPath(
  metadata: SolutionMetadata,
): string {
  const platform = cleanPath(
    metadata.platform || "LeetCode",
  );

  const difficulty = cleanPath(
    metadata.difficulty || "Unknown",
  );

  const title = cleanPath(
    metadata.title || "Unknown-Problem",
  );

  const language = cleanPath(
    metadata.language || "Unknown",
  );

  const extension = getExtension(
    metadata.language || "",
  );

  /*
   * LeetCode:
   *
   * LeetCode/
   *   Java/
   *     easy/
   *       Two-Sum/
   *         Solution.java
   */
  if (metadata.platform.toLowerCase() === "leetcode") {
    return (
      `${platform}/` +
      `${language}/` +
      `${difficulty}/` +
      `${title}/` +
      `Solution.${extension}`
    );
  }

  /*
   * GFG and HackerRank:
   *
   * Keep their existing path structure unchanged.
   */
  return (
    `${platform}/` +
    `${difficulty}/` +
    `${title}/` +
    `Solution.${extension}`
  );
}