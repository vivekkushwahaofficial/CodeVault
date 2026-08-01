export async function extractSolution(
  document: Document
): Promise<string> {

  void document;


  return new Promise((resolve) => {

    const handler = (event: MessageEvent) => {

      if (
        event.data?.type === "CODEVAULT_SOLUTION"
      ) {

        window.removeEventListener(
          "message",
          handler,
        );


        resolve(
          event.data.solution,
        );
      }

    };


    window.addEventListener(
      "message",
      handler,
    );


    setTimeout(() => {

      window.removeEventListener(
        "message",
        handler,
      );

      console.log(
        "CodeVault: Solution extraction timeout",
      );

      resolve("");

    }, 10000);

  });
}