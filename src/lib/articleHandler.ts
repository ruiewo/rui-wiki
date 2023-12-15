import { Article, createArticle } from "../components/article/article";

declare global {
  interface HTMLElementEventMap {
    articleDelete: CustomEvent<string>;
  }
}

let articles: Article[];
let eventHandler = document.createElement("div");

export const articleHandler = {
  initialize,
  showArticle,
  deleteArticle,
  updateArticle,
  get articles() {
    return articles;
  },
  eventHandler,
};

export const articleEvent = {
  add: "articleAdd",
  delete: "articleDelete",
  update: "articleUpdate",
} as const;

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

function deleteArticle(title: string) {
  articles = articles.filter((article) => article.title !== title);
  eventHandler.dispatchEvent(
    new CustomEvent(articleEvent.delete, { detail: title })
  );
}

function updateArticle(title: string, article: Article) {
  if (title !== article.title) {
    deleteArticle(title);
  }

  // todo validate same title

  const target = articles.find((article) => article.title === title);
  if (!target) {
    articles.push(article);
    eventHandler.dispatchEvent(
      new CustomEvent(articleEvent.add, { detail: article.title })
    );
  } else {
    Object.assign(target, article);
    eventHandler.dispatchEvent(
      new CustomEvent(articleEvent.update, { detail: article.title })
    );
  }
}
