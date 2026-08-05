import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";

export function extractMetadata(
  document: Document
): ProblemMetadata {

  const nextData = (window as any).__NEXT_DATA__;

  const question =
    nextData?.props?.pageProps?.dehydratedState?.queries
      ?.find((q: any) => q.queryKey?.[0] === "questionDetail")
      ?.state?.data?.question;

  if (!question) {
    throw new Error("Unable to extract LeetCode metadata.");
  }

  return {

    platform: PlatformType.LEETCODE,

    title: question.title,

    slug: question.titleSlug,

    difficulty: question.difficulty,

    language: "",

    url: `${window.location.origin}/problems/${question.titleSlug}/`,

    solvedAt: new Date(),

  };

}