import { h } from "../lib/jsxFactory";
import { middleware } from "../main";
import { articleHandler } from "../lib/articleHandler";
import {
  EditorUtil,
  IEditorFactory,
} from "@rui-wiki/shared/src/plugins/editor";
import { loader } from "@rui-wiki/shared/src/plugins/loader";

let editor: IEditorFactory | null = null;

export async function getEditor(content: string, fn: EditorUtil) {
  if (editor === null) {
    editor = (await getPluginEditor()) ?? getDefaultEditor();
  }

  return editor.create(content, fn);
}

async function getPluginEditor() {
  const pluginStr =
    articleHandler.articles.find((x) => x.title === "ruiwiki_plugin_editor")
      ?.content ?? middleware.editor;

  if (!pluginStr) {
    return null;
  }

  const initialize = eval(pluginStr);

  return initialize(loader) as IEditorFactory;
}

function getDefaultEditor() {
  const create = (content: string, _fn: EditorUtil) => {
    const textarea = (
      <textarea class="input content">{content}</textarea>
    ) as HTMLTextAreaElement;

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
