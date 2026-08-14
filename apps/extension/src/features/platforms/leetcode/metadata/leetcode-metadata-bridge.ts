interface LeetCodeMetadata {
  title: string;
  titleSlug: string;
  difficulty: string;
}

interface MetadataResponse {
  type: "CODEVAULT_METADATA_RESPONSE";
  requestId: string;
  slug: string;
  metadata: LeetCodeMetadata | null;
  error?: string;
}

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Requests metadata for the current LeetCode
 * problem from the page's main world.
 */
export function requestLeetCodeMetadata(
  slug: string,
): Promise<LeetCodeMetadata> {

  const normalizedSlug =
    slug
      .trim()
      .toLowerCase();

  if (!normalizedSlug) {

    return Promise.reject(
      new Error(
        "Cannot request LeetCode metadata without a problem slug.",
      ),
    );
  }

  return new Promise(
    (resolve, reject) => {

      const requestId =
        crypto.randomUUID();

      let timeoutId:
        ReturnType<typeof setTimeout>;

      const cleanup =
        () => {

          window.removeEventListener(
            "message",
            handleMessage,
          );

          clearTimeout(
            timeoutId,
          );
        };

      const handleMessage =
        (event: MessageEvent) => {

          if (
            event.source !==
            window
          ) {
            return;
          }

          const data =
            event.data as
              Partial<MetadataResponse>;

          if (
            data.type !==
            "CODEVAULT_METADATA_RESPONSE"
          ) {
            return;
          }

          if (
            data.requestId !==
            requestId
          ) {
            return;
          }

          cleanup();

          if (
            !data.metadata
          ) {

            reject(
              new Error(
                data.error ??
                  `Failed to retrieve LeetCode metadata for "${normalizedSlug}".`,
              ),
            );

            return;
          }

          const metadata =
            data.metadata;

          if (
            metadata.titleSlug
              .trim()
              .toLowerCase() !==
            normalizedSlug
          ) {

            reject(
              new Error(
                `LeetCode metadata mismatch. Expected "${normalizedSlug}", received "${metadata.titleSlug}".`,
              ),
            );

            return;
          }

          resolve(
            metadata,
          );
        };

      window.addEventListener(
        "message",
        handleMessage,
      );

      timeoutId =
        setTimeout(
          () => {

            cleanup();

            reject(
              new Error(
                `Timed out waiting for LeetCode metadata for "${normalizedSlug}".`,
              ),
            );

          },
          REQUEST_TIMEOUT_MS,
        );

      window.postMessage(
        {
          type:
            "CODEVAULT_REQUEST_METADATA",

          requestId,

          slug:
            normalizedSlug,
        },
        "*",
      );
    },
  );
}