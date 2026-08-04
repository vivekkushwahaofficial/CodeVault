import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";


export function extractMetadata(
  document: Document
): ProblemMetadata {


  const rawTitle =
    document
      .querySelector("div.text-title-large a")
      ?.textContent
      ?.trim()
      ?? "";


  const title =
    rawTitle.replace(/^\d+\.\s*/, "");



  const difficulty =
    document
      .querySelector('[class*="text-difficulty-"]')
      ?.textContent
      ?.trim()
      ?? "";



  const slug =
    new URL(window.location.href)
      .pathname
      .split("/")[2]
      ?? "";



  const url =
    `${window.location.origin}/problems/${slug}/`;



  return {

    platform:
      PlatformType.LEETCODE,

    title,

    slug,

    difficulty,

    language:
      "",

    url,

    solvedAt:
      new Date(),

  };

}