const STORAGE_KEY =
  "codevault.sync.fingerprints";

const MAX_FINGERPRINTS = 1000;

/**
 * Generates a deterministic fingerprint
 * for a solution.
 */
export async function generateFingerprint(
  platform: string,
  slug: string,
  sourceCode: string,
): Promise<string> {

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(
      `${platform}|${slug}|${sourceCode}`,
    );

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data,
    );

  return Array
    .from(new Uint8Array(hash))
    .map((byte) =>
      byte.toString(16).padStart(2, "0"),
    )
    .join("");

}

/**
 * Loads all synchronized fingerprints.
 */
async function loadFingerprints(): Promise<Set<string>> {

  const result =
    await browser.storage.local.get(
      STORAGE_KEY,
    );

  return new Set(
    (result[STORAGE_KEY] as string[] | undefined)
      ?? [],
  );

}

/**
 * Returns true if the fingerprint
 * has already been synchronized.
 */
export async function isFingerprintSynced(
  fingerprint: string,
): Promise<boolean> {

  const fingerprints =
    await loadFingerprints();

  return fingerprints.has(
    fingerprint,
  );

}

/**
 * Saves a synchronized fingerprint.
 */
export async function saveFingerprint(
  fingerprint: string,
): Promise<void> {

  const fingerprints =
    await loadFingerprints();

  fingerprints.add(
    fingerprint,
  );

  const values =
    Array.from(fingerprints);

  if (
    values.length >
    MAX_FINGERPRINTS
  ) {

    values.splice(
      0,
      values.length -
        MAX_FINGERPRINTS,
    );

  }

  await browser.storage.local.set({

    [STORAGE_KEY]:
      values,

  });

}

/**
 * Clears all synchronized fingerprints.
 */
export async function clearFingerprints(): Promise<void> {

  await browser.storage.local.remove(
    STORAGE_KEY,
  );

}