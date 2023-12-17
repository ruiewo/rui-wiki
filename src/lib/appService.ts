import { AppData } from "../pages/main";
import { articleHandler } from "./articleHandler";
import { CryptoService } from "./crypto";
import { settingHandler } from "./setting";
import { dataHandler } from "./store";
import { clearChildren } from "./util";

async function download() {
  const html = document.querySelector<HTMLElement>("html")!;
  const myHtml = html.cloneNode(true) as HTMLElement;
  const body = myHtml.querySelector<HTMLElement>("body")!;

  for (const node of [...body.childNodes]) {
    if (!(node instanceof HTMLElement)) {
      node.remove();
      continue;
    }

    if (node.id === "app") {
      clearChildren(node);
      continue;
    }

    if (node.id === "data") {
      node.textContent = await exportData();
      continue;
    }

    node.remove();
  }

  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([myHtml.outerHTML], { type: "text/html" })
  );
  a.download = "index.html";
  a.click();
}

async function exportData() {
  const data = dataHandler.data;
  data.appData = await CryptoService.encrypt(
    JSON.stringify({
      setting: settingHandler.setting,
      articles: articleHandler.articles,
    } satisfies AppData)
  );

  return JSON.stringify(data);
}

async function updatePassword(password: string) {
  const { salt, iv, fragment } = await CryptoService.updatePassword(password);

  dataHandler.data.salt = salt;
  dataHandler.data.iv = iv;
  dataHandler.data.fragment = fragment;
}

export const appService = { download, updatePassword };
