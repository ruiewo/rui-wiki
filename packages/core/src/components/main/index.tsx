import {
  Article,
  articleEvent,
  articleHandler,
} from '../../lib/articleHandler';
import { createArticle } from '../article';

export function createMain() {
  const main = <main class="main" />;

  articleHandler.on(articleEvent.add, async (article) => {
    await showArticle(article, true);
  });

  return main;
}

export async function showArticle(article: Article, isEdit: boolean = false) {
  let target = document.querySelector<HTMLElement>(
    `.article[data-id="${article.id}"]`
  );

  if (!target) {
    target = await createArticle(article, isEdit);
    document.querySelector('.main')?.prepend(target);
  }

  target.scrollIntoView({ behavior: 'smooth' });
}
