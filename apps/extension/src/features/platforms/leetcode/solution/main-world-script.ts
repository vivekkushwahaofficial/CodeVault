import { SOLUTION_MESSAGE } from "./solution-message";

const model = window.monaco?.editor?.getModels()?.[0];

window.postMessage(
  {
    type: SOLUTION_MESSAGE,
    solution: model?.getValue() ?? "",
  },
  "*",
);