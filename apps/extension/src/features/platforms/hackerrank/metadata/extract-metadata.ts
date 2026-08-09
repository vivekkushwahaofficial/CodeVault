import type { ProblemMetadata } from "../../shared/problem-metadata";

import { PlatformType } from "../../shared/platform-type";

import {
  getLatestSubmission,
} from "../submission/hackerrank-submission-store";

/**
 * Extracts normalized metadata from the
 * latest accepted HackerRank submission.
 */
export function extractMetadata(
  document: Document,
): ProblemMetadata {
  /*
   * HackerRank metadata is captured from the
   * intercepted submission API response.
   *
   * The document parameter is kept because the
   * platform adapter interface requires it.
   */
  void document;

  /**
   * Get the latest accepted submission.
   */
  const submission =
    getLatestSubmission();

  /**
   * No accepted submission means that metadata
   * cannot be extracted.
   */
  if (!submission) {
    throw new Error(
      "HackerRank accepted submission metadata not found.",
    );
  }

  /**
   * Platform is always HackerRank.
   */
  const platform =
    PlatformType.HACKERRANK;

  /**
   * Problem title is mandatory.
   */
  const title =
    submission.title?.trim();

  if (!title) {
    throw new Error(
      "HackerRank problem title not found.",
    );
  }

  /**
   * Problem slug is mandatory.
   */
  const slug =
    submission.slug?.trim();

  if (!slug) {
    throw new Error(
      `HackerRank problem slug not found for "${title}".`,
    );
  }

  /**
   * Programming language is mandatory.
   *
   * We do NOT allow an empty language to
   * reach the GitHub synchronization layer.
   */
  const language =
    submission.language?.trim();

  if (!language) {
    throw new Error(
      `HackerRank programming language not found for "${title}".`,
    );
  }

  /**
   * Difficulty can legitimately be Unknown
   * if HackerRank does not expose it.
   */
  const difficulty =
    submission.difficulty?.trim() ||
    "Unknown";

  /**
   * Use the submission URL when available.
   */
  const url =
    submission.url?.trim() ||
    window.location.href;

  /**
   * Convert HackerRank's ISO date string
   * into the Date object expected by
   * ProblemMetadata.
   */
  const solvedAt =
    submission.solvedAt
      ? new Date(
        submission.solvedAt,
      )
      : new Date();

  /**
   * Protect against invalid date strings.
   */
  if (
    Number.isNaN(
      solvedAt.getTime(),
    )
  ) {
    throw new Error(
      `Invalid HackerRank solvedAt value for "${title}": ${submission.solvedAt}`,
    );
  }

  /**
   * Return production-ready metadata.
   */
  return {
    platform,

    title,

    slug,

    difficulty,

    language,

    url,

    solvedAt,
  };
}