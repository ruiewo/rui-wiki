import { appEvent, appService } from '../../lib/appService';
import {
  Article,
  articleEvent,
  articleHandler,
} from '../../lib/articleHandler';
import { settingHandler } from '../../lib/setting';
import { isSystemTag } from '../../lib/tag';
import { clearChildren } from '../../lib/util';
import { IconButton } from '../IconButton';
import { showArticle } from '../main';
import './sideMenu.css';

export function createSideMenu() {
  const setting = settingHandler.setting;
  const articles = articleHandler.articles.filter((x) => !isSystemTag(x.tags));

  const sideMenu = (
    <div class="sideMenu">
      <Title title={setting.title} subTitle={setting.subTitle} />
      <Controls />
      <Tabs />
      <SearchBox articles={articles} />
    </div>
  );

  articleHandler.on(articleEvent.delete, ({ id }) => {
    const item = sideMenu.querySelector<HTMLElement>(`.item[data-id="${id}"]`);
    if (!item) return;

    const itemListWrapper = item.closest<HTMLElement>('.itemListWrapper');
    item.remove();

    if (!itemListWrapper?.querySelector('.item')) {
      itemListWrapper?.remove();
    }
  });

  function addToList(article: Article) {
    const group = getGroup(article);

    const wrapper = sideMenu.querySelector<HTMLElement>(
      `.itemListWrapper[data-group="${group}"]`
    );

    if (wrapper) {
      const itemList = wrapper.querySelector<HTMLElement>('.itemList');
      itemList?.prepend(<ListItem {...article} />);
    } else {
      const list = sideMenu.querySelector<HTMLElement>('.list');
      list?.prepend(<ListGroup articles={[article]} group={group} />);
    }
  }

  articleHandler.on(articleEvent.add, addToList);

  articleHandler.on(articleEvent.update, (article) => {
    const item = sideMenu.querySelector<HTMLElement>(
      `.item[data-id="${article.id}"]`
    );

    if (!item) {
      addToList(article);
      return;
    }

    item.textContent = article.title;

    // todo refactoring. articleの移動ロジックが複雑なのでwrapper単位で再生成する方が良いかも
    const group = getGroup(article);

    const originalWrapper = item.closest<HTMLElement>('.itemListWrapper')!;

    if (group === originalWrapper.dataset.group) {
      item.parentElement?.prepend(item);
      return;
    }

    const moveTargetWrapper = sideMenu.querySelector<HTMLElement>(
      `.itemListWrapper[data-group="${group}"]`
    );
    if (moveTargetWrapper) {
      const itemList =
        moveTargetWrapper.querySelector<HTMLElement>('.itemList');
      itemList?.prepend(item);
    } else {
      const list = sideMenu.querySelector<HTMLElement>('.list');
      list?.prepend(<ListGroup articles={[article]} group={group} />);
      item.remove();
    }

    if (!originalWrapper.querySelector('.item')) {
      originalWrapper.remove();
    }
  });

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
        <Item label="import data" onClick={appService.importData} />
        <Item label="export data" onClick={appService.exportData} />
        <Item label="update password" onClick={appService.updatePassword} />
        <Item label="clear password" onClick={appService.clearPassword} />
        <Item label="toggle color theme" onClick={appService.toggleTheme} />
        <Item label="version up" onClick={appService.versionUp} />
      </ul>
    </details>
  );
};

const SearchBox = ({ articles }: { articles: Article[] }) => {
  const list = <List articles={articles} />;

  const oninput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();
    const articles = articleHandler.search(value);

    clearChildren(list);
    list.appendChild(<ListGroups articles={articles} />);
  };

  return (
    <div class="wrapper">
      <div class="searchBox">
        <input
          class="input"
          type="text"
          placeholder="Search"
          oninput={oninput}
        />
      </div>
      {list}
    </div>
  );
};

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

const List = ({ articles }: { articles: Article[] }) => {
  const onClick = (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.item');
    if (!item) return;

    const id = parseInt(item.dataset.id!);
    const article = articleHandler.get(id)!;
    showArticle(article);
  };

  return (
    <div class="list" onclick={onClick}>
      <ListGroups articles={articles} />
    </div>
  );
};

const ListGroups = ({ articles }: { articles: Article[] }) => {
  const map = new Map<string, Article[]>();
  articles.forEach((article) => {
    const group = getGroup(article);
    const articles = map.get(group) || [];
    articles.push(article);
    map.set(group, articles);
  });

  const sorted = [...map].sort((a, b) => (a[0] < b[0] ? 1 : -1));

  // sort by title
  // articles
  //   .sort((a, b) => a.title.localeCompare(b.title))
  //   .forEach((article) => {
  //     fragment.appendChild(createItem(article));
  //   });

  return (
    <>
      {...sorted.map(([group, articles]) => (
        <ListGroup
          articles={articles.sort((a, b) => (a.modified < b.modified ? 1 : -1))}
          group={group}
        />
      ))}
    </>
  );
};

const ListGroup = ({
  articles,
  group,
}: {
  articles: Article[];
  group: string;
}) => (
  <div class="itemListWrapper" data-group={group}>
    <div class="itemListHeader">{group}</div>
    <div class="itemList">
      {...articles.map((article) => <ListItem {...article} />)}
    </div>
  </div>
);

const ListItem = (article: Article) => (
  <a class="item" data-id={`${article.id}`}>
    {article.title}
  </a>
);
