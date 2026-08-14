import { getGithubClient } from "../client/github-client";
import { getGithubSettings } from "../github-auth/github-storage";

import type {
  SolutionPackage,
} from "../sync/types/solution-package";

/**
 * Maximum number of attempts used when the target branch
 * changes while CodeVault is creating the commit.
 *
 * Attempt 1 = normal synchronization.
 * Attempt 2 = retry against the latest branch state.
 */
const MAX_COMMIT_ATTEMPTS = 2;

/**
 * Creates one Git commit containing all files
 * from a SolutionPackage.
 *
 * The operation is optimistic:
 *
 * 1. Read the current branch.
 * 2. Build the tree from that branch.
 * 3. Create a commit whose parent is that branch commit.
 * 4. Move the branch to the new commit.
 *
 * If the branch changes between steps 1 and 4,
 * GitHub may reject the reference update with 422.
 *
 * In that case CodeVault rebuilds the commit against
 * the latest branch state and retries once.
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
   * 2. Validate the solution package.
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

  if (
    !solution.commitMessage?.trim()
  ) {
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
   * Blobs are independent of the branch's current
   * commit, so they can safely be reused if a retry
   * is required.
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

      throw new Error(
        `[GitHub] Failed to prepare file "${file.path}". ${error instanceof Error
          ? error.message
          : "Unknown GitHub error."
        }`,
      );
    }
  }

  /*
   * --------------------------------------------------
   * 5. Attempt synchronization.
   * --------------------------------------------------
   *
   * The complete tree + commit operation is repeated
   * when the branch changes concurrently.
   */

  for (
    let attempt = 1;
    attempt <= MAX_COMMIT_ATTEMPTS;
    attempt++
  ) {

    console.log(
      `[GitHub] Synchronization attempt ${attempt}/${MAX_COMMIT_ATTEMPTS}`,
    );

    /*
     * ------------------------------------------------
     * 5.1 Get the CURRENT branch reference.
     * ------------------------------------------------
     *
     * This is intentionally executed on every retry.
     *
     * We must never reuse a stale branch SHA.
     */

    let branchReference;

    try {

      branchReference =
        await github.git.getRef({
          owner:
            settings.owner,

          repo:
            settings.repo,

          ref:
            `heads/${settings.branch}`,
        });

    } catch (error) {

      const status =
        (
          error as {
            status?: number;
          }
        ).status;

      if (status === 404) {
        throw new Error(
          `[GitHub] Branch "${settings.branch}" was not found in repository "${settings.owner}/${settings.repo}". Please check your repository and branch settings.`,
        );
      }

      if (status === 401) {
        throw new Error(
          "[GitHub] Authentication failed while accessing the repository. Please reconnect GitHub.",
        );
      }

      if (status === 403) {
        throw new Error(
          `[GitHub] Permission denied for "${settings.owner}/${settings.repo}". Please make sure the connected GitHub account can write to this repository.`,
        );
      }

      throw new Error(
        `[GitHub] Failed to read branch "${settings.branch}". ${error instanceof Error
          ? error.message
          : "Unknown GitHub error."
        }`,
      );
    }

    const currentCommitSha =
      branchReference.data.object.sha;

    console.log(
      "[GitHub] Current commit:",
      currentCommitSha,
    );

    /*
     * ------------------------------------------------
     * 5.2 Get the current commit.
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

      const status =
        (
          error as {
            status?: number;
          }
        ).status;

      if (status === 404) {
        throw new Error(
          `[GitHub] The current commit "${currentCommitSha}" could not be found. The repository may have changed while CodeVault was synchronizing.`,
        );
      }

      throw new Error(
        `[GitHub] Failed to read the current repository commit. ${error instanceof Error
          ? error.message
          : "Unknown GitHub error."
        }`,
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
     * 5.3 Create a NEW tree against the latest
     *     branch tree.
     * ------------------------------------------------
     *
     * This must happen again after a conflict.
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

      throw new Error(
        `[GitHub] Failed to create the repository tree. ${error instanceof Error
          ? error.message
          : "Unknown GitHub error."
        }`,
      );
    }

    console.log(
      "[GitHub] New tree:",
      newTree.data.sha,
    );

    /*
     * ------------------------------------------------
     * 5.4 Create a NEW commit whose parent is the
     *     CURRENT branch commit.
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

      throw new Error(
        `[GitHub] Failed to create commit "${solution.commitMessage}". ${error instanceof Error
          ? error.message
          : "Unknown GitHub error."
        }`,
      );
    }

    console.log(
      "[GitHub] New commit:",
      newCommit.data.sha,
    );

    /*
     * ------------------------------------------------
     * 5.5 Move the branch to the new commit.
     * ------------------------------------------------
     */

    try {

      await github.git.updateRef({
        owner:
          settings.owner,

        repo:
          settings.repo,

        ref:
          `heads/${settings.branch}`,

        sha:
          newCommit.data.sha,

        force:
          false,
      });

      /*
       * Branch update succeeded.
       *
       * The complete synchronization is finished.
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
        "Synchronization attempts:",
        attempt,
      );

      console.log(
        "================================",
      );

      return;

    } catch (error) {

      const status =
        (
          error as {
            status?: number;
          }
        ).status;

      /*
       * ------------------------------------------------
       * 5.6 Handle concurrent branch modification.
       * ------------------------------------------------
       *
       * GitHub rejected the update because the branch
       * moved after we read it.
       *
       * Retry the ENTIRE tree/commit construction
       * against the latest branch state.
       */

      if (
        status === 422 &&
        attempt < MAX_COMMIT_ATTEMPTS
      ) {

        console.warn(
          `[GitHub] Branch "${settings.branch}" changed during synchronization. Rebuilding against the latest branch state.`,
        );

        continue;
      }

      /*
       * The retry has already been consumed.
       */

      if (status === 422) {

        throw new Error(
          `[GitHub] The branch "${settings.branch}" changed while CodeVault was synchronizing. The synchronization was retried once but could not be completed safely. Please retry.`,
        );
      }

      if (status === 403) {

        throw new Error(
          `[GitHub] Permission denied while updating branch "${settings.branch}". Please make sure the connected GitHub account has write access.`,
        );
      }

      throw new Error(
        `[GitHub] Failed to update branch "${settings.branch}". ${error instanceof Error
          ? error.message
          : "Unknown GitHub error."
        }`,
      );
    }
  }

  /*
   * This point should never be reached because either
   * the operation returns successfully or throws.
   */
  throw new Error(
    "[GitHub] Synchronization failed unexpectedly.",
  );
}