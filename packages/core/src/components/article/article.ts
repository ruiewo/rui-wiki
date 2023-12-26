import "./article.scss";
import "../../styles/markdown.scss";
import { Article, articleHandler } from "../../lib/articleHandler";
import {
  clearChildren,
  copyToClipboard,
  createIconButton,
  getDateString,
} from "../../lib/util";
import { parse } from "../../lib/parser";
import { getEditor } from "../../plugins/editor";

export const createArticle = async (
  article: Article,
  isEdit: boolean = false
) => {
  const section = document.createElement("section");
  section.classList.add("article");
  section.dataset.id = `${article.id}`;

  if (isEdit) {
    await createEditor(section, article);
  } else {
    await createViewer(section, article);
  }

  return section;
};

async function createViewer(section: HTMLElement, article: Article) {
  const viewer = document.createElement("div");
  viewer.classList.add("viewer");

  const header = document.createElement("header");
  header.classList.add("header");

  const title = document.createElement("h1");
  title.classList.add("title");
  title.textContent = article.title;

  const modified = document.createElement("div");
  modified.classList.add("modified");
  modified.textContent = article.modified;

  const controls = document.createElement("div");
  controls.classList.add("controls");

  const fn = {
    edit: () => {
      createEditor(section, article);
    },
    close: () => {
      removeSection(section);
    },
  };

  (
    [
      ["edit", fn.edit],
      ["close", fn.close],
    ] as const
  ).forEach(([svg, onClick]) =>
    controls.appendChild(createIconButton(svg, onClick))
  );

  const content = document.createElement("div");
  content.classList.add("content");
  content.classList.add("markdown-body");
  content.dataset.theme = "light";
  content.innerHTML = await parse(article.content);

  header.appendChild(controls);
  header.appendChild(title);
  header.appendChild(modified);

  viewer.appendChild(header);
  viewer.appendChild(content);

  clearChildren(section);

  section.appendChild(viewer);

  viewer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("value")) return;

    copyToClipboard(target.textContent);
  });

  viewer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("copyButton")) return;

    copyToClipboard(
      target.closest(".codeBlock")?.querySelector("code")?.textContent
    );
  });
}

async function createEditor(section: HTMLElement, article: Article) {
  const editor = document.createElement("div");
  editor.classList.add("editor");

  editor.addEventListener("keydown", (e: KeyboardEvent) => {
    // ctrl+enter for windows, command+return for mac
    if (
      ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) &&
      e.key === "Enter"
    ) {
      fn.save();
    }
  });

  const header = document.createElement("header");
  header.classList.add("header");

  const editorTitle = document.createElement("h1");
  editorTitle.classList.add("editorTitle");
  editorTitle.textContent = `Draft of '${article.title}'`;

  const controls = document.createElement("div");
  controls.classList.add("controls");

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
      createViewer(section, newArticle);
    },
    delete: () => {
      articleHandler.remove(article.id);
      removeSection(section);
    },
    close: () => {
      createViewer(section, article);
    },
  };

  (
    [
      ["delete", fn.delete],
      ["close", fn.close],
      ["save", fn.save],
    ] as const
  ).forEach(([svg, onClick]) =>
    controls.appendChild(createIconButton(svg, onClick))
  );

  const title = document.createElement("input");
  title.classList.add("title");
  title.type = "text";
  title.value = article.title;

  const contentEditor = await getEditor(article.content, fn);

  header.appendChild(controls);
  header.appendChild(editorTitle);

  editor.appendChild(header);
  editor.appendChild(title);
  editor.appendChild(contentEditor.dom);

  clearChildren(section);

  section.appendChild(editor);
}

function removeSection(section: HTMLElement) {
  section.style.height = `${section.offsetHeight}px`;
  section.classList.add("close");

  setTimeout(() => {
    section.remove();
  }, 500);
}
