import { Article } from "../components/article/article";
import { getDateString } from "./util";

declare global {
  interface HTMLElementEventMap {
    articleAdd: CustomEvent<string>;
  }

  interface HTMLElementEventMap {
    articleRemove: CustomEvent<string>;
  }
}

let articles: Article[];
const eventHandler = document.createElement("div");

export const articleHandler = {
  initialize,
  add,
  remove,
  update,
  search,
  find: (title: string) => articles.find((article) => article.title === title),
  get articles() {
    return articles;
  },
  eventHandler,
};

export const articleEvent = {
  add: "articleAdd",
  remove: "articleRemove",
  update: "articleUpdate",
} as const;

function initialize(_articles: Article[]) {
  articles = _articles;
}

function add() {
  const prefix = "New RuiWiki ";

  let i = 1;

  while (articles.some((article) => article.title === prefix + i)) {
    i++;
  }

  const title = prefix + i;
  const article = {
    title,
    content: "",
    created: getDateString(),
    modified: getDateString(),
  };

  articles.push(article);
  eventHandler.dispatchEvent(
    new CustomEvent(articleEvent.add, { detail: article.title })
  );
}

function remove(title: string) {
  articles = articles.filter((article) => article.title !== title);
  eventHandler.dispatchEvent(
    new CustomEvent(articleEvent.remove, { detail: title })
  );
}

function update(title: string, article: Article) {
  if (title !== article.title) {
    remove(title);
  }

  // todo validate same title

  const target = articles.find((article) => article.title === title);
  if (!target) {
    articles.push(article);
    eventHandler.dispatchEvent(
      new CustomEvent(articleEvent.update, { detail: article.title })
    );
  } else {
    Object.assign(target, article);
    eventHandler.dispatchEvent(
      new CustomEvent(articleEvent.update, { detail: article.title })
    );
  }
}

function search(text: string) {
  if (!text) return articles;

  return articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(text.toLowerCase()) ||
      article.content.toLowerCase().includes(text.toLowerCase())
    );
  });
}
