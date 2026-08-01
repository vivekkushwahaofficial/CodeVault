import { GfgAdapter } from "../gfg/gfg-adapter";
import { LeetCodeAdapter } from "../leetcode/leetcode-adapter";
import type { PlatformAdapter } from "../shared/platform-adapter";

/**
 * Creates the appropriate platform adapter
 * based on the current website.
 */
export class PlatformFactory {
  static create(): PlatformAdapter {
    const host = window.location.hostname;

    if (host.includes("leetcode.com")) {
      return new LeetCodeAdapter();
    }

    if (host.includes("geeksforgeeks.org")) {
      return new GfgAdapter();
    }

    throw new Error(`Unsupported platform: ${host}`);
  }
}