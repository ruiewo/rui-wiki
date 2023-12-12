import { showLoginDialog } from "./components/dialog";
import { CryptoService } from "./lib/crypto";
import { MainPage } from "./pages/main";

export async function initialize() {
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
const load = () => {
  const dataStr = document.getElementById("data")!.textContent!;
  return JSON.parse(dataStr) as Data;
};

const defaultSetting = {
  setting: {
    title: "RuiWiki",
    subTitle: "subTitle",
  },
  articles: ["article1", "article2", "article3"],
};
