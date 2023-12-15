import { appService } from "../../lib/appService";
import { articleEvent, articleHandler } from "../../lib/articleHandler";
import { getSvg } from "../../lib/svg";
import { Article } from "../article/article";
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

  articleHandler.eventHandler.addEventListener(articleEvent.delete, (e) => {
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
      ["edit", () => {}],
      ["add", () => {}],
      ["close", () => {}],
      ["delete", () => {}],
      ["download", appService.download],
      ["save", () => {}],
      ["save2", () => {}],
      ["setting", () => {}],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = document.createElement("button");
    button.innerHTML = getSvg(svg);
    button.onclick = onClick;

    controls.appendChild(button);
  });

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

  const tabs = document.createElement("details");
  tabs.classList.add("tabs");

  const list = document.createElement("div");
  list.classList.add("list");
  list.onclick = async (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(".item");
    if (!item) return;

    await articleHandler.showArticle(item.dataset.title!);
  };

  const map = new Map<string, Article[]>();
  articles.forEach((article) => {
    const month = article.created.slice(0, -3);
    const articles = map.get(month) || [];
    articles.push(article);
    map.set(month, articles);
  });

  map.forEach((articles, month) => {
    const itemListWrapper = document.createElement("div");
    itemListWrapper.classList.add("itemListWrapper");

    const itemListHeader = document.createElement("div");
    itemListHeader.classList.add("itemListHeader");
    itemListHeader.textContent = month;

    const itemList = document.createElement("div");
    itemList.classList.add("itemList");

    articles.forEach((article) => {
      const item = document.createElement("a");
      item.classList.add("item");
      item.textContent = article.title;
      item.dataset.title = article.title;
      itemList.appendChild(item);
    });

    itemListWrapper.appendChild(itemListHeader);
    itemListWrapper.appendChild(itemList);
    list.appendChild(itemListWrapper);
  });

  wrapper.appendChild(searchBox);
  wrapper.appendChild(tabs);
  wrapper.appendChild(list);

  return wrapper;
}
