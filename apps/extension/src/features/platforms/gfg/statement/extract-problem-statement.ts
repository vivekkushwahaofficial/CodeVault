import type { ProblemStatement } from "../../shared/problem-statement";
import { extractMetadata } from "../metadata/extract-metadata";

export function extractProblemStatement(
  document: Document,
): ProblemStatement {

  const metadata = extractMetadata(document);

  const statement = document.querySelector(
    '[class*="problems_problem_content"]',
  );

  if (!statement) {
    throw new Error(
      "GFG problem statement not found",
    );
  }

  return {
    title: metadata.title,

    difficulty: metadata.difficulty,

    url: metadata.url,

    html: statement.innerHTML,
  };
}