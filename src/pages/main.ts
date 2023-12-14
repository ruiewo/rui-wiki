import { Article } from "../components/article/article";
import { createSideMenu } from "../components/sideMenu/sideMenu";
import { contentsHandler } from "../lib/contentsHandler";
import { Setting, settingHandler } from "../lib/setting";
import { createSvgSymbols } from "../lib/svg";

import "./main.scss";

export const MainPage = {
  load: (contents: Contents) => {
    settingHandler.initialize(contents.setting);
    contentsHandler.initialize(contents.articles);
    createSvgSymbols();

    const app = document.getElementById("app")!;

    const layout = createLayout();

    const main = createMain();
    layout.appendChild(main);

    const sidebar = createSideMenu(contents.setting, contents.articles);
    layout.appendChild(sidebar);

    app.appendChild(layout);
  },
};

export type Contents = {
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
