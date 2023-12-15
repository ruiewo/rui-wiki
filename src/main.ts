import { showLoginDialog } from "./components/dialog/dialog";
import { articleHandler } from "./lib/articleHandler";
import { CryptoService } from "./lib/crypto";
import { settingHandler } from "./lib/setting";
import { dataHandler } from "./lib/store";
import { getFaviconSvg } from "./lib/svg";
import { AppData, MainPage } from "./pages/main";
import "./styles/_common.scss";

async function initialize() {
  setFavicon();

  const data = dataHandler.data;
  CryptoService.initialize(data.salt, data.iv);
  let appData = data.appData;
  if (data.salt && data.iv && data.fragment) {
    await showLoginDialog(data.fragment);
    appData = await CryptoService.decrypt(appData);
  }

  MainPage.load(appData ? JSON.parse(appData) : defaultAppData);
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
  data.appData = await CryptoService.encrypt(
    JSON.stringify({
      setting: settingHandler.setting,
      articles: articleHandler.articles,
    } satisfies AppData)
  );
  return JSON.stringify(data);
}

const defaultAppData: AppData = {
  setting: {
    title: "RuiWiki",
    subTitle: "Your Personal Knowledge Base",
  },
  articles: [
    {
      title: "article1",
      content: "content https://tiddlywiki.com/static/Releases.html",
      tags: "area1",
      created: "2020-01-01",
      modified: "2020-01-01",
    },
    {
      title: "article2",
      content: "# header1\n## header2\n### header3\n content",
      tags: "area1",
      created: "2022-02-02",
      modified: "2022-02-02",
    },
    {
      title: "article3",
      content: `content

\`\`\`kv
key
value
key2
value2
key3
\`\`\`

\`\`\`kv2
key
value
key2
value2
\`\`\`
`,
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "article4",
      content: "content",
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "article5",
      content: "content",
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "article6",
      content: "content",
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
  ],
};

initialize();
