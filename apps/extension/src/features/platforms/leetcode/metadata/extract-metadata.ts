import type { ProblemMetadata } from "../../shared/problem-metadata";
import { PlatformType } from "../../shared/platform-type";
import { SOLUTION_MESSAGE } from "../solution/solution-message";

/**
 * Extract the currently selected programming language
 * from LeetCode's language dropdown.
 *
 * Examples:
 * Java (21) -> Java
 * Python3 -> Python
 * C++ (17) -> C++
 * JavaScript (Node v22) -> JavaScript
 * TypeScript -> TypeScript
 */
function extractLanguageFromDropdown(
  document: Document,
): string {
  /*
   * LeetCode's language selector can change its
   * internal DOM structure, so we first locate the
   * language dropdown using its class information.
   */
  const dropdown = document.querySelector(
    '[class*="problems_language_dropdown"]',
  );

  if (!dropdown) {
    console.warn(
      "[CodeVault] LeetCode language dropdown not found.",
    );

    return "";
  }

  /*
   * Preferred approach:
   * Find the currently selected option.
   */
  const selectedOption =
    dropdown.querySelector(
      '[role="option"][aria-selected="true"]',
    );

  if (selectedOption) {
    const selectedText =
      selectedOption.textContent?.trim() ?? "";

    const language =
      normalizeLanguage(selectedText);

    if (language) {
      console.log(
        "[CodeVault] LeetCode language:",
        language,
      );

      return language;
    }
  }

  /*
   * Fallback for LeetCode UI variants where the
   * selected language is rendered differently.
   */
  const fallbackElement =
    dropdown.querySelector(
      '[role="option"], [role="alert"]',
    );

  const fallbackText =
    fallbackElement?.textContent?.trim() ?? "";

  const fallbackLanguage =
    normalizeLanguage(fallbackText);

  if (fallbackLanguage) {
    console.log(
      "[CodeVault] LeetCode language (fallback):",
      fallbackLanguage,
    );

    return fallbackLanguage;
  }

  /*
   * Final dropdown fallback.
   */
  const dropdownText =
    dropdown.textContent?.trim() ?? "";

  const dropdownLanguage =
    normalizeLanguage(dropdownText);

  if (dropdownLanguage) {
    console.log(
      "[CodeVault] LeetCode language (dropdown fallback):",
      dropdownLanguage,
    );

    return dropdownLanguage;
  }

  console.warn(
    "[CodeVault] Unable to determine LeetCode language from dropdown.",
    {
      dropdownText,
    },
  );

  return "";
}

/**
 * Request the language directly from the
 * LeetCode Monaco editor running in MAIN WORLD.
 *
 * This is required because the submission page may
 * not contain LeetCode's language dropdown.
 */
function extractLanguageFromMainWorld(): Promise<string> {
  return new Promise<string>((resolve) => {
    let resolved = false;

    const cleanup = () => {
      window.removeEventListener(
        "message",
        handleMessage,
      );

      window.clearTimeout(timeoutId);
    };

    const finish = (language: string) => {
      if (resolved) {
        return;
      }

      resolved = true;

      cleanup();

      resolve(language);
    };

    const handleMessage = (
      event: MessageEvent,
    ) => {
      if (
        event.source !== window ||
        event.data?.type !== SOLUTION_MESSAGE
      ) {
        return;
      }

      const rawLanguage =
        String(
          event.data?.language ?? "",
        ).trim();

      if (!rawLanguage) {
        return;
      }

      const language =
        normalizeLanguage(rawLanguage);

      if (!language) {
        return;
      }

      console.log(
        "[CodeVault] LeetCode language from Monaco:",
        language,
      );

      finish(language);
    };

    window.addEventListener(
      "message",
      handleMessage,
    );

    /*
     * Ask the MAIN WORLD bridge for the current
     * Monaco solution and language.
     */
    window.postMessage(
      {
        type: "CODEVAULT_REQUEST_SOLUTION",
      },
      "*",
    );

    const timeoutId =
      window.setTimeout(() => {
        console.warn(
          "[CodeVault] Monaco language detection timed out.",
        );

        finish("");
      }, 10_000);
  });
}

/**
 * Extract LeetCode language.
 *
 * Order:
 *
 * 1. Try the normal LeetCode dropdown.
 * 2. If unavailable, ask Monaco MAIN WORLD.
 */
async function extractLanguage(
  document: Document,
): Promise<string> {
  const dropdownLanguage =
    extractLanguageFromDropdown(
      document,
    );

  if (dropdownLanguage) {
    return dropdownLanguage;
  }

  console.log(
    "[CodeVault] Falling back to Monaco language detection.",
  );

  return extractLanguageFromMainWorld();
}

/**
 * Converts LeetCode's displayed language name
 * into CodeVault's canonical language name.
 */
function normalizeLanguage(
  value: string,
): string {
  const text = value.trim();

  if (!text) {
    return "";
  }

  /*
   * Remove version/runtime information.
   *
   * Java (21) -> Java
   * C++ (17) -> C++
   * JavaScript (Node v22) -> JavaScript
   */
  const normalized = text
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

  /*
   * LeetCode language variants.
   */
  if (/^python3$/i.test(normalized)) {
    return "Python";
  }

  if (/^python$/i.test(normalized)) {
    return "Python";
  }

  if (/^java$/i.test(normalized)) {
    return "Java";
  }

  if (/^c\+\+$/i.test(normalized)) {
    return "C++";
  }

  if (/^c#$/i.test(normalized)) {
    return "C#";
  }

  if (/^javascript$/i.test(normalized)) {
    return "JavaScript";
  }

  if (/^typescript$/i.test(normalized)) {
    return "TypeScript";
  }

  if (/^(go|golang)$/i.test(normalized)) {
    return "Go";
  }

  if (/^rust$/i.test(normalized)) {
    return "Rust";
  }

  if (/^kotlin$/i.test(normalized)) {
    return "Kotlin";
  }

  if (/^swift$/i.test(normalized)) {
    return "Swift";
  }

  /*
   * Return the cleaned value for future languages
   * that CodeVault does not explicitly normalize yet.
   */
  return normalized;
}

/**
 * Extracts normalized metadata from the LeetCode
 * submission/problem page.
 */
export async function extractMetadata(
  document: Document,
): Promise<ProblemMetadata> {
  const script =
    document.getElementById(
      "__NEXT_DATA__",
    );

  if (!script?.textContent) {
    throw new Error(
      "__NEXT_DATA__ not found",
    );
  }

  const nextData =
    JSON.parse(script.textContent);

  const queries =
    nextData.props?.pageProps
      ?.dehydratedState?.queries;

  if (!Array.isArray(queries)) {
    throw new Error(
      "Queries not found",
    );
  }

  const questionQuery =
    queries.find(
      (query: any) =>
        query.queryKey?.[0] ===
        "questionDetail",
    );

  if (!questionQuery) {
    throw new Error(
      "questionDetail query not found",
    );
  }

  const question =
    questionQuery.state?.data?.question;

  if (!question) {
    throw new Error(
      "Question metadata not found",
    );
  }

  /*
   * Extract the currently selected language.
   *
   * The normal dropdown is preferred.
   * Monaco MAIN WORLD is used as fallback.
   */
  const language =
    await extractLanguage(document);

  if (!language) {
    console.warn(
      "[CodeVault] LeetCode language could not be detected.",
    );
  }

  const metadata: ProblemMetadata = {
    platform: PlatformType.LEETCODE,

    title: question.title,

    slug: question.titleSlug,

    difficulty:
      question.difficulty.toLowerCase(),

    language,

    url: window.location.href,

    solvedAt: new Date(),
  };

  console.log(
    "[CodeVault] LeetCode metadata:",
    metadata,
  );

  return metadata;
}