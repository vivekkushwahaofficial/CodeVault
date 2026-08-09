import { SOLUTION_MESSAGE } from "../src/features/platforms/leetcode/solution/solution-message";

declare global {
  interface Window {
    __codevaultMainWorldInitialized?: boolean;
  }
}

export default defineUnlistedScript(() => {
  if (window.__codevaultMainWorldInitialized) {
    console.debug(
      "[CodeVault] Main world already initialized.",
    );

    return;
  }

  window.__codevaultMainWorldInitialized = true;

  console.log(
    "🔥 CodeVault MAIN WORLD LOADED",
  );

  window.addEventListener(
    "message",
    async (event) => {
      if (
        event.source !== window ||
        event.data?.type !==
        "CODEVAULT_REQUEST_SOLUTION"
      ) {
        return;
      }

      console.log(
        "🔥 Solution request received",
      );

      let model:
        | ReturnType<
          NonNullable<
            typeof window.monaco
          >["editor"]["getModels"]
        >[number]
        | undefined;

      for (let i = 0; i < 30; i++) {
        model =
          window.monaco?.editor?.getModels()?.[0];

        if (model) {
          break;
        }

        await new Promise<void>(
          (resolve) => {
            setTimeout(resolve, 1000);
          },
        );
      }

      if (!model) {
        console.warn(
          "[CodeVault] Monaco editor model not found.",
        );

        return;
      }

      const solution = model.getValue();

      const language =
        (
          model as unknown as {
            getLanguageId?: () => string;
          }
        ).getLanguageId?.() ?? "";

      console.log(
        "[CodeVault] Monaco language:",
        language,
      );

      window.postMessage(
        {
          type: SOLUTION_MESSAGE,
          solution,
          language,
        },
        "*",
      );
    },
  );
});