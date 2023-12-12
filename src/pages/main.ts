import { createSideMenu } from "../components/sideMenu/sideMenu";

export const MainPage = {
  load: (contents: Contents) => {
    const app = document.getElementById("app")!;

    const layout = createLayout();
    const sidebar = createSideMenu(contents.setting, contents.articles);
    // const contentsDom = createContents();
    layout.appendChild(sidebar);
    // layout.appendChild(contentsDom);

    app.appendChild(layout);
  },
};

type Contents = {
  setting: {
    title: string;
    subTitle: string;
  };
  articles: string[];
};

function createLayout() {
  const layout = document.createElement("div");
  layout.classList.add("layout");
  return layout;
}
