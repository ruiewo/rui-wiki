import { Article } from "../components/article/article";
import { createMain } from "../components/main";
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

    const sideMenu = createSideMenu(appData.setting, appData.articles);
    layout.appendChild(sideMenu);

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
