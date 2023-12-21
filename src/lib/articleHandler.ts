import { EventHandler, getDateString } from "./util";

type ArticleEventMap = {
  add: Article;
  delete: { id: Article["id"] };
  update: Article;
};

export type RawArticle = {
  title: string;
  content: string;
  tags?: string;
  created: string;
  modified: string;
};

export type Article = RawArticle & { id: number };

export const articleEvent: { [K in keyof ArticleEventMap]: K } = {
  add: "add",
  delete: "delete",
  update: "update",
} as const;

const eventHandler = new EventHandler<ArticleEventMap>();

const articleMap = new Map<number, Article>();
let lastId = 0;

export const articleHandler = {
  initialize,
  add,
  remove,
  update,
  search,
  get: (id: number) => articleMap.get(id),
  get articles() {
    return [...articleMap.values()]; // todo refactor
  },
  get rawData() {
    return [...articleMap.values()].map(({ id, ...rest }) => rest);
  },
  on: eventHandler.on.bind(eventHandler),
  off: eventHandler.off.bind(eventHandler),
};

function initialize(articles: RawArticle[]) {
  articles.forEach((article, i) => articleMap.set(i, { ...article, id: i }));
  lastId = articles.length - 1;
}

function add() {
  const prefix = "New RuiWiki ";

  let i = 1;

  const set = new Set([...articleMap.values()].map((x) => x.title));
  while (set.has(prefix + i)) {
    i++;
  }

  const title = prefix + i;
  const article: Article = {
    id: ++lastId,
    title,
    content: "",
    created: getDateString(),
    modified: getDateString(),
  };

  articleMap.set(article.id, article);
  eventHandler.emit(articleEvent.add, article);
}

function remove(id: number) {
  articleMap.delete(id);
  eventHandler.emit(articleEvent.delete, { id });
}

function update(article: Article, isImport = false) {
  // todo validate same title

  const target = articleMap.get(article.id);
  if (!target) {
    if (!isImport) {
      throw new Error(`article not found: ${article.id}`);
    }

    articleMap.set(article.id, article);
    eventHandler.emit(articleEvent.update, article);
    return;
  }

  Object.assign(target, article);
  eventHandler.emit(articleEvent.update, target);
}

function search(text: string) {
  const articles = [...articleMap.values()];
  if (!text) return articles;

  return articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(text.toLowerCase()) ||
      article.content.toLowerCase().includes(text.toLowerCase())
    );
  });
}
