export interface SolutionMetadata {

  platform: string;

  difficulty: string;

  title: string;

  language: string;

}

function getExtension(
  language: string,
): string {

  switch (language.toLowerCase()) {

    case "java":
      return "java";

    case "python":
      return "py";

    case "javascript":
      return "js";

    case "typescript":
      return "ts";

    case "cpp":
    case "c++":
      return "cpp";

    case "c":
      return "c";

    case "go":
      return "go";

    case "rust":
      return "rs";

    default:
      return "txt";

  }

}

export function generateSolutionPath(
  metadata: SolutionMetadata,
): string {

  return `${metadata.platform}/${metadata.difficulty}/${metadata.title}/Solution.${getExtension(
    metadata.language,
  )}`;

}