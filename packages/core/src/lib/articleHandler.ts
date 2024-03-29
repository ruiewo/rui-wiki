import { message } from '../components/message';
import { isSystemTag } from './tag';
import { EventHandler, getTimestamp } from './util';

type ArticleEventMap = {
  add: Article;
  delete: Article;
  update: { old: Article; new: Article };
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
  add: 'add',
  delete: 'delete',
  update: 'update',
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
  const prefix = 'New RuiWiki ';

  let i = 1;

  const set = new Set([...articleMap.values()].map((x) => x.title));
  while (set.has(prefix + i)) {
    i++;
  }

  const timestamp = getTimestamp();
  const article: Article = {
    id: ++lastId,
    title: prefix + i,
    content: '',
    created: timestamp,
    modified: timestamp,
  };

  articleMap.set(article.id, article);
  eventHandler.emit(articleEvent.add, article);
}

function remove(article: Article) {
  articleMap.delete(article.id);
  eventHandler.emit(articleEvent.delete, article);
}

function update(
  article: Pick<Article, 'id'> & Partial<Omit<Article, 'id' | 'modified'>>
) {
  const target = articleMap.get(article.id);
  if (!target) {
    throw new Error(`article not found: ${article.id}`);
  }

  const newArticle = { ...target, ...article, modified: getTimestamp() };

  if (
    newArticle.title !== target.title &&
    articleHandler.articles.some((x) => x.title === newArticle.title)
  ) {
    message('error', 'Title already exists.');
    return null;
  }

  articleMap.set(article.id, newArticle);
  eventHandler.emit(articleEvent.update, { old: target, new: newArticle });
  return newArticle;
}

function search(text: string) {
  text = text.trim().toLowerCase();
  const articles = [...articleMap.values()];
  if (!text) return articles;

  return articles.filter((article) => {
    if (isSystemTag(article.tags)) return false;

    return (
      article.title.toLowerCase().includes(text) ||
      article.content.toLowerCase().includes(text)
    );
  });
}
