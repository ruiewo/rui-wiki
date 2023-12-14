import { showLoginDialog } from "./components/dialog/dialog";
import { contentsHandler } from "./lib/contentsHandler";
import { CryptoService } from "./lib/crypto";
import { settingHandler } from "./lib/setting";
import { dataHandler } from "./lib/store";
import { getFaviconSvg } from "./lib/svg";
import { Contents, MainPage } from "./pages/main";
import "./styles/_common.scss";

async function initialize() {
  setFavicon();

  const data = dataHandler.data;
  CryptoService.initialize(data.salt, data.iv);
  let contents = data.contents;
  if (data.salt && data.iv && data.fragment) {
    await showLoginDialog(data.fragment);
    contents = await CryptoService.decrypt(contents);
  }

  MainPage.load(contents ? JSON.parse(contents) : defaultContents);
}

function setFavicon() {
  const str = getFaviconSvg("app");
  const dataUrl = "data:image/svg+xml;base64," + btoa(str);

  document.querySelector('link[rel="icon"]')?.setAttribute("href", dataUrl);
  document
    .querySelector('link[rel="apple-touch-icon"]')
    ?.setAttribute("href", dataUrl);
}

export async function exportData() {
  const data = dataHandler.data;
  data.contents = await CryptoService.encrypt(
    JSON.stringify({
      setting: settingHandler.setting,
      articles: contentsHandler.articles,
    } satisfies Contents)
  );
  return JSON.stringify(data);
}

const defaultContents: Contents = {
  setting: {
    title: "RuiWiki",
    subTitle: "Your Personal Knowledge Base",
  },
  articles: [
    {
      title: "article1",
      content: "content https://tiddlywiki.com/static/Releases.html",
      tag: "area1",
      createdAt: "2020-01-01",
    },
    {
      title: "article2",
      content: "# header1\n## header2\n### header3\n content",
      tag: "area1",
      createdAt: "2022-02-02",
    },
    {
      title: "article3",
      content: "content",
      tag: "area2",
      createdAt: "2020-03-03",
    },
    {
      title: "article4",
      content: "content",
      tag: "area2",
      createdAt: "2020-03-03",
    },
    {
      title: "article5",
      content: "content",
      tag: "area2",
      createdAt: "2020-03-03",
    },
    {
      title: "article6",
      content: "content",
      tag: "area2",
      createdAt: "2020-03-03",
    },
  ],
};

initialize();
