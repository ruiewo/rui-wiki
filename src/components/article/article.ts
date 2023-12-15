import "./article.scss";
import "../../styles/github.scss";
import { articleHandler } from "../../lib/articleHandler";
import { clearChildren } from "../../lib/util";
import { parse } from "../../lib/parser";
import { getSvg } from "../../lib/svg";

export type Article = {
  title: string;
  content: string;
  tags?: string;
  created: string;
  modified: string;
};

export const createArticle = async (article: Article) => {
  const section = document.createElement("section");
  section.classList.add("article");
  section.dataset.title = article.title;

  createViewer(section, article);

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

  (
    [
      [
        "edit",
        () => {
          createEditor(section, article);
        },
      ],
      ["close", removeSection],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = getSvg(svg);
    button.onclick = onClick;

    controls.appendChild(button);
  });

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

  section.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("value")) return;

    const value = target.textContent;
    if (!value) return;

    navigator.clipboard.writeText(value);
  });
}

async function createEditor(section: HTMLElement, article: Article) {
  const editor = document.createElement("div");
  editor.classList.add("editor");

  const header = document.createElement("header");
  header.classList.add("header");

  const editorTitle = document.createElement("h1");
  editorTitle.classList.add("editorTitle");
  editorTitle.textContent = `Draft of '${article.title}'`;

  const controls = document.createElement("div");
  controls.classList.add("controls");

  (
    [
      [
        "delete",
        (e: MouseEvent) => {
          articleHandler.deleteArticle(article.title);
          removeSection(e);
        },
      ],
      [
        "close",
        () => {
          createViewer(section, article);
        },
      ],
      [
        "save",
        () => {
          const newTitle = title.value.trim();
          const newContent = content.value.trim();

          const newArticle = {
            ...article,
            title: newTitle,
            content: newContent,
            modified: getDateString(),
          };

          articleHandler.updateArticle(article.title, newArticle);
          createViewer(section, newArticle);
        },
      ],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = getSvg(svg);
    button.onclick = onClick;

    controls.appendChild(button);
  });

  const title = document.createElement("input");
  title.classList.add("title");
  title.type = "text";
  title.value = article.title;

  const content = document.createElement("textarea");
  content.classList.add("content");
  content.innerHTML = article.content;

  function setTextareaHeight() {
    content.style.height = "auto";
    content.style.height = `${content.scrollHeight + 4}px`;
  }
  content.addEventListener("input", setTextareaHeight);

  header.appendChild(controls);
  header.appendChild(editorTitle);

  editor.appendChild(header);
  editor.appendChild(title);
  editor.appendChild(content);

  clearChildren(section);

  section.appendChild(editor);
  setTextareaHeight();
}

function removeSection(e: MouseEvent) {
  const section = (e.target as HTMLElement).closest("section");

  if (!section) return;

  section.style.height = `${section.offsetHeight}px`;
  section.classList.add("close");

  setTimeout(() => {
    section.remove();
  }, 500);
}

function getDateString() {
  return new Date().toISOString().slice(0, 10);
}
