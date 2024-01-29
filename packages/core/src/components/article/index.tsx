import { Article } from '../../lib/articleHandler';
import { showViewer } from './viewer';
import { showEditor } from './editor';
import './article.css';
import './markdown.css';

export const createArticle = async (
  article: Article,
  isEdit: boolean = false
) => {
  const section = <section class="article" data-id={article.id} />;

  if (isEdit) {
    await showEditor(section, article);
  } else {
    await showViewer(section, article);
  }

  return section;
};

export function removeSection(section: HTMLElement) {
  section.style.height = `${section.offsetHeight}px`;
  section.classList.add('close');

  setTimeout(() => {
    section.remove();
  }, 500);
}
