export default defineUnlistedScript(() => {

  console.log(
    "🔥 CodeVault MAIN WORLD LOADED",
  );


  setInterval(() => {

    const models =
      window.monaco?.editor?.getModels();


    if (!models?.length) {
      return;
    }


    const solution =
      models[0]!.getValue();


    console.log(
      "🔥 CodeVault solution found:",
      solution,
    );


    window.postMessage(
      {
        type: "CODEVAULT_SOLUTION",
        solution,
      },
      "*",
    );


  }, 1000);

});