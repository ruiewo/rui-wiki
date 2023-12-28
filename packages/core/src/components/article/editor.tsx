import { h } from "../../lib/jsxFactory";
import { Article, articleHandler } from "../../lib/articleHandler";
import { IconButton } from "../IconButton";
import { clearChildren, getDateString } from "../../lib/util";
import { isCtrlKeyHeldDown } from "@rui-wiki/shared/src/key";
import { getEditor } from "../../plugins/editor";
import { showViewer } from "./viewer";
import { removeSection } from ".";

export async function showEditor(section: HTMLElement, article: Article) {
  const fn = {
    save: () => {
      const newTitle = title.value.trim();
      const newContent = contentEditor!.value;

      const newArticle = {
        ...article,
        title: newTitle,
        content: newContent,
        modified: getDateString(),
      };

      articleHandler.update(newArticle);
      showViewer(section, newArticle);
    },
    delete: () => {
      articleHandler.remove(article.id);
      removeSection(section);
    },
    close: () => {
      showViewer(section, article);
    },
  };

  const controls = (
    <div class="controls">
      <IconButton type="delete" onClick={fn.delete} />
      <IconButton type="close" onClick={fn.close} />
      <IconButton type="save" onClick={fn.save} />
    </div>
  );

  const title = (
    <input class="input title" type="text" value={article.title} />
  ) as HTMLInputElement;

  const contentEditor = await getEditor(article.content, fn);

  const editor = (
    <div class="editor">
      <header class="header">
        {controls}
        <h1 class="editorTitle">Draft of '{article.title}'</h1>
      </header>
      {title}
      {contentEditor.dom}
    </div>
  );

  editor.addEventListener("keydown", (e: KeyboardEvent) => {
    if (isCtrlKeyHeldDown(e) && e.key === "Enter") {
      fn.save();
    }
  });

  clearChildren(section);
  section.appendChild(editor);
}
