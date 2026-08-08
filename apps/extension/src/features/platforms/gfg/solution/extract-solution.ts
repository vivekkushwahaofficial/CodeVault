/**
 * Extracts the submitted source code from the GFG Ace Editor.
 */
export async function extractSolution(
  document: Document,
): Promise<string> {

  // Find all Ace editors on the page.
  const editors = Array.from(
    document.querySelectorAll(".ace_editor"),
  );

  // Check every Ace editor.
  for (const editor of editors) {

    // Extract each source-code line.
    const lines = Array.from(
      editor.querySelectorAll(".ace_line"),
    ).map(
      (line) => line.textContent ?? "",
    );

    // Join all lines into one source-code string.
    const code = lines.join("\n").trim();

    // Return the first non-empty editor.
    if (code) {

      console.log(
        "[CodeVault] GFG solution extracted:",
        code.length,
        "characters",
      );

      return code;
    }
  }

  // No code was found.
  console.log(
    "[CodeVault] GFG solution not found.",
  );

  return "";
}