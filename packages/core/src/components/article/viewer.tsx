import { Article, articleHandler } from '../../lib/articleHandler';
import { IconButton } from '../IconButton';
import { parse } from '../../lib/parser';
import { clearChildren, copyToClipboard } from '../../lib/util';
import { removeSection } from '.';
import { showEditor } from './editor';
import { showArticle } from '../main';

export async function showViewer(section: HTMLElement, article: Article) {
  const fn = {
    edit: () => {
      showEditor(section, article);
    },
    close: () => {
      removeSection(section);
    },
  };

  const controls = (
    <div class="controls">
      <IconButton type="edit" onClick={fn.edit} />
      <IconButton type="close" onClick={fn.close} />
    </div>
  );

  const markdown = <div class="content markdown-body" />;
  markdown.innerHTML = await parse(article.content);

  const viewer = (
    <div class="viewer">
      <header class="header">
        {controls}
        <h1 class="title">{article.title}</h1>
        <div class="modified">
          {new Date(article.modified)
            .toLocaleString('ja-JP', {
              timeZone: 'Asia/Tokyo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
            .replace(/\//g, '-')}
        </div>
      </header>
      {markdown}
    </div>
  );

  viewer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('value')) return;

    copyToClipboard(target.textContent);
  });

  viewer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('copyButton')) return;

    copyToClipboard(
      target.closest('.codeBlock')?.querySelector('code')?.textContent
    );
  });

  viewer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('ruiwikiLink')) return;

    const title = target.textContent!;
    const article = articleHandler.articles.find((x) => x.title === title);
    if (!article) return;
    showArticle(article);
  });

  clearChildren(section);
  section.appendChild(viewer);
}
