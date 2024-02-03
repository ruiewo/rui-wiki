import { Article } from '../../lib/articleHandler';
import { clearChildren } from '../../lib/util';
import { showArticle } from '../main';
import css from './articleList.css?inline';

type ArticleDom = {
  dom: HTMLElement;
  articles: Article[];
};

export class ArticleList extends HTMLElement {
  private domMap = new Map<string, ArticleDom>();
  private list: HTMLElement;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = css;
    this.shadow.appendChild(style);

    this.list = <div />;
    this.shadow.appendChild(this.list);
  }

  init(articles: Article[]) {
    clearChildren(this.list);
    this.domMap.clear();

    const groupMap = new Map<string, Article[]>();
    articles.forEach((article) => {
      const group = getGroup(article);

      if (!groupMap.has(group)) {
        groupMap.set(group, []);
      }

      groupMap.get(group)!.push(article);
    });

    const sorted = [...groupMap].sort((a, b) => (a[0] > b[0] ? 1 : -1));

    sorted.forEach(([group, articles]) => {
      this.updateGroup(group, articles);
    });
  }

  add(article: Article) {
    const group = getGroup(article);
    const articleDom = this.domMap.get(group);

    const articles = articleDom ? [...articleDom.articles, article] : [article];
    this.updateGroup(group, articles);
  }

  delete(article: Article) {
    const group = getGroup(article);
    const articleDom = this.domMap.get(group);
    if (!articleDom) return;

    const articles = articleDom.articles.filter((x) => x.id !== article.id);

    if (articles.length === 0) {
      this.list?.removeChild(articleDom.dom);
      this.domMap.delete(group);
    } else {
      this.updateGroup(group, articles);
    }
  }

  update({ old: oldArticle, new: newArticle }: { old: Article; new: Article }) {
    const oldGroup = getGroup(oldArticle);
    const newGroup = getGroup(newArticle);

    if (oldGroup === newGroup) {
      const articleDom = this.domMap.get(oldGroup);
      if (!articleDom) return;

      const newArticles = articleDom.articles.map((article) =>
        article.id === oldArticle.id ? newArticle : article
      );

      this.updateGroup(oldGroup, newArticles);
    } else {
      this.delete(oldArticle);
      this.add(newArticle);
    }
  }

  private updateGroup(group: string, articles: Article[]) {
    articles = articles.sort((a, b) => (a.modified < b.modified ? 1 : -1));
    const dom = <ListGroup articles={articles} group={group} />;

    const articleDom = this.domMap.get(group);
    if (!articleDom) {
      this.list?.prepend(dom);
    } else {
      this.list?.replaceChild(dom, articleDom.dom);
    }

    this.domMap.set(group, { dom, articles });
  }
}

const ListGroup = ({
  articles,
  group,
}: {
  articles: Article[];
  group: string;
}) => (
  <div>
    <p>{group}</p>
    <div>{...articles.map((article) => <ListItem {...article} />)}</div>
  </div>
);

const ListItem = (article: Article) => (
  <a onclick={() => showArticle(article)}>{article.title}</a>
);

function getGroup(article: Article) {
  return new Date(article.modified)
    .toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-');
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'article-list': Partial<ArticleList>;
    }
  }
}
