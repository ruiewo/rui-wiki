import { EditorUtil } from "./editor";
import { DynamicLoader } from "./loader";

// todo move to plugin generator
export const editorRaw = async ({ dynamicImportJs }: DynamicLoader) => {
  await dynamicImportJs(
    "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-min-noconflict/ace.min.js"
  );
  return {
    create: (content: string, _fn: EditorUtil) => {
      const element = document.createElement("div");

      // @ts-ignore
      const editor = ace.edit(element);

      editor.setOptions({
        maxLines: Infinity,
        copyWithEmptySelection: true,
      });

      editor.setValue(content);

      return {
        dom: element,
        get value() {
          return editor.getValue();
        },
      };
    },
  };
};

const editor = `
async ({ dynamicImportJs, dynamicImportCss }) => {
  await dynamicImportJs(
    "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-min-noconflict/ace.min.js"
  );
  return {
    create: (content, _fn) => {
      const element = document.createElement("div");

      const editor = ace.edit(element);

      editor.setOptions({
        maxLines: Infinity,
        copyWithEmptySelection: true,
      });

      editor.setValue(content);

      return {
        dom: element,
        get value() {
          return editor.getValue();
        },
      };
    },
  };
};
`;

export default editor;
