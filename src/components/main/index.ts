import { articleEvent, articleHandler } from "../../lib/articleHandler";
import { createArticle } from "../article/article";

export function createMain() {
  const main = document.createElement("main");
  main.classList.add("main");

  articleHandler.eventHandler.addEventListener(articleEvent.add, async (e) => {
    const title = e.detail;
    await showArticle(title, true);
  });

  return main;
}

export async function showArticle(title: string, isEdit: boolean = false) {
  const article = articleHandler.articles.find((x) => x.title === title);
  if (!article) return;

  const target = document.querySelector<HTMLElement>(
    `.article[data-title="${article.title}"]`
  );

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const main = document.querySelector(".main")!;
  main.prepend(await createArticle(article, isEdit));
}
