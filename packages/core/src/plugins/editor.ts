import { EditorUtil, IEditorFactory } from "@rui-wiki/shared/src";
import { middleware } from "../main";

let editor: IEditorFactory | null = null;

export async function getEditor(content: string, fn: EditorUtil) {
  if (editor === null) {
    editor = (await getPluginEditor()) ?? getDefaultEditor();
  }

  return editor.create(content, fn);
}

async function getPluginEditor() {
  return middleware.editor?.init(window);
}

function getDefaultEditor() {
  const create = (content: string, _fn: EditorUtil) => {
    const textarea = document.createElement("textarea");
    textarea.classList.add("content");
    textarea.innerHTML = content;

    function setTextareaHeight() {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 8}px`;
    }
    textarea.addEventListener("input", setTextareaHeight);

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
