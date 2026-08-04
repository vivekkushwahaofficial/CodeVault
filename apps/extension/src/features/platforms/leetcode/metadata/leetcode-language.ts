export function extractLeetCodeLanguage(): string {


  const editor =
    document.querySelector(
      "button[aria-haspopup='listbox']",
    );


  const text =
    editor?.textContent?.trim();



  if(text) {

    return text;

  }



  return "Java";

}