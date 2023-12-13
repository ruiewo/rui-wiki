import { Article } from "../article/article";
import "./sideMenu.scss";

export function createSideMenu(setting: any, articles: Article[]) {
  const sideMenu = document.createElement("div");
  sideMenu.classList.add("sideMenu");

  const title = createTitle(setting.title, setting.subTitle);
  sideMenu.appendChild(title);

  const controls = createControls();
  sideMenu.appendChild(controls);

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
      ["editSvg", () => {}],
      ["addSvg", () => {}],
      ["closeSvg", () => {}],
      ["deleteSvg", () => {}],
      ["downloadSvg", () => {}],
      ["saveSvg", () => {}],
      ["save2Svg", () => {}],
      ["settingSvg", () => {}],
    ] as const
  ).forEach(([svg, onClick]) => {
    const button = createIconButton(svg, onClick);
    controls.appendChild(button);
  });

  return controls;
}

function createIconButton(svg: string, onClick: () => void) {
  const button = document.createElement("button");
  button.innerHTML = `<svg><use href="#${svg}" fill="#4B4B4B"></svg>`;
  button.onclick = onClick;
  return button;
}
