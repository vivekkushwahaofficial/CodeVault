import type {
  RepositoryIndex,
  RepositorySolution,
} from "./types";

/**
 * Adds or updates a solution in the repository index.
 *
 * A solution is uniquely identified by its repository path.
 */
export function upsertRepositorySolution(
  index: RepositoryIndex,
  solution: RepositorySolution,
): RepositoryIndex {
  const existingIndex =
    index.solutions.findIndex(
      (item) => item.path === solution.path,
    );

  if (existingIndex === -1) {
    return {
      ...index,
      solutions: [
        ...index.solutions,
        solution,
      ],
    };
  }

  const solutions = [
    ...index.solutions,
  ];

  solutions[existingIndex] = solution;

  return {
    ...index,
    solutions,
  };
}

/**
 * Creates an empty repository index.
 */
export function createRepositoryIndex(): RepositoryIndex {
  return {
    version: 1,
    solutions: [],
  };
}

/**
 * Serializes the repository index.
 */
export function serializeRepositoryIndex(
  index: RepositoryIndex,
): string {
  return JSON.stringify(
    index,
    null,
    2,
  );
}

/**
 * Parses an existing repository index.
 *
 * Returns an empty index when no valid index exists.
 */
export function parseRepositoryIndex(
  content: string | null,
): RepositoryIndex {
  if (!content?.trim()) {
    return createRepositoryIndex();
  }

  try {
    const parsed =
      JSON.parse(content) as RepositoryIndex;

    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.solutions)
    ) {
      throw new Error(
        "Invalid repository index format.",
      );
    }

    return parsed;
  } catch (error) {
    throw new Error(
      `Failed to parse repository index: ${error instanceof Error
        ? error.message
        : "Unknown error"
      }`,
    );
  }
}