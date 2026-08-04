export function normalizeLanguage(
  language: string,
): string {

  const value =
    language
      .trim()
      .toLowerCase();



  if (value.includes("java")) {

    return "java";

  }



  if (value.includes("python")) {

    return "python";

  }



  if (
    value.includes("c++") ||
    value.includes("cpp")
  ) {

    return "cpp";

  }



  if (
    value.includes("javascript") ||
    value.includes("js")
  ) {

    return "javascript";

  }



  if (
    value.includes("typescript") ||
    value.includes("ts")
  ) {

    return "typescript";

  }



  if (value.includes("go")) {

    return "go";

  }



  if (value.includes("rust")) {

    return "rust";

  }



  if (value.includes("c")) {

    return "c";

  }



  return "unknown";

}