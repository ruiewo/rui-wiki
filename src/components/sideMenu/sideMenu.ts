import { appService } from "../../lib/appService";
import { articleEvent, articleHandler } from "../../lib/articleHandler";
import { clearChildren, createIconButton } from "../../lib/util";
import { Article } from "../article/article";
import { flashMessage } from "../flashMessage";
import { showArticle } from "../main";
import "./sideMenu.scss";

export function createSideMenu(setting: any, articles: Article[]) {
  const sideMenu = document.createElement("div");
  sideMenu.classList.add("sideMenu");

  const title = createTitle(setting.title, setting.subTitle);
  sideMenu.appendChild(title);

  const controls = createControls();
  sideMenu.appendChild(controls);

  const searchBox = createSearchBox(articles);
  sideMenu.appendChild(searchBox);

  articleHandler.eventHandler.addEventListener(articleEvent.remove, (e) => {
    const title = e.detail;

    const item = sideMenu.querySelector<HTMLElement>(
      `.item[data-title="${title}"]`
    );

    if (!item) return;

    const itemListWrapper = item.closest<HTMLElement>(".itemListWrapper");
    item.remove();

    if (!itemListWrapper?.querySelector(".item")) {
      itemListWrapper?.remove();
    }
  });

  articleHandler.eventHandler.addEventListener(articleEvent.add, (e) => {
    const title = e.detail;
    const article = articleHandler.find(title);
    if (!article) return;

    const month = article.modified.slice(0, -3);

    const wrapper = sideMenu.querySelector<HTMLElement>(
      `.itemListWrapper[data-month="${month}"]`
    );

    if (wrapper) {
      const itemList = wrapper.querySelector<HTMLElement>(".itemList");
      itemList?.prepend(createItem(article));
    } else {
      const list = sideMenu.querySelector<HTMLElement>(".list");
      list?.prepend(createItemListWrapper([article], month));
    }
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
      ["download", appService.download],
      ["save2", appService.exportData],
      ["setting", appService.importData],
      [
        "lock",
        () => {
          const password = prompt("Enter password");
          if (!password) {
            flashMessage("error", "Password is required");
            return;
          }

          appService.updatePassword(password);
        },
      ],
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
  input.placeholder = "Search";
  searchBox.appendChild(input);

  input.oninput = () => {
    const value = input.value.trim().toLowerCase();
    const articles = articleHandler.search(value);

    clearChildren(list);
    list.appendChild(createArticleList(articles));
    console.log(`${articles.length} articles found`);
  };

  const tabs = document.createElement("details");
  tabs.classList.add("tabs");

  const list = document.createElement("div");
  list.classList.add("list");
  list.onclick = async (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".item");
    if (!item) return;

    showArticle(item.dataset.title!);
  };

  list.appendChild(createArticleList(articles));

  wrapper.appendChild(searchBox);
  wrapper.appendChild(tabs);
  wrapper.appendChild(list);

  return wrapper;
}

function createArticleList(articles: Article[]) {
  const fragment = document.createDocumentFragment();
  const map = new Map<string, Article[]>();
  articles.forEach((article) => {
    const month = article.modified.slice(0, -3);
    const articles = map.get(month) || [];
    articles.push(article);
    map.set(month, articles);
  });

  [...map]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .forEach(([month, articles]) => {
      const itemListWrapper = createItemListWrapper(articles, month);
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

function createItemListWrapper(articles: Article[], month: string) {
  const itemListWrapper = document.createElement("div");
  itemListWrapper.classList.add("itemListWrapper");
  itemListWrapper.dataset.month = month;

  const itemListHeader = document.createElement("div");
  itemListHeader.classList.add("itemListHeader");
  itemListHeader.textContent = month;

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
  item.dataset.title = article.title;

  return item;
}
