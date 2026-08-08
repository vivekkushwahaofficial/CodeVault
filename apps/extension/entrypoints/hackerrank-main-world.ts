declare global {
  interface Window {
    __codevaultHackerRankInitialized?: boolean;
  }
}

interface HackerRankSubmission {
  id?: number;
  status?: string;
  language?: string;
  code?: string;
  name?: string;
  slug?: string;
  challenge_slug?: string;
  difficulty_name?: string;
  created_at?: string;

  problem_statement?: string;
  input_format?: string;
  constraints?: string;
  output_format?: string;
}

interface HackerRankResponse {
  model?: HackerRankSubmission;
}

interface HackerRankChallengeResponse {
  model?: {
    difficulty_name?: string;
    difficulty_score?: string | number;
    level?: number;
  };
}

export default defineUnlistedScript(() => {
  if (window.__codevaultHackerRankInitialized) {
    console.debug(
      "[CodeVault] HackerRank bridge already initialized.",
    );

    return;
  }

  window.__codevaultHackerRankInitialized = true;

  console.log(
    "[CodeVault] HackerRank MAIN WORLD bridge initialized.",
  );

  const OriginalXHR = XMLHttpRequest;

  const originalOpen =
    OriginalXHR.prototype.open;

  const originalSend =
    OriginalXHR.prototype.send;

  /*
   * Store submission ID -> challenge slug.
   *
   * POST /submissions gives us the submission ID.
   * The later GET /submissions/{id} may not always
   * contain a reliable slug, so we remember it here.
   */
  const submissionSlugs =
    new Map<string, string>();

  OriginalXHR.prototype.open =
    function (
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ) {
      (
        this as XMLHttpRequest & {
          __codevaultMethod?: string;
          __codevaultUrl?: string;
        }
      ).__codevaultMethod =
        method.toUpperCase();

      (
        this as XMLHttpRequest & {
          __codevaultMethod?: string;
          __codevaultUrl?: string;
        }
      ).__codevaultUrl =
        String(url);

      return originalOpen.call(
        this,
        method,
        url,
        async ?? true,
        username,
        password,
      );
    };

  OriginalXHR.prototype.send =
    function (
      body?: Document | XMLHttpRequestBodyInit | null,
    ) {
      const xhr =
        this as XMLHttpRequest & {
          __codevaultMethod?: string;
          __codevaultUrl?: string;
        };

      const method =
        xhr.__codevaultMethod ?? "";

      const url =
        xhr.__codevaultUrl ?? "";

      if (
        !url.includes(
          "/rest/contests/master/challenges/",
        )
      ) {
        return originalSend.call(
          this,
          body,
        );
      }

      xhr.addEventListener(
        "load",
        () => {
          void handleHackerRankResponse(
            method,
            url,
            this,
          );
        },
      );

      return originalSend.call(
        this,
        body,
      );
    };

  async function handleHackerRankResponse(
    method: string,
    url: string,
    xhr: XMLHttpRequest,
  ): Promise<void> {
    if (xhr.status !== 200) {
      return;
    }

    if (!url.includes("/submissions")) {
      return;
    }

    const data =
      parseResponse(xhr);

    if (!data?.model) {
      return;
    }

    const model =
      data.model;

    console.log(
      "[CodeVault] HackerRank XHR:",
      method,
      url,
    );

    console.log(
      "[CodeVault] HackerRank status:",
      model.status,
    );

    /*
     * POST /submissions
     *
     * HackerRank initially returns:
     * status = Processing
     *
     * Save the submission ID and challenge slug.
     */
    if (
      method === "POST" &&
      model.id
    ) {
      const submissionId =
        String(model.id);

      const slug =
        model.slug ??
        model.challenge_slug ??
        "";

      if (slug) {
        submissionSlugs.set(
          submissionId,
          slug,
        );
      }

      console.log(
        "[CodeVault] Submission created:",
        submissionId,
      );

      console.log(
        "[CodeVault] Challenge slug:",
        slug,
      );

      return;
    }

    /*
     * GET /submissions/{id}
     *
     * HackerRank eventually returns:
     * status = Accepted
     */
    if (
      method !== "GET" ||
      !model.id ||
      model.status !== "Accepted"
    ) {
      return;
    }

    const submissionId =
      String(model.id);

    const slug =
      model.slug ??
      model.challenge_slug ??
      submissionSlugs.get(
        submissionId,
      ) ??
      "";

    /*
     * We only process submissions that were
     * created during this page session.
     */
    if (
      !submissionSlugs.has(
        submissionId,
      )
    ) {
      return;
    }

    submissionSlugs.delete(
      submissionId,
    );

    console.log(
      "[CodeVault] HackerRank submission ACCEPTED:",
      submissionId,
    );

    /*
     * Fetch the HackerRank challenge metadata.
     *
     * Example:
     * /rest/contests/master/challenges/java-stdin-and-stdout-1/
     *
     * Response contains:
     * model.difficulty_name = "Easy"
     */
    const difficulty =
      await getChallengeDifficulty(
        slug,
      );

    console.log(
      "[CodeVault] HackerRank difficulty:",
      difficulty,
    );

    window.postMessage(
      {
        type:
          "CODEVAULT_HACKERRANK_SUBMISSION_ACCEPTED",

        submission: {
          id: model.id,

          status:
            model.status,

          language:
            model.language ?? "",

          code:
            model.code ?? "",

          title:
            model.name ?? "",

          slug:
            slug,

          difficulty:
            difficulty ??
            model.difficulty_name ??
            "Unknown",

          url:
            window.location.href,

          solvedAt:
            model.created_at ??
            new Date().toISOString(),

          problemStatement:
            model.problem_statement ??
            "",

          inputFormat:
            model.input_format ??
            "",

          constraints:
            model.constraints ??
            "",

          outputFormat:
            model.output_format ??
            "",
        },
      },
      "*",
    );
  }

  /**
   * Get difficulty from HackerRank challenge API.
   */
  async function getChallengeDifficulty(
    slug: string,
  ): Promise<string | null> {
    if (!slug) {
      console.warn(
        "[CodeVault] HackerRank challenge slug missing.",
      );

      return null;
    }

    const endpoint =
      `/rest/contests/master/challenges/${encodeURIComponent(slug)}/`;

    try {
      console.log(
        "[CodeVault] Fetching challenge metadata:",
        endpoint,
      );

      const response =
        await fetch(endpoint);

      if (!response.ok) {
        console.warn(
          "[CodeVault] Challenge metadata request failed:",
          response.status,
          endpoint,
        );

        return null;
      }

      const data =
        (await response.json()) as HackerRankChallengeResponse;

      const difficulty =
        data.model?.difficulty_name?.trim();

      return difficulty || null;
    } catch (error) {
      console.warn(
        "[CodeVault] Failed to fetch HackerRank difficulty:",
        error,
      );

      return null;
    }
  }

  function parseResponse(
    xhr: XMLHttpRequest,
  ): HackerRankResponse | null {
    try {
      if (
        xhr.responseType === "json" &&
        xhr.response
      ) {
        return xhr.response as HackerRankResponse;
      }

      const text =
        xhr.responseText;

      if (!text) {
        return null;
      }

      return JSON.parse(
        text,
      ) as HackerRankResponse;
    } catch {
      return null;
    }
  }
});