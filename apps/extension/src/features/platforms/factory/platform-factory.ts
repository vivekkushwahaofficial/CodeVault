import { GfgAdapter } from "../gfg/gfg-adapter";
import { HackerRankAdapter } from "../hackerrank/hackerrank-adapter";
import { LeetCodeAdapter } from "../leetcode/leetcode-adapter";
import type { PlatformAdapter } from "../shared/platform-adapter";

export class PlatformFactory {
  static create(): PlatformAdapter {
    const host = window.location.hostname;

    if (host.includes("leetcode.com")) {
      return new LeetCodeAdapter();
    }

    if (host.includes("geeksforgeeks.org")) {
      return new GfgAdapter();
    }

    if (host.includes("hackerrank.com")) {
      return new HackerRankAdapter();
    }

    throw new Error(`Unsupported platform: ${host}`);
  }
}