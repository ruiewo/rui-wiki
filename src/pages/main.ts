import { Article } from "../components/article/article";
import { createSideMenu } from "../components/sideMenu/sideMenu";
import { articleHandler } from "../lib/articleHandler";
import { Setting, settingHandler } from "../lib/setting";
import { createSvgSymbols } from "../lib/svg";

import "./main.scss";

export const MainPage = {
  load: (appData: AppData) => {
    settingHandler.initialize(appData.setting);
    articleHandler.initialize(appData.articles);
    createSvgSymbols();

    const app = document.getElementById("app")!;

    const layout = createLayout();

    const main = createMain();
    layout.appendChild(main);

    const sidebar = createSideMenu(appData.setting, appData.articles);
    layout.appendChild(sidebar);

    app.appendChild(layout);
  },
};

export type AppData = {
  setting: Setting;
  articles: Article[];
};

function createLayout() {
  const layout = document.createElement("div");
  layout.classList.add("layout");
  return layout;
}

function createMain() {
  const main = document.createElement("main");
  main.classList.add("main");
  return main;
}
