import { Article, createArticle } from "../components/article/article";

export const contentsHandler = { initialize, showArticle };

let articles: Article[];

function initialize(_articles: Article[]) {
  articles = _articles;
}

async function showArticle(title: string) {
  const article = articles.find((article) => article.title === title);
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
