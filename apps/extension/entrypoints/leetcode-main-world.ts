import { SOLUTION_MESSAGE } from "../src/features/platforms/leetcode/solution/solution-message";


export default defineUnlistedScript(() => {


  console.log(
    "🔥 CodeVault MAIN WORLD LOADED",
  );



  window.addEventListener(
    "message",
    async (event) => {


      if (
        event.data?.type !==
        "CODEVAULT_REQUEST_SOLUTION"
      ) {

        return;

      }



      console.log(
        "🔥 Solution request received",
      );



      let model;



      for (
        let i = 0;
        i < 30;
        i++
      ) {


        model =
          window.monaco
            ?.editor
            ?.getModels()
            ?.[0];



        if (model) {

          break;

        }



        await new Promise(
          resolve =>
            setTimeout(resolve, 1000),
        );


      }





      const solution =
        model?.getValue() ?? "";



      console.log(
        "🔥 Solution length:",
        solution.length,
      );



      window.postMessage(

        {
          type: SOLUTION_MESSAGE,

          solution,

        },

        "*",

      );


    },
  );


});