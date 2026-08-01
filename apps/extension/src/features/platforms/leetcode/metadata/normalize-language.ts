export function normalizeLanguage(
  language: string
) {

  const value =
    language.toLowerCase();


  if(value.includes("java"))
    return "Java";


  if(value.includes("python"))
    return "Python";


  if(value.includes("c++"))
    return "Cpp";


  if(value.includes("javascript"))
    return "JavaScript";


  return language;

}