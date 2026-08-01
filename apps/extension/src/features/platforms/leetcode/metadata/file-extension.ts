export function getFileExtension(language:string){

    const extensions:any = {

        Java: "java",

        Python: "py",

        Cpp: "cpp",

        JavaScript: "js",

        TypeScript: "ts",

        Go: "go",

        Rust: "rs"

    };


    return extensions[language] || "txt";

}