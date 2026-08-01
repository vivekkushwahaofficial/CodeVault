export function cleanSolution(code: string): string {

  return code
    .replace(/^class Solution\s*{/m, "")
    .replace(/}\s*$/m, "")
    .trim();

}