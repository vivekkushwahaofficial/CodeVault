declare global {
  interface Window {
    monaco?: {
      editor: {
        getModels(): {
          getValue(): string;
        }[];
      };
    };
  }
}

export {};