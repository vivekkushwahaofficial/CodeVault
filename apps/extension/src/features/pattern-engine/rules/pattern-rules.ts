import type {
  PatternRule,
} from "../types";

/**
 * Pattern detection rules.
 *
 * These rules are intentionally conservative.
 *
 * A pattern is returned only when its score crosses
 * the production threshold in PatternEngine.
 */
export const PATTERN_RULES: PatternRule[] = [

  // --------------------------------------------------
  // Hash Map
  // --------------------------------------------------

  {
    name: "Hash Map",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(hashmap|unordered_map|dictionary|dict|map)\b/
          .test(normalizedSource)
      ) {
        score += 55;
      }

      if (
        /\b(two sum|frequency|frequencies|count occurrences|duplicate|lookup)\b/
          .test(normalizedProblemText)
      ) {
        score += 25;
      }

      if (
        /\.get\(|\.put\(|\.containskey\(|\.contains\(|\[\w+\]/
          .test(normalizedSource)
      ) {
        score += 15;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Two Pointer
  // --------------------------------------------------

  {
    name: "Two Pointer",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(left|right|lo|hi)\b/.test(
          normalizedSource,
        )
      ) {
        score += 20;
      }

      if (
        /\b(two pointer|two pointers|sorted array|pair|opposite ends)\b/
          .test(normalizedProblemText)
      ) {
        score += 45;
      }

      if (
        /while\s*\([^)]*(left|right|lo|hi)[^)]*\)/
          .test(normalizedSource)
      ) {
        score += 25;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Sliding Window
  // --------------------------------------------------

  {
    name: "Sliding Window",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(sliding window|substring|subarray|contiguous)\b/
          .test(normalizedProblemText)
      ) {
        score += 40;
      }

      if (
        /\b(left|right|windowStart|windowEnd)\b/
          .test(normalizedSource)
      ) {
        score += 20;
      }

      if (
        /\bwhile\s*\([^)]*(left|right|window)[^)]*\)/
          .test(normalizedSource)
      ) {
        score += 20;
      }

      if (
        /right\s*(\+\+|\+=)|left\s*(\+\+|\+=)/
          .test(normalizedSource)
      ) {
        score += 20;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Binary Search
  // --------------------------------------------------

  {
    name: "Binary Search",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(binary search|sorted array|sorted list|search efficiently)\b/
          .test(normalizedProblemText)
      ) {
        score += 45;
      }

      if (
        /\b(mid|middle)\b/.test(
          normalizedSource,
        )
      ) {
        score += 20;
      }

      if (
        /left\s*\+\s*\(?right\s*-\s*left\)?\s*\/|lo\s*\+\s*\(?hi\s*-\s*lo\)?\s*\//
          .test(normalizedSource)
      ) {
        score += 25;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Stack
  // --------------------------------------------------

  {
    name: "Stack",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(stack|parentheses|brackets|balanced)\b/
          .test(normalizedProblemText)
      ) {
        score += 45;
      }

      if (
        /\b(stack|deque)\b/.test(
          normalizedSource,
        )
      ) {
        score += 40;
      }

      if (
        /\.push\(|\.pop\(|\.peek\(|\.top\(/.test(
          normalizedSource,
        )
      ) {
        score += 25;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Monotonic Stack
  // --------------------------------------------------

  {
    name: "Monotonic Stack",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(next greater|next smaller|previous greater|previous smaller|monotonic)\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\.pop\(\)/.test(normalizedSource) &&
        /[<>]=?/.test(normalizedSource)
      ) {
        score += 30;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // BFS
  // --------------------------------------------------

  {
    name: "BFS",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(breadth first|bfs|level order|shortest path)\b/
          .test(normalizedProblemText)
      ) {
        score += 50;
      }

      if (
        /\b(queue|deque|linkedlist)\b/
          .test(normalizedSource)
      ) {
        score += 25;
      }

      if (
        /\.offer\(|\.poll\(|\.add\(|\.remove\(/.test(
          normalizedSource,
        )
      ) {
        score += 20;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // DFS
  // --------------------------------------------------

  {
    name: "DFS",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(depth first|dfs|recursive|recursion|backtrack)\b/
          .test(normalizedProblemText)
      ) {
        score += 40;
      }

      if (
        /\bdfs\b|visited/.test(
          normalizedSource,
        )
      ) {
        score += 25;
      }

      if (
        /\bvisited\b/.test(
          normalizedSource,
        )
      ) {
        score += 20;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Dynamic Programming
  // --------------------------------------------------

  {
    name: "Dynamic Programming",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(dynamic programming|dp|memoization|tabulation|subproblem|optimal substructure)\b/
          .test(normalizedProblemText)
      ) {
        score += 50;
      }

      if (
        /\b(dp|memo|memoization|cache)\b/.test(
          normalizedSource,
        )
      ) {
        score += 30;
      }

      if (
        /\bint\[\]\s+(dp|memo)|vector<.*>\s+(dp|memo)/
          .test(normalizedSource)
      ) {
        score += 20;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Greedy
  // --------------------------------------------------

  {
    name: "Greedy",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(greedy|maximum number|minimum number|locally optimal|interval scheduling)\b/
          .test(normalizedProblemText)
      ) {
        score += 50;
      }

      if (
        /\bsort(ed|ing)?\b/.test(
          normalizedSource,
        )
      ) {
        score += 15;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Backtracking
  // --------------------------------------------------

  {
    name: "Backtracking",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(backtracking|permutation|permutations|combination|combinations|subsets|n-queens)\b/
          .test(normalizedProblemText)
      ) {
        score += 45;
      }

      if (
        /\b(backtrack|choose|unchoose)\b/.test(
          normalizedSource,
        )
      ) {
        score += 30;
      }

      if (
        /\brecursive\b|return\s+dfs/.test(
          normalizedSource,
        )
      ) {
        score += 15;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Heap
  // --------------------------------------------------

  {
    name: "Heap",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(heap|priority queue|kth largest|kth smallest|top k)\b/
          .test(normalizedProblemText)
      ) {
        score += 50;
      }

      if (
        /\b(priorityqueue|priority_queue|heapq|heap)\b/
          .test(normalizedSource)
      ) {
        score += 40;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Prefix Sum
  // --------------------------------------------------

  {
    name: "Prefix Sum",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(prefix sum|range sum|subarray sum)\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\b(prefix|prefixsum|preSum|runningSum)\b/
          .test(normalizedSource)
      ) {
        score += 30;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Union Find
  // --------------------------------------------------

  {
    name: "Union Find",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(union find|disjoint set|connected components)\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\b(parent|find|union|rank|size)\b/.test(
          normalizedSource,
        )
      ) {
        score += 15;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Trie
  // --------------------------------------------------

  {
    name: "Trie",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(trie|prefix tree|autocomplete)\b/
          .test(normalizedProblemText)
      ) {
        score += 60;
      }

      if (
        /\b(trienode|trie|children)\b/.test(
          normalizedSource,
        )
      ) {
        score += 25;
      }

      return Math.min(score, 100);
    },
  },

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------

  {
    name: "Sorting",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(sort|sorted|sorting|order)\b/
          .test(normalizedProblemText)
      ) {
        score += 35;
      }

      if (
        /\.sort\(|arrays\.sort|sort\(/.test(
          normalizedSource,
        )
      ) {
        score += 45;
      }

      return Math.min(score, 100);
    },
  },
];