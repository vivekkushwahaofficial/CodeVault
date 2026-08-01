export function extractLeetCodeLanguage(): string {

  const languageButton =
    document.querySelector(
      "button[data-cy='lang-select']"
    );


  if(languageButton?.textContent) {

    return languageButton.textContent.trim();

  }


  const buttons =
    Array.from(
      document.querySelectorAll("button")
    );


  const language =
    buttons.find(
      button =>
        button.textContent?.includes("Java") ||
        button.textContent?.includes("Python") ||
        button.textContent?.includes("C++")
    );


  return (
    language?.textContent?.trim()
    ||
    "Unknown"
  );

}