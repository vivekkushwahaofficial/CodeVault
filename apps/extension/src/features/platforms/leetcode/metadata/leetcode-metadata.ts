export function extractLeetCodeMetadata() {

  const pathParts = window.location.pathname.split("/");


  const slug =
    pathParts[pathParts.indexOf("problems") + 1]
    || "unknown";


  const title =
    document.querySelector(
      "[data-cy='question-title']"
    )?.textContent
    ?.replace(/^\d+\.\s*/, "")
    .trim()
    ||
    document.title
      .replace(" - LeetCode", "")
      .trim();


  const difficulty =
    document.querySelector(
      "div[class*='text-difficulty']"
    )?.textContent
    ?.trim()
    ||
    "Unknown";


  return {

    platform: "leetcode",

    title,

    slug,

    difficulty,

  };

}