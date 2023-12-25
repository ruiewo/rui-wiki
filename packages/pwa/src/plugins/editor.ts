import {
  EditorUtil,
  IEditorPlugin,
  dynamicImportJs,
} from "@rui-wiki/shared/src";

export const editor: IEditorPlugin = {
  init: async function (window) {
    await dynamicImportJs(
      "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-min-noconflict/ace.min.js",
      window
    );
    return {
      create: (content: string, _fn: EditorUtil) => {
        const element = window.document.createElement("div");

        // @ts-ignore
        const editor = window.ace.edit(element);

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
  },
};
