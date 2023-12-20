import { Article } from "../components/article/article";
import { flashMessage } from "../components/flashMessage";
import { AppData } from "../pages/main";
import { articleHandler } from "./articleHandler";
import { CryptoService } from "./crypto";
import { settingHandler } from "./setting";
import { dataHandler } from "./store";
import {
  EventHandler,
  assertExist,
  clearChildren,
  downloadHtml,
  downloadJson,
} from "./util";

type EventMap = {
  save: undefined;
};

export const articleEvent: { [K in keyof EventMap]: K } = {
  save: "save",
} as const;

const eventHandler = new EventHandler<EventMap>();

export const appEvent = {
  save: "save",
} as const;

async function getHtml() {
  const html = document.querySelector<HTMLElement>("html")!;
  const newHtml = html.cloneNode(true) as HTMLElement;
  const body = newHtml.querySelector<HTMLElement>("body")!;

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
      node.textContent = await getUserData();
      continue;
    }

    node.remove();
  }

  return newHtml.outerHTML;
}

async function download() {
  downloadHtml(await getHtml(), "RuiWiki.html");
  eventHandler.emit(appEvent.save, undefined);
}

async function exportData() {
  downloadJson(JSON.stringify(articleHandler.articles), "RuiWiki.json");
}

async function importData() {
  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".json";

  file.onchange = async () => {
    if (!file.files || !file.files[0]) return;
    const json = await file.files[0].text();
    const articles = JSON.parse(json) as Article[];

    articleHandler.articles.forEach((x) => articleHandler.remove(x.title));
    articles.forEach((x) => articleHandler.update(x.title, x));
  };

  file.click();
}

// async function importDataFromTiddlyWiki() {
//   // FIXME: this is for tiddly wiki data.
//   const file = document.createElement("input");
//   file.type = "file";
//   file.accept = ".json";

//   // convert yyyymmddhhssfff to yyyy-mm-dd
//   function convertDateFormat(dateStr: string) {
//     const year = dateStr.substring(0, 4);
//     const month = dateStr.substring(4, 6);
//     const day = dateStr.substring(6, 8);
//     return `${year}-${month}-${day}`;
//   }

//   file.onchange = async () => {
//     if (!file.files || !file.files[0]) return;
//     const json = await file.files[0].text();
//     const articles = JSON.parse(json) as any[];
//     const converted = articles.map((x) => ({
//       title: x.title ?? "",
//       content: x.text ?? "",
//       tags: x.tags,
//       created: convertDateFormat(x.created),
//       modified: convertDateFormat(x.modified),
//     }));

//     articleHandler.articles.forEach((x) => articleHandler.remove(x.title));
//     converted.forEach((x) => articleHandler.update(x.title, x));
//   };

//   file.click();
// }

async function getUserData() {
  const data = dataHandler.data;
  data.appData = await CryptoService.encrypt(
    JSON.stringify({
      setting: settingHandler.setting,
      articles: articleHandler.articles,
    } satisfies AppData)
  );

  return JSON.stringify(data);
}

async function checkPassword(password: string) {
  assertExist(dataHandler.data.fragment);
  return await CryptoService.checkPassword(password, dataHandler.data.fragment);
}

async function updatePassword(password: string) {
  const { salt, iv, fragment } = await CryptoService.updatePassword(password);

  dataHandler.data.salt = salt;
  dataHandler.data.iv = iv;
  dataHandler.data.fragment = fragment;

  flashMessage("success", "Password updated");
}

function clearPassword() {
  const { salt, iv, fragment } = CryptoService.clearPassword();

  dataHandler.data.salt = salt;
  dataHandler.data.iv = iv;
  dataHandler.data.fragment = fragment;

  flashMessage("success", "Password cleared");
}

export const appService = {
  download,
  exportData,
  importData,
  checkPassword,
  updatePassword,
  clearPassword,
  on: eventHandler.on.bind(eventHandler),
  off: eventHandler.off.bind(eventHandler),

  // pwa
  overwrite: async () => {
    const html = await getHtml();
    const succeed = await window.ruiwiki.pwa.overwrite(html);

    if (succeed) {
      eventHandler.emit(appEvent.save, undefined);
      flashMessage("info", "Overwritten!");
    } else {
      flashMessage("error", "Failed to overwrite");
    }
  },
};

export interface RuiWikiWindow extends Window {
  ruiwiki: {
    pwa: { overwrite: (html: string) => Promise<boolean> };
  };
}

declare let window: RuiWikiWindow;

window.ruiwiki = {
  //** need to implement in pwa app */
  pwa: {
    overwrite: async (_: string) => false,
  },
};
