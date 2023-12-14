import { Article, createArticle } from "../components/article/article";

declare global {
  interface HTMLElementEventMap {
    contentsDelete: CustomEvent<string>;
  }
}

let articles: Article[];
let eventHandler = document.createElement("div");

export const contentsHandler = {
  initialize,
  showArticle,
  deleteArticle,
  updateArticle,
  get articles() {
    return articles;
  },
  eventHandler,
};

export const contentsEvent = {
  add: "contentsAdd",
  delete: "contentsDelete",
  update: "contentsUpdate",
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
    new CustomEvent(contentsEvent.delete, { detail: title })
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
      new CustomEvent(contentsEvent.add, { detail: article.title })
    );
  } else {
    Object.assign(target, article);
    eventHandler.dispatchEvent(
      new CustomEvent(contentsEvent.update, { detail: article.title })
    );
  }
}
