import type {
  TopicRule,
} from "../types";

export const TOPIC_RULES: TopicRule[] = [

  {
    name: "Array",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(array|arrays|subarray|subsequence)\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\[\]|vector<|arraylist|int\[\]|string\[\]/
          .test(normalizedSource)
      ) {
        score += 30;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "String",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(string|strings|substring|character|characters|palindrome)\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\bstring\b|string\.|charAt|substring|length\(\)/
          .test(normalizedSource)
      ) {
        score += 30;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Hashing",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\b(hash|hashing|hashmap|frequency|lookup|dictionary)\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\bhashmap|unordered_map|dictionary|dict|map\b/
          .test(normalizedSource)
      ) {
        score += 35;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Stack",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\bstack|parentheses|brackets\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\bstack|deque\b/.test(
          normalizedSource,
        )
      ) {
        score += 35;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Queue",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\bqueue|breadth first|bfs|level order\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\bqueue|deque|linkedlist\b/
          .test(normalizedSource)
      ) {
        score += 30;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Linked List",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\blinked list|linkedlist|node\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\bnext\b|\bprev\b/.test(
          normalizedSource,
        )
      ) {
        score += 20;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Tree",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\btree|binary tree|traversal|root|leaf\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\btreenode|left|right\b/.test(
          normalizedSource,
        )
      ) {
        score += 20;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Graph",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\bgraph|vertex|vertices|edge|edges|adjacency\b/
          .test(normalizedProblemText)
      ) {
        score += 55;
      }

      if (
        /\badjacency|visited|neighbors|neighbours\b/
          .test(normalizedSource)
      ) {
        score += 25;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Heap",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\bheap|priority queue|kth largest|kth smallest\b/
          .test(normalizedProblemText)
      ) {
        score += 60;
      }

      if (
        /\bpriorityqueue|priority_queue|heapq\b/
          .test(normalizedSource)
      ) {
        score += 30;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Dynamic Programming",

    score: ({ normalizedProblemText, normalizedSource }) => {

      let score = 0;

      if (
        /\bdynamic programming|memoization|tabulation|subproblem\b/
          .test(normalizedProblemText)
      ) {
        score += 65;
      }

      if (
        /\bdp|memo|memoization|tabulation\b/
          .test(normalizedSource)
      ) {
        score += 25;
      }

      return Math.min(score, 100);
    },
  },

  {
    name: "Math",

    score: ({ normalizedProblemText }) => {

      if (
        /\bnumber|integer|prime|factorial|divisor|digit|mathematical|equation|remainder|modulo\b/
          .test(normalizedProblemText)
      ) {
        return 50;
      }

      return 0;
    },
  },
];