import { SOLUTION_MESSAGE } from "../src/features/platforms/leetcode/solution/solution-message";

interface LeetCodeMetadata {
  title: string;
  titleSlug: string;
  difficulty: string;
}

declare global {
  interface Window {
    __codevaultMainWorldInitialized?: boolean;
  }
}

export default defineUnlistedScript(() => {

  if (window.__codevaultMainWorldInitialized) {
    console.debug(
      "[CodeVault] Main world already initialized.",
    );

    return;
  }

  window.__codevaultMainWorldInitialized = true;

  console.log(
    "🔥 CodeVault MAIN WORLD LOADED",
  );

  /*
   * --------------------------------------------------
   * Solution extraction
   * --------------------------------------------------
   */

  window.addEventListener(
    "message",
    async (event) => {

      if (
        event.source !== window
      ) {
        return;
      }

      if (
        event.data?.type !==
        "CODEVAULT_REQUEST_SOLUTION"
      ) {
        return;
      }

      console.log(
        "🔥 Solution request received",
      );

      let model;

      for (
        let i = 0;
        i < 30;
        i++
      ) {

        model =
          window.monaco
            ?.editor
            ?.getModels()
          ?.[0];

        if (model) {
          break;
        }

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000,
            ),
        );
      }

      if (!model) {

        console.warn(
          "[CodeVault] Monaco editor model not found.",
        );

        return;
      }

      const solution =
        model.getValue();

      console.log(
        "CodeVault: Solution received",
        solution.length,
      );

      window.postMessage(
        {
          type:
            SOLUTION_MESSAGE,

          solution,
        },
        "*",
      );
    },
  );

  /*
   * --------------------------------------------------
   * Metadata extraction
   * --------------------------------------------------
   */

  window.addEventListener(
    "message",
    async (event) => {

      if (
        event.source !== window
      ) {
        return;
      }

      if (
        event.data?.type !==
        "CODEVAULT_REQUEST_METADATA"
      ) {
        return;
      }

      const requestId =
        event.data.requestId;

      const requestedSlug =
        typeof event.data.slug === "string"
          ? event.data.slug
            .trim()
            .toLowerCase()
          : "";

      console.log(
        "[CodeVault] Metadata request received:",
        requestedSlug,
      );

      if (!requestId || !requestedSlug) {

        window.postMessage(
          {
            type:
              "CODEVAULT_METADATA_RESPONSE",

            requestId,

            slug:
              requestedSlug,

            metadata:
              null,

            error:
              "Invalid metadata request.",
          },
          "*",
        );

        return;
      }

      try {

        const metadata =
          await waitForMetadata(
            requestedSlug,
          );

        console.log(
          "[CodeVault] Metadata response:",
          metadata,
        );

        window.postMessage(
          {
            type:
              "CODEVAULT_METADATA_RESPONSE",

            requestId,

            slug:
              requestedSlug,

            metadata,
          },
          "*",
        );

      } catch (error) {

        console.error(
          "[CodeVault] Metadata extraction failed:",
          error,
        );

        window.postMessage(
          {
            type:
              "CODEVAULT_METADATA_RESPONSE",

            requestId,

            slug:
              requestedSlug,

            metadata:
              null,

            error:
              error instanceof Error
                ? error.message
                : String(error),
          },
          "*",
        );
      }
    },
  );

  /*
   * --------------------------------------------------
   * Wait for current LeetCode metadata
   * --------------------------------------------------
   */

  async function waitForMetadata(
    requestedSlug: string,
  ): Promise<LeetCodeMetadata> {

    const timeoutMs =
      5_000;
    const intervalMs =
      200;

    const startTime =
      Date.now();

    while (
      Date.now() - startTime <
      timeoutMs
    ) {

      const metadata =
        extractMetadataFromNextData();

      if (
        metadata &&
        metadata.titleSlug
          .trim()
          .toLowerCase() ===
        requestedSlug
      ) {

        return metadata;
      }

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            intervalMs,
          ),
      );
    }

    throw new Error(
      `LeetCode metadata did not become available for "${requestedSlug}".`,
    );
  }

  /*
   * --------------------------------------------------
   * Read metadata from __NEXT_DATA__
   * --------------------------------------------------
   */

  function extractMetadataFromNextData():
    LeetCodeMetadata | null {

    const script =
      document.getElementById(
        "__NEXT_DATA__",
      );

    if (
      !script?.textContent
    ) {
      return null;
    }

    try {

      const nextData =
        JSON.parse(
          script.textContent,
        );

      const queries =
        nextData
          ?.props
          ?.pageProps
          ?.dehydratedState
          ?.queries;

      if (
        !Array.isArray(
          queries,
        )
      ) {
        return null;
      }

      const questionQuery =
        queries.find(
          (query: any) =>
            Array.isArray(
              query?.queryKey,
            ) &&
            query.queryKey[0] ===
            "questionDetail",
        );

      const question =
        questionQuery
          ?.state
          ?.data
          ?.question;

      if (!question) {
        return null;
      }

      const title =
        typeof question.title ===
          "string"
          ? question.title.trim()
          : "";

      const titleSlug =
        typeof question.titleSlug ===
          "string"
          ? question.titleSlug
            .trim()
            .toLowerCase()
          : "";

      const difficulty =
        typeof question.difficulty ===
          "string"
          ? question.difficulty.trim()
          : "";

      if (
        !title ||
        !titleSlug ||
        !difficulty
      ) {
        return null;
      }

      return {
        title,
        titleSlug,
        difficulty,
      };

    } catch {

      return null;
    }
  }
});