import { Article } from "../components/article/article";
import { EventHandler, getDateString } from "./util";

type ArticleEventMap = {
  add: { title: string };
  delete: { title: string };
  update: { title: string };
};

export const articleEvent: { [K in keyof ArticleEventMap]: K } = {
  add: "add",
  delete: "delete",
  update: "update",
} as const;

const eventHandler = new EventHandler<ArticleEventMap>();

let articles: Article[];

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
  on: eventHandler.on.bind(eventHandler),
  off: eventHandler.off.bind(eventHandler),
};

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

  eventHandler.emit(articleEvent.add, { title: article.title });
}

function remove(title: string) {
  articles = articles.filter((article) => article.title !== title);
  eventHandler.emit(articleEvent.delete, { title });
}

function update(title: string, article: Article) {
  if (title !== article.title) {
    remove(title);
  }

  // todo validate same title

  const target = articles.find((article) => article.title === title);
  if (!target) {
    articles.push(article);
    eventHandler.emit(articleEvent.update, { title });
  } else {
    Object.assign(target, article);
    eventHandler.emit(articleEvent.update, { title });
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
