import "./article.scss";
import "../../styles/github.scss";
import { contentsHandler } from "../../lib/contentsHandler";
import { clearChildren } from "../../lib/util";
import { parse } from "../../lib/parser";

export type Article = {
  title: string;
  content: string;
  tag?: string;
  createdAt: string;
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

  const createdAt = document.createElement("div");
  createdAt.classList.add("createdAt");
  createdAt.textContent = article.createdAt;

  const controls = document.createElement("div");
  controls.classList.add("controls");

  (
    [
      [
        "editSvg",
        () => {
          createEditor(section, article);
        },
      ],
      ["closeSvg", removeSection],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = `<svg><use href="#${svg}" fill="#4B4B4B"></svg>`;
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
  header.appendChild(createdAt);

  viewer.appendChild(header);
  viewer.appendChild(content);

  clearChildren(section);

  section.appendChild(viewer);
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
        "deleteSvg",
        (e: MouseEvent) => {
          contentsHandler.deleteArticle(article.title);
          removeSection(e);
        },
      ],
      [
        "closeSvg",
        () => {
          createViewer(section, article);
        },
      ],
      [
        "saveSvg",
        () => {
          const newTitle = title.value.trim();
          const newContent = content.value.trim();

          const newArticle = {
            ...article,
            title: newTitle,
            content: newContent,
            createdAt: getDateString(),
          };

          contentsHandler.updateArticle(article.title, newArticle);
          createViewer(section, newArticle);
        },
      ],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = `<svg><use href="#${svg}" fill="#4B4B4B"></svg>`;
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
