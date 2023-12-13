import { Article } from "../components/article/article";
import { createSideMenu } from "../components/sideMenu/sideMenu";
import { createSvgSymbols } from "../lib/svg";

import "./main.scss";

export const MainPage = {
  load: (contents: Contents) => {
    const app = document.getElementById("app")!;

    createSvgSymbols();

    const layout = createLayout();

    const main = createMain();
    layout.appendChild(main);
    main.textContent = "aaaa";

    const sidebar = createSideMenu(contents.setting, contents.articles);
    layout.appendChild(sidebar);

    app.appendChild(layout);
  },
};

export type Contents = {
  setting: {
    title: string;
    subTitle: string;
  };
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
