import { appEvent, appService } from "../../lib/appService";
import {
  Article,
  articleEvent,
  articleHandler,
} from "../../lib/articleHandler";
import { settingHandler } from "../../lib/setting";
import {
  clearChildren,
  createElementFromHTML,
  createIconButton,
} from "../../lib/util";
import { showArticle } from "../main";
import "./sideMenu.scss";

export function createSideMenu() {
  const setting = settingHandler.setting;
  const articles = articleHandler.articles;

  const sideMenu = document.createElement("div");
  sideMenu.classList.add("sideMenu");

  const title = createTitle(setting.title, setting.subTitle);
  sideMenu.appendChild(title);

  const controls = createControls();
  sideMenu.appendChild(controls);

  const searchBox = createSearchBox(articles);
  sideMenu.appendChild(searchBox);

  articleHandler.on(articleEvent.delete, ({ id }) => {
    const item = sideMenu.querySelector<HTMLElement>(`.item[data-id="${id}"]`);

    if (!item) return;

    const itemListWrapper = item.closest<HTMLElement>(".itemListWrapper");
    item.remove();

    if (!itemListWrapper?.querySelector(".item")) {
      itemListWrapper?.remove();
    }
  });

  function addToList(article: Article) {
    const group = getGroup(article);

    const wrapper = sideMenu.querySelector<HTMLElement>(
      `.itemListWrapper[data-group="${group}"]`
    );

    if (wrapper) {
      const itemList = wrapper.querySelector<HTMLElement>(".itemList");
      itemList?.prepend(createItem(article));
    } else {
      const list = sideMenu.querySelector<HTMLElement>(".list");
      list?.prepend(createItemListWrapper([article], group));
    }
  }

  articleHandler.on(articleEvent.add, addToList);

  articleHandler.on(articleEvent.update, (article) => {
    const item = sideMenu.querySelector<HTMLElement>(
      `.item[data-id="${article.id}"]`
    );

    if (item) {
      item.textContent = article.title;
      return;
    }

    addToList(article);
  });

  articleHandler.on(
    [articleEvent.add, articleEvent.delete, articleEvent.update],
    () => {
      controls
        .querySelectorAll<HTMLElement>(".download, .overwrite")
        ?.forEach((x) => x.classList.add("alert"));
    }
  );

  appService.on(appEvent.save, () => {
    controls
      .querySelectorAll<HTMLElement>(".download, .overwrite")
      ?.forEach((x) => x.classList.remove("alert"));
  });

  return sideMenu;
}

function createTitle(title: string, subTitle: string) {
  const titleDom = document.createElement("div");
  titleDom.classList.add("title");
  titleDom.textContent = title;

  const subTitleDom = document.createElement("div");
  subTitleDom.classList.add("subTitle");
  subTitleDom.textContent = subTitle;

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("titleContainer");
  titleContainer.appendChild(titleDom);
  titleContainer.appendChild(subTitleDom);

  return titleContainer;
}

function createControls() {
  const controls = document.createElement("div");
  controls.classList.add("controls");

  (
    [
      ["add", articleHandler.add],
      ["download", appService.downloadHtml],
      ["overwrite", appService.overwrite],
      ["setting", () => {}],
      ["light", appService.toggleTheme],
      ["lock", appService.updatePassword],
      ["unlock", appService.clearPassword],
    ] as const
  ).forEach(([svg, onClick]) =>
    controls.appendChild(createIconButton(svg, onClick))
  );

  return controls;
}

function createSearchBox(articles: Article[]) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  const searchBox = document.createElement("div");
  searchBox.classList.add("searchBox");

  const input = document.createElement("input");
  input.classList.add("input");
  input.type = "text";
  input.placeholder = "Search";
  searchBox.appendChild(input);

  input.oninput = () => {
    const value = input.value.trim().toLowerCase();
    const articles = articleHandler.search(value);

    clearChildren(list);
    list.appendChild(createArticleList(articles));
    console.log(`${articles.length} articles found`);
  };

  const arr = [
    ["import data", appService.importData],
    ["export data", appService.exportData],
    ["update password", appService.updatePassword],
    ["clear password", appService.clearPassword],
    ["toggle color theme", appService.toggleTheme],
    ["version up", appService.versionUp],
  ] as const;
  const tabs = createElementFromHTML(
    `<details class="tabs"><summary>tools</summary><ul></ul></details>`
  );
  const ul = tabs.querySelector("ul")!;
  arr.forEach(([text, onClick]) => {
    const li = document.createElement("li");
    li.classList.add("selectable");
    li.textContent = text;
    li.onclick = onClick;
    ul.appendChild(li);
  });

  const list = document.createElement("div");
  list.classList.add("list");
  list.onclick = async (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".item");
    if (!item) return;

    const id = parseInt(item.dataset.id!);
    const article = articleHandler.get(id)!;
    showArticle(article);
  };

  list.appendChild(createArticleList(articles));

  wrapper.appendChild(searchBox);
  wrapper.appendChild(tabs);
  wrapper.appendChild(list);

  return wrapper;
}

function getGroup(article: Article) {
  return article.modified;
}

function createArticleList(articles: Article[]) {
  const fragment = document.createDocumentFragment();
  const map = new Map<string, Article[]>();
  articles.forEach((article) => {
    const group = getGroup(article);
    const articles = map.get(group) || [];
    articles.push(article);
    map.set(group, articles);
  });

  [...map]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .forEach(([group, articles]) => {
      const itemListWrapper = createItemListWrapper(articles, group);
      fragment.appendChild(itemListWrapper);
    });

  // sort by title
  // articles
  //   .sort((a, b) => a.title.localeCompare(b.title))
  //   .forEach((article) => {
  //     fragment.appendChild(createItem(article));
  //   });

  return fragment;
}

function createItemListWrapper(articles: Article[], group: string) {
  const itemListWrapper = document.createElement("div");
  itemListWrapper.classList.add("itemListWrapper");
  itemListWrapper.dataset.group = group;

  const itemListHeader = document.createElement("div");
  itemListHeader.classList.add("itemListHeader");
  itemListHeader.textContent = group;

  const itemList = document.createElement("div");
  itemList.classList.add("itemList");

  articles.forEach((article) => {
    itemList.appendChild(createItem(article));
  });

  itemListWrapper.appendChild(itemListHeader);
  itemListWrapper.appendChild(itemList);

  return itemListWrapper;
}

function createItem(article: Article) {
  const item = document.createElement("a");
  item.classList.add("item");
  item.textContent = article.title;
  item.dataset.id = `${article.id}`;

  return item;
}
