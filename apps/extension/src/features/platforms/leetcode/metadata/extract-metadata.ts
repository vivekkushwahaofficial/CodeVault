import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";

/**
 * Extracts normalized metadata from the LeetCode submission page.
 */
export function extractMetadata(
  document: Document,
): ProblemMetadata {

  const script =
    document.getElementById("__NEXT_DATA__");

  if (!script?.textContent) {
    throw new Error("__NEXT_DATA__ not found");
  }

  const nextData =
    JSON.parse(script.textContent);

  const queries =
    nextData.props?.pageProps?.dehydratedState?.queries;

  if (!Array.isArray(queries)) {
    throw new Error("Queries not found");
  }

  const questionQuery =
    queries.find(
      (query: any) =>
        query.queryKey?.[0] === "questionDetail",
    );

  if (!questionQuery) {
    throw new Error("questionDetail query not found");
  }

  const question =
    questionQuery.state?.data?.question;

  if (!question) {
    throw new Error("Question metadata not found");
  }

  return {

    platform: PlatformType.LEETCODE,

    title: question.title,

    slug: question.titleSlug,

    difficulty:
      question.difficulty.toLowerCase(),

    // TODO: Extract from the submission page later
    language: "",

    url: window.location.href,

    solvedAt: new Date(),

  };

}