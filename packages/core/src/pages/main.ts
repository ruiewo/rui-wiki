import { createMain } from "../components/main";
import { createSideMenu } from "../components/sideMenu";
import { RawArticle, articleHandler } from "../lib/articleHandler";
import { Setting, settingHandler } from "../lib/setting";

import "./main.scss";

export const MainPage = {
  load: (appData: AppData) => {
    settingHandler.initialize(appData.setting);
    articleHandler.initialize(appData.articles);

    const app = document.getElementById("app")!;

    const layout = createLayout();

    const main = createMain();
    layout.appendChild(main);

    const sideMenu = createSideMenu();
    layout.appendChild(sideMenu);

    app.appendChild(layout);
  },
};

export type AppData = {
  setting: Setting;
  articles: RawArticle[];
};

function createLayout() {
  const layout = document.createElement("div");
  layout.classList.add("layout");
  return layout;
}
