import { showLoginDialog } from "./components/dialog/dialog";
import { CryptoService } from "./lib/crypto";
import { Contents, MainPage } from "./pages/main";
import "./styles/_common.scss";

async function initialize() {
  const data = load();
  CryptoService.initialize(data.salt, data.iv);
  let contents = data.contents;
  if (data.salt && data.iv && data.fragment) {
    await showLoginDialog(data.fragment);
    contents = await CryptoService.decrypt(contents);
  }

  MainPage.load(contents ? JSON.parse(contents) : defaultSetting);
}

type Data = {
  salt?: string;
  iv?: string;
  fragment?: string;
  contents: string;
};

function load() {
  const dataStr = document.getElementById("data")!.textContent!;
  return JSON.parse(dataStr) as Data;
}

const defaultSetting: Contents = {
  setting: {
    title: "RuiWiki",
    subTitle: "Your Personal Knowledge Base",
  },
  articles: [
    {
      title: "article1",
      content: "content",
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
