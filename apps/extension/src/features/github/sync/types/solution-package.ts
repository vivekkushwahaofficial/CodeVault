import type { SolutionMetadata } from "../solution-path-generator";

export interface SolutionFile {

  /**
   * Repository path.
   */
  path: string;

  /**
   * File content.
   */
  content: string;

}

export interface SolutionPackage {

  /**
   * Extracted metadata.
   */
  metadata: SolutionMetadata;

  /**
   * Files to upload.
   */
  files: SolutionFile[];

  /**
   * Commit message.
   *
   * Example:
   * feat(leetcode): Add Two Sum
   */
  commitMessage: string;

}