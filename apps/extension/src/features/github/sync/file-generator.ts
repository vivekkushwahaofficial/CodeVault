export interface SolutionMetadata {

  platform: string;

  difficulty: string;

  title: string;

  language: string;

}


function cleanPath(value: string): string {

  return value
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-");

}



function getExtension(
  language: string,
): string {


  switch (
    language
      .toLowerCase()
      .trim()
  ) {

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


  const platform =
    cleanPath(
      metadata.platform || "LeetCode",
    );


  const difficulty =
    cleanPath(
      metadata.difficulty || "Unknown",
    );


  const title =
    cleanPath(
      metadata.title || "Unknown-Problem",
    );


  const extension =
    getExtension(
      metadata.language || "txt",
    );


  return (
    `${platform}/` +
    `${difficulty}/` +
    `${title}/` +
    `Solution.${extension}`
  );

}