import { appEvent, appService } from '../../lib/appService';
import { articleEvent, articleHandler } from '../../lib/articleHandler';
import { settingHandler } from '../../lib/setting';
import { isSystemTag } from '../../lib/tag';
import { IconButton } from '../IconButton';
import { ArticleList } from './articleList';
import './sideMenu.css';

customElements.define('article-list', ArticleList);

export function SideMenu() {
  const setting = settingHandler.setting;
  const articles = articleHandler.articles.filter((x) => !isSystemTag(x.tags));

  const articleList = (<article-list />) as ArticleList;
  articleList.init(articles);

  const sideMenu = (
    <div class="sideMenu">
      <Title title={setting.title} subTitle={setting.subTitle} />
      <Controls />
      <Tabs />
      <SearchBox
        onChange={(value: string) => {
          const articles = articleHandler.search(value);
          articleList.init(articles);
        }}
      />
      {articleList}
    </div>
  );

  articleHandler.on(articleEvent.delete, (x) => articleList.delete(x));
  articleHandler.on(articleEvent.add, (x) => articleList.add(x));
  articleHandler.on(articleEvent.update, (x) => articleList.update(x));

  articleHandler.on(
    [articleEvent.add, articleEvent.delete, articleEvent.update],
    () => {
      sideMenu
        .querySelectorAll<HTMLElement>(
          '.controls .download, .controls .overwrite'
        )
        ?.forEach((x) => x.classList.add('alert'));
    }
  );

  appService.on(appEvent.save, () => {
    sideMenu
      .querySelectorAll<HTMLElement>(
        '.controls .download, .controls .overwrite'
      )
      ?.forEach((x) => x.classList.remove('alert'));
  });

  return sideMenu;
}

const Title = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div class="titleContainer">
      <div class="title">{title}</div>
      <div class="subTitle">{subTitle}</div>
    </div>
  );
};

const Controls = () => {
  return (
    <div class="controls">
      <IconButton type="add" onClick={articleHandler.add} />
      <IconButton type="download" onClick={appService.downloadHtml} />
      <IconButton type="overwrite" onClick={appService.overwrite} />
      <IconButton type="setting" onClick={() => {}} />
      <IconButton type="light" onClick={appService.toggleTheme} />
      <IconButton type="lock" onClick={appService.updatePassword} />
      <IconButton type="unlock" onClick={appService.clearPassword} />
    </div>
  );
};

const Tabs = () => {
  const Item = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <li class="selectable" onclick={onClick}>
      {label}
    </li>
  );

  return (
    <details class="tabs">
      <summary>tools</summary>
      <ul>
        <Item label="import" onClick={appService.importData} />
        <Item label="export" onClick={appService.exportData} />
        <Item label="set password" onClick={appService.updatePassword} />
        <Item label="clear password" onClick={appService.clearPassword} />
        <Item label="toggle color" onClick={appService.toggleTheme} />
        <Item label="version up" onClick={appService.versionUp} />
      </ul>
    </details>
  );
};

const SearchBox = ({ onChange }: { onChange: (x: string) => void }) => {
  return (
    <div class="searchBox">
      <input
        class="input"
        type="text"
        placeholder="Search"
        oninput={(e) => {
          onChange((e.target as HTMLInputElement).value);
        }}
      />
    </div>
  );
};
