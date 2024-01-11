import { flashMessage } from "../components/flashMessage";
import { isSystemTag } from "./tag";
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
  import: (article: Article) => {
    articleMap.set(article.id, article);
    eventHandler.emit(articleEvent.add, article);
  },
  search,
  get: (id: number) => articleMap.get(id),
  get articles() {
    return [...articleMap.values()]; // todo refactor
  },
  get rawData() {
    return [...articleMap.values()].map(({ id, ...rest }) => rest);
  },
  on: eventHandler.on,
  off: eventHandler.off,
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

function update(article: Article) {
  const target = articleMap.get(article.id);
  if (!target) {
    throw new Error(`article not found: ${article.id}`);
  }

  if (
    article.title !== target.title &&
    articleHandler.articles.some((x) => x.title === article.title)
  ) {
    flashMessage("error", "Title already exists.");
    return false;
  }

  Object.assign(target, article);
  eventHandler.emit(articleEvent.update, target);
  return true;
}

function search(text: string) {
  const articles = [...articleMap.values()];
  if (!text) return articles;

  return articles.filter((article) => {
    if (isSystemTag(article.tags)) return false;

    return (
      article.title.toLowerCase().includes(text.toLowerCase()) ||
      article.content.toLowerCase().includes(text.toLowerCase())
    );
  });
}
