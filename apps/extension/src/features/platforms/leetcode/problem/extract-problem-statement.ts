import type { ProblemStatement } from "../../shared/problem-statement";

/**
 * Extracts the problem statement from the current LeetCode page.
 *
 * LeetCode exposes the problem data through __NEXT_DATA__.
 * The questionDetail query contains the full problem HTML in `content`.
 */
export function extractProblemStatement(
  document: Document,
): ProblemStatement {
  const script =
    document.getElementById("__NEXT_DATA__");

  if (!script?.textContent) {
    throw new Error(
      "LeetCode __NEXT_DATA__ not found.",
    );
  }

  const nextData =
    JSON.parse(script.textContent);

  const queries =
    nextData.props?.pageProps?.dehydratedState?.queries;

  if (!Array.isArray(queries)) {
    throw new Error(
      "LeetCode queries not found.",
    );
  }

  const questionQuery =
    queries.find(
      (query: any) =>
        query.queryKey?.[0] === "questionDetail",
    );

  if (!questionQuery) {
    throw new Error(
      "LeetCode questionDetail query not found.",
    );
  }

  const question =
    questionQuery.state?.data?.question;

  if (!question) {
    throw new Error(
      "LeetCode question data not found.",
    );
  }

  if (
    typeof question.content !== "string" ||
    !question.content.trim()
  ) {
    throw new Error(
      "LeetCode problem content not found.",
    );
  }

  return {
    title: question.title,
    difficulty:
      question.difficulty.toLowerCase(),
    url: window.location.href,
    html: question.content,
  };
}
