import { IEditorFactory, EditorUtil } from "@rui-wiki/shared/plugin/editor";
import { dynamicImportJs } from "../lib/loader";

let editor: IEditorFactory | null = null;

export async function getEditor(content: string, fn: EditorUtil) {
  if (editor === null) {
    editor = (await getPluginEditor()) ?? getDefaultEditor();
  }

  return editor.create(content, fn);
}

const myPlugin = {
  init: async () => {
    await dynamicImportJs(
      "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-min-noconflict/ace.min.js"
    );

    return {
      create: (content: string, fn: EditorUtil) => {
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
  },
};

async function getPluginEditor() {
  //   const plugin = window.ruiwiki.plugins.editor;
  const plugin = myPlugin;
  return plugin.init();
}

function getDefaultEditor() {
  const create = (content: string, fn: EditorUtil) => {
    const textarea = document.createElement("textarea");
    textarea.classList.add("content");
    textarea.innerHTML = content;

    function setTextareaHeight() {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 8}px`;
    }
    textarea.addEventListener("input", setTextareaHeight);

    function setSaveShortcut(e: KeyboardEvent) {
      // ctrl+enter for windows, command+return for mac
      if (
        ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) &&
        e.key === "Enter"
      ) {
        fn.save();
      }
    }
    textarea.addEventListener("keydown", setSaveShortcut);

    setTimeout(() => {
      setTextareaHeight(); // todo
    });

    return {
      dom: textarea,
      get value() {
        return textarea.value.trim();
      },
    };
  };

  return {
    create,
  };
}
