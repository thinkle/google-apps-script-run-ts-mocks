/* Make sure this matches the type in src/code-scanning/types */
export interface GoogleScriptHost {
  close(): void;
  setHeight(height: number): void;
  setWidth(width: number): void;
  editor: {
    focus(): void;
  };
}

export const host: GoogleScriptHost = {
  close() {
    window.alert("Google Apps Script closed!");
  },
  setHeight(number: Number) {
    document.body.style.height = `${number}px`;
  },
  setWidth(number: Number) {
    document.body.style.width = `${number}px`;
  },
  editor: {
    focus() {
      window.alert("Google Apps Script focused the editor!");
    },
  },
};
