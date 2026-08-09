import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";
import { extractLeetCodeLanguage } from "./leetcode-language";

/**
 * Extracts normalized metadata from the LeetCode submission page.
 */
export function extractMetadata(
  document: Document,
): ProblemMetadata {
  /*
   * LeetCode exposes useful problem metadata inside
   * the __NEXT_DATA__ script.
   */
  const script =
    document.getElementById(
      "__NEXT_DATA__",
    );

  if (!script?.textContent) {
    throw new Error(
      "LeetCode __NEXT_DATA__ not found",
    );
  }

  let nextData: any;

  try {
    nextData =
      JSON.parse(
        script.textContent,
      );
  } catch {
    throw new Error(
      "Failed to parse LeetCode __NEXT_DATA__",
    );
  }

  /*
   * Find the dehydrated React Query state.
   */
  const queries =
    nextData
      ?.props
      ?.pageProps
      ?.dehydratedState
      ?.queries;

  if (!Array.isArray(queries)) {
    throw new Error(
      "LeetCode queries not found",
    );
  }

  /*
   * Find the questionDetail query.
   */
  const questionQuery =
    queries.find(
      (query: any) =>
        Array.isArray(query?.queryKey) &&
        query.queryKey[0] ===
          "questionDetail",
    );

  if (!questionQuery) {
    throw new Error(
      "LeetCode questionDetail query not found",
    );
  }

  /*
   * Extract the actual question object.
   */
  const question =
    questionQuery
      ?.state
      ?.data
      ?.question;

  if (!question) {
    throw new Error(
      "LeetCode question metadata not found",
    );
  }

  /*
   * Validate the mandatory problem fields.
   */
  const title =
    typeof question.title === "string"
      ? question.title.trim()
      : "";

  const slug =
    typeof question.titleSlug === "string"
      ? question.titleSlug.trim()
      : "";

  const difficulty =
    typeof question.difficulty === "string"
      ? question.difficulty
          .trim()
          .toLowerCase()
      : "";

  if (!title) {
    throw new Error(
      "LeetCode problem title not found",
    );
  }

  if (!slug) {
    throw new Error(
      `LeetCode problem slug not found for "${title}"`,
    );
  }

  if (!difficulty) {
    throw new Error(
      `LeetCode difficulty not found for "${title}"`,
    );
  }

  /*
   * Extract the actual selected language from
   * the submission/editor UI.
   */
  const language =
    extractLeetCodeLanguage(
      document,
    );

  console.log(
    "[CodeVault] LeetCode language:",
    language || "NOT FOUND",
  );

  /*
   * Do not allow incomplete metadata to continue.
   *
   * ContentOrchestrator performs the final validation,
   * but failing here gives us a platform-specific error
   * that is much easier to debug.
   */
  if (!language) {
    throw new Error(
      `LeetCode programming language could not be detected for "${title}".`,
    );
  }

  /*
   * Return normalized metadata.
   */
  return {
    platform:
      PlatformType.LEETCODE,

    title,

    slug,

    difficulty,

    language,

    url:
      window.location.href,

    solvedAt:
      new Date(),
  };
}