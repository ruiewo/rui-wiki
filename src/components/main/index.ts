import { articleEvent, articleHandler } from "../../lib/articleHandler";
import { createArticle } from "../article/article";

export function createMain() {
  const main = document.createElement("main");
  main.classList.add("main");

  articleHandler.eventHandler.addEventListener(articleEvent.add, async (e) => {
    const article = e.detail;
    main.appendChild(await createArticle(article, true));
  });

  return main;
}

export async function showArticle(title: string) {
  const article = articleHandler.articles.find(
    (article) => article.title === title
  );
  if (!article) return;

  const target = document.querySelector<HTMLElement>(
    `.article[data-title="${article.title}"]`
  );

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const main = document.querySelector(".main")!;
  main.appendChild(await createArticle(article));
}
