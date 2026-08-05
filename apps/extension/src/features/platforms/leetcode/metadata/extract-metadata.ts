import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";

export function extractMetadata(
  document: Document
): ProblemMetadata {

  const titleLink =
    document.querySelector("a[href^='/problems/']");

  const rawTitle =
    titleLink?.textContent?.trim() ?? "";

  const title =
    rawTitle.replace(/^\d+\.\s*/, "");

  const difficulty =
    (
      document.querySelector('[class*="text-difficulty-"]') ??
      document.querySelector("div[class*='text-olive']") ??
      document.querySelector("div[class*='text-yellow']") ??
      document.querySelector("div[class*='text-pink']")
    )?.textContent?.trim() ?? "";

  const slug =
    new URL(window.location.href)
      .pathname
      .split("/")[2]
      ?? "";

  const url =
    `${window.location.origin}/problems/${slug}/`;

  // 👇 Add these two lines HERE
  console.log("[Metadata] Title:", title);
  console.log("[Metadata] Difficulty:", difficulty);

  return {

    platform: PlatformType.LEETCODE,

    title,

    slug,

    difficulty,

    language: "",

    url,

    solvedAt: new Date(),

  };

}