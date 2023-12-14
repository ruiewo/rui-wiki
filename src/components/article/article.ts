import { marked } from "marked";
import "./article.scss";
import "../../styles/github.scss";

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

  const wrapper = document.createElement("div");
  wrapper.classList.add("articleWrapper");

  const header = document.createElement("header");
  header.classList.add("articleHeader");

  const title = document.createElement("h1");
  title.classList.add("articleTitle");
  title.textContent = article.title;

  const createdAt = document.createElement("div");
  createdAt.classList.add("articleCreatedAt");
  createdAt.textContent = article.createdAt;

  const controls = document.createElement("div");
  controls.classList.add("articleControls");

  (
    [
      ["editSvg", () => {}],
      [
        "closeSvg",
        (e: MouseEvent) => {
          const section = (e.target as HTMLElement).closest("section");
          const wrapper = (e.target as HTMLElement).closest(".articleWrapper");

          if (!section || !wrapper) return;

          section.style.height = `${section.offsetHeight}px`;
          section.classList.add("close");

          setTimeout(() => {
            section.remove();
          }, 500);
        },
      ],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = `<svg><use href="#${svg}" fill="#4B4B4B"></svg>`;
    button.onclick = onClick;

    controls.appendChild(button);
  });

  const content = document.createElement("div");
  content.classList.add("articleContent");
  content.classList.add("markdown-body");
  content.dataset.theme = "light";
  content.innerHTML = await marked(article.content);

  header.appendChild(controls);
  header.appendChild(title);
  header.appendChild(createdAt);

  wrapper.appendChild(header);
  wrapper.appendChild(content);

  section.appendChild(wrapper);

  return section;
};

async function createEditor(section: HTMLElement, article: Article) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("editorWrapper");

  const header = document.createElement("header");
  header.classList.add("editorHeader");

  const title = document.createElement("h1");
  title.classList.add("editorTitle");
  title.textContent = `Draft of '${article.title}'`;

  const controls = document.createElement("div");
  controls.classList.add("articleControls");

  (
    [
      ["deleteSvg", () => {}],
      ["closeSvg", () => {}],
      ["saveSvg", () => {}],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = `<svg><use href="#${svg}" fill="#4B4B4B"></svg>`;
    button.onclick = onClick;

    controls.appendChild(button);
  });

  const content = document.createElement("textarea");
  content.classList.add("articleContent");
  content.classList.add("markdown-body");
  content.dataset.theme = "light";
  content.innerHTML = await marked(article.content);

  header.appendChild(controls);
  header.appendChild(title);
  header.appendChild(createdAt);

  wrapper.appendChild(header);
  wrapper.appendChild(content);

  section.appendChild(wrapper);
}
