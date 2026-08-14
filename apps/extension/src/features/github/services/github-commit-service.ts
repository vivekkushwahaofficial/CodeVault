import { getGithubClient } from "../client/github-client";
import { getGithubSettings } from "../github-auth/github-storage";

import type {
  SolutionPackage,
} from "../sync/types/solution-package";

/**
 * Maximum number of times CodeVault will rebuild
 * the synchronization against a changed branch.
 */
const MAX_SYNC_ATTEMPTS = 3;

/**
 * Maximum number of times CodeVault will retry
 * updating the same GitHub reference.
 *
 * This handles GitHub's temporary ref propagation
 * / non-fast-forward response when the branch has
 * NOT actually changed.
 */
const MAX_REF_UPDATE_ATTEMPTS = 3;

/**
 * GitHub API error shape used for safe error handling.
 */
type GithubApiError = {
  status?: number;
  message?: string;
  response?: {
    data?: {
      message?: string;
      errors?: unknown;
      documentation_url?: string;
    };
  };
};

/**
 * Wait before retrying a GitHub API operation.
 *
 * 500 ms
 * 1000 ms
 * 2000 ms
 */
function waitBeforeRetry(
  attempt: number,
): Promise<void> {

  const delay =
    500 * Math.pow(
      2,
      attempt - 1,
    );

  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        delay,
      );
    },
  );
}

/**
 * Creates one Git commit containing all files
 * from a SolutionPackage.
 *
 * Workflow:
 *
 * 1. Validate GitHub configuration.
 * 2. Create blobs.
 * 3. Read current branch HEAD.
 * 4. Create tree.
 * 5. Create commit.
 * 6. Verify commit parent.
 * 7. Update branch reference.
 *
 * Important:
 *
 * If GitHub rejects updateRef with 422 but the
 * branch has NOT changed, CodeVault retries the
 * SAME commit instead of creating another commit.
 *
 * If the branch HAS changed, CodeVault rebuilds
 * the commit against the latest branch state.
 */
export async function commitSolution(
  solution: SolutionPackage,
): Promise<void> {

  /*
   * --------------------------------------------------
   * 1. Validate GitHub settings.
   * --------------------------------------------------
   */

  const settings =
    await getGithubSettings();

  if (!settings) {
    throw new Error(
      "GitHub settings not found. Please connect GitHub and configure the repository.",
    );
  }

  if (!settings.owner?.trim()) {
    throw new Error(
      "GitHub repository owner is not configured.",
    );
  }

  if (!settings.repo?.trim()) {
    throw new Error(
      "GitHub repository name is not configured.",
    );
  }

  if (!settings.branch?.trim()) {
    throw new Error(
      "GitHub branch is not configured.",
    );
  }

  /*
   * --------------------------------------------------
   * 2. Validate solution package.
   * --------------------------------------------------
   */

  if (
    !solution.files ||
    solution.files.length === 0
  ) {
    throw new Error(
      "No files to commit.",
    );
  }

  if (!solution.commitMessage?.trim()) {
    throw new Error(
      "GitHub commit message is missing.",
    );
  }

  for (const file of solution.files) {

    if (!file.path?.trim()) {
      throw new Error(
        "A file path is missing.",
      );
    }

    if (!file.content?.trim()) {
      throw new Error(
        `File "${file.path}" is empty.`,
      );
    }
  }

  /*
   * --------------------------------------------------
   * 3. Create authenticated GitHub client.
   * --------------------------------------------------
   */

  const github =
    await getGithubClient();

  console.log(
    "================================",
  );

  console.log(
    "📦 Preparing GitHub Commit",
  );

  console.log(
    "Repository:",
    `${settings.owner}/${settings.repo}`,
  );

  console.log(
    "Branch:",
    settings.branch,
  );

  console.log(
    "Commit:",
    solution.commitMessage,
  );

  console.log(
    "Files:",
  );

  for (const file of solution.files) {
    console.log(
      " -",
      file.path,
    );
  }

  console.log(
    "================================",
  );

  /*
   * --------------------------------------------------
   * 4. Create blobs once.
   * --------------------------------------------------
   *
   * Blobs are independent from branch state.
   * They can therefore be reused when a commit
   * needs to be rebuilt.
   */

  const treeEntries: {
    path: string;
    mode: "100644";
    type: "blob";
    sha: string;
  }[] = [];

  for (const file of solution.files) {

    console.log(
      "[GitHub] Creating blob:",
      file.path,
    );

    try {

      const blob =
        await github.git.createBlob({
          owner:
            settings.owner,

          repo:
            settings.repo,

          content:
            file.content,

          encoding:
            "utf-8",
        });

      treeEntries.push({
        path:
          file.path,

        mode:
          "100644",

        type:
          "blob",

        sha:
          blob.data.sha,
      });

    } catch (error) {

      const githubError =
        error as GithubApiError;

      const message =
        githubError.response?.data?.message ??
        githubError.message ??
        "Unknown GitHub error.";

      throw new Error(
        `[GitHub] Failed to prepare file "${file.path}". ${message}`,
      );
    }
  }

  /*
   * --------------------------------------------------
   * 5. Synchronization attempts.
   * --------------------------------------------------
   *
   * Each synchronization attempt represents one
   * complete commit rebuild against a branch HEAD.
   */

  for (
    let syncAttempt = 1;
    syncAttempt <= MAX_SYNC_ATTEMPTS;
    syncAttempt++
  ) {

    console.log(
      `[GitHub] Synchronization attempt ${syncAttempt}/${MAX_SYNC_ATTEMPTS}`,
    );

    /*
     * ------------------------------------------------
     * 5.1 Read current branch HEAD.
     * ------------------------------------------------
     */

    const branchReference =
      await getCurrentBranchReference(
        github,
        settings.owner,
        settings.repo,
        settings.branch,
      );

    const currentCommitSha =
      branchReference.data.object.sha;

    console.log(
      "[GitHub] Current commit:",
      currentCommitSha,
    );

    /*
     * ------------------------------------------------
     * 5.2 Read current commit.
     * ------------------------------------------------
     */

    let currentCommit;

    try {

      currentCommit =
        await github.git.getCommit({
          owner:
            settings.owner,

          repo:
            settings.repo,

          commit_sha:
            currentCommitSha,
        });

    } catch (error) {

      const githubError =
        error as GithubApiError;

      const message =
        githubError.response?.data?.message ??
        githubError.message ??
        "Unknown GitHub error.";

      throw new Error(
        `[GitHub] Failed to read the current repository commit. ${message}`,
      );
    }

    const baseTreeSha =
      currentCommit.data.tree.sha;

    console.log(
      "[GitHub] Base tree:",
      baseTreeSha,
    );

    /*
     * ------------------------------------------------
     * 5.3 Create tree.
     * ------------------------------------------------
     */

    let newTree;

    try {

      newTree =
        await github.git.createTree({
          owner:
            settings.owner,

          repo:
            settings.repo,

          base_tree:
            baseTreeSha,

          tree:
            treeEntries,
        });

    } catch (error) {

      const githubError =
        error as GithubApiError;

      const message =
        githubError.response?.data?.message ??
        githubError.message ??
        "Unknown GitHub error.";

      throw new Error(
        `[GitHub] Failed to create the repository tree. ${message}`,
      );
    }

    console.log(
      "[GitHub] New tree:",
      newTree.data.sha,
    );

    /*
     * ------------------------------------------------
     * 5.4 Create commit.
     * ------------------------------------------------
     */

    let newCommit;

    try {

      newCommit =
        await github.git.createCommit({
          owner:
            settings.owner,

          repo:
            settings.repo,

          message:
            solution.commitMessage,

          tree:
            newTree.data.sha,

          parents: [
            currentCommitSha,
          ],
        });

    } catch (error) {

      const githubError =
        error as GithubApiError;

      const message =
        githubError.response?.data?.message ??
        githubError.message ??
        "Unknown GitHub error.";

      throw new Error(
        `[GitHub] Failed to create commit "${solution.commitMessage}". ${message}`,
      );
    }

    console.log(
      "[GitHub] New commit:",
      newCommit.data.sha,
    );

    /*
     * ------------------------------------------------
     * 5.5 Verify commit parent.
     * ------------------------------------------------
     */

    const parentSha =
      newCommit.data.parents?.[0]?.sha;

    if (
      parentSha !==
      currentCommitSha
    ) {

      throw new Error(
        `[GitHub] Commit parent mismatch. Expected parent "${currentCommitSha}", received "${parentSha ?? "none"}".`,
      );
    }

    console.log(
      "[GitHub] Commit parent verified:",
      parentSha,
    );

    /*
     * ------------------------------------------------
     * 5.6 Update branch reference.
     * ------------------------------------------------
     *
     * IMPORTANT:
     *
     * If updateRef fails because the branch has not
     * changed, retry THIS SAME commit.
     *
     * Do NOT create another commit.
     */

    let rebuildRequired =
      false;

    for (
      let refAttempt = 1;
      refAttempt <= MAX_REF_UPDATE_ATTEMPTS;
      refAttempt++
    ) {

      try {

        console.log(
          `[GitHub] Updating branch "${settings.branch}" to commit ${newCommit.data.sha} (ref attempt ${refAttempt}/${MAX_REF_UPDATE_ATTEMPTS})`,
        );

        await github.git.updateRef({
          owner:
            settings.owner,

          repo:
            settings.repo,

          ref:
            `heads/${settings.branch}`,

          sha:
            newCommit.data.sha,

          /*
           * Never force-update the branch.
           *
           * This protects unrelated repository history.
           */
          force:
            false,
        });

        /*
         * ------------------------------------------------
         * SUCCESS
         * ------------------------------------------------
         */

        console.log(
          "================================",
        );

        console.log(
          "🚀 GitHub commit completed",
        );

        console.log(
          "Commit:",
          solution.commitMessage,
        );

        console.log(
          "Commit SHA:",
          newCommit.data.sha,
        );

        console.log(
          "Files committed:",
          solution.files.length,
        );

        console.log(
          "Synchronization attempt:",
          syncAttempt,
        );

        console.log(
          "Reference update attempt:",
          refAttempt,
        );

        console.log(
          "================================",
        );

        return;

      } catch (error) {

        const githubError =
          error as GithubApiError;

        const status =
          githubError.status;

        const apiMessage =
          githubError.response?.data?.message ??
          githubError.message ??
          "Unknown GitHub error.";

        /*
         * Log useful GitHub information.
         */
        console.error(
          "[GitHub] Branch update failed:",
          {
            status,

            message:
              apiMessage,

            branch:
              settings.branch,

            expectedParent:
              currentCommitSha,

            newCommit:
              newCommit.data.sha,

            errors:
              githubError.response?.data?.errors,

            documentationUrl:
              githubError.response?.data?.documentation_url,
          },
        );

        /*
         * Only 409 and known 422 non-fast-forward
         * errors are candidates for synchronization
         * recovery.
         */
        const isNonFastForward =
          status === 422 &&
          apiMessage
            .toLowerCase()
            .includes(
              "update is not a fast forward",
            );

        const isRetryableConflict =
          status === 409 ||
          isNonFastForward;

        if (!isRetryableConflict) {

          if (status === 401) {
            throw new Error(
              "[GitHub] Authentication failed while updating the repository. Please reconnect GitHub.",
            );
          }

          if (status === 403) {
            throw new Error(
              `[GitHub] Permission denied while updating branch "${settings.branch}". Please make sure the connected GitHub account has write access.`,
            );
          }

          if (status === 404) {
            throw new Error(
              `[GitHub] Branch "${settings.branch}" was not found in repository "${settings.owner}/${settings.repo}".`,
            );
          }

          if (status === 422) {
            throw new Error(
              `[GitHub] GitHub rejected the branch update (422): ${apiMessage}`,
            );
          }

          throw new Error(
            `[GitHub] Failed to update branch "${settings.branch}". ${apiMessage}`,
          );
        }

        /*
         * ------------------------------------------------
         * Check the branch HEAD.
         * ------------------------------------------------
         *
         * This is the critical distinction:
         *
         * SAME HEAD
         *   → retry SAME commit
         *
         * DIFFERENT HEAD
         *   → rebuild synchronization
         */

        const latestBranchReference =
          await getCurrentBranchReference(
            github,
            settings.owner,
            settings.repo,
            settings.branch,
          );

        const latestCommitSha =
          latestBranchReference.data.object.sha;

        console.log(
          "[GitHub] Latest branch commit after conflict:",
          latestCommitSha,
        );

        /*
         * -----------------------------------------------
         * CASE 1:
         *
         * Branch changed.
         *
         * The commit we created is based on an old
         * branch state, so it must be rebuilt.
         * -----------------------------------------------
         */

        if (
          latestCommitSha !==
          currentCommitSha
        ) {

          console.warn(
            `[GitHub] Branch "${settings.branch}" changed from ${currentCommitSha} to ${latestCommitSha}. Rebuilding against the latest branch state.`,
          );

          rebuildRequired =
            true;

          break;
        }

        /*
         * -----------------------------------------------
         * CASE 2:
         *
         * Branch did NOT change.
         *
         * The commit is still based on the correct
         * parent.
         *
         * Do NOT create another commit.
         *
         * Retry updateRef with the SAME commit SHA.
         * -----------------------------------------------
         */

        console.warn(
          `[GitHub] Branch "${settings.branch}" did not change. Retrying the SAME commit ${newCommit.data.sha}.`,
        );

        if (
          refAttempt <
          MAX_REF_UPDATE_ATTEMPTS
        ) {

          await waitBeforeRetry(
            refAttempt,
          );

          continue;
        }

        /*
         * We exhausted reference retries.
         */

        throw new Error(
          `[GitHub] GitHub rejected the branch update after ${MAX_REF_UPDATE_ATTEMPTS} attempts, although branch "${settings.branch}" did not change. Last error: ${apiMessage}`,
        );
      }
    }

    /*
     * ------------------------------------------------
     * 5.7 Rebuild only when the branch actually changed.
     * ------------------------------------------------
     */

    if (rebuildRequired) {

      if (
        syncAttempt >=
        MAX_SYNC_ATTEMPTS
      ) {

        throw new Error(
          `[GitHub] Synchronization could not complete because branch "${settings.branch}" changed repeatedly.`,
        );
      }

      /*
       * Small delay before rebuilding.
       */
      await waitBeforeRetry(
        syncAttempt,
      );

      continue;
    }
  }

  /*
   * This should never be reached.
   */
  throw new Error(
    "[GitHub] Synchronization failed unexpectedly.",
  );
}

/**
 * Reads the current branch reference.
 */
async function getCurrentBranchReference(
  github: Awaited<
    ReturnType<typeof getGithubClient>
  >,
  owner: string,
  repo: string,
  branch: string,
) {

  try {

    return await github.git.getRef({
      owner,

      repo,

      ref:
        `heads/${branch}`,
    });

  } catch (error) {

    throw createGithubReadError(
      error,
      owner,
      repo,
      branch,
    );
  }
}

/**
 * Creates a clear error for GitHub branch reads.
 */
function createGithubReadError(
  error: unknown,
  owner: string,
  repo: string,
  branch: string,
): Error {

  const githubError =
    error as GithubApiError;

  const status =
    githubError.status;

  const message =
    githubError.response?.data?.message ??
    githubError.message ??
    "Unknown GitHub error.";

  if (status === 404) {

    return new Error(
      `[GitHub] Branch "${branch}" was not found in repository "${owner}/${repo}". Please check your repository and branch settings.`,
    );
  }

  if (status === 401) {

    return new Error(
      "[GitHub] Authentication failed while accessing the repository. Please reconnect GitHub.",
    );
  }

  if (status === 403) {

    return new Error(
      `[GitHub] Permission denied for "${owner}/${repo}". Please make sure the connected GitHub account can write to this repository.`,
    );
  }

  return new Error(
    `[GitHub] Failed to read branch "${branch}". ${message}`,
  );
}