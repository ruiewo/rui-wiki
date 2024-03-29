import { message } from '../components/message';
import { appUrl } from '../const';
import { AppData } from '../pages/main';
import { RawArticle, articleHandler } from './articleHandler';
import { CryptoService } from './crypto';
import { settingHandler } from './setting';
import { dataHandler } from './store';
import { EventHandler, assertExist, clearChildren, download } from './util';
import { RuiWikiWindow } from '@rui-wiki/shared/src/window';

declare let window: RuiWikiWindow;

type EventMap = {
  save: undefined;
};

export const appEvent: { [K in keyof EventMap]: K } = {
  save: 'save',
} as const;

const eventHandler = new EventHandler<EventMap>();

async function getHtml(doc = document) {
  const html = doc.querySelector<HTMLElement>('html')!;
  const newHtml = html.cloneNode(true) as HTMLElement;
  const body = newHtml.querySelector<HTMLElement>('body')!;

  for (const node of [...body.childNodes]) {
    if (!(node instanceof HTMLElement)) {
      node.remove();
      continue;
    }

    if (node.id === 'app') {
      clearChildren(node);
      continue;
    }

    if (node.id === 'data') {
      node.textContent = await getUserData();
      continue;
    }

    node.remove();
  }

  return newHtml.outerHTML;
}

async function downloadHtml() {
  download(await getHtml(), getFileName(), 'html');
  eventHandler.emit(appEvent.save, undefined);
}

async function exportData() {
  download(JSON.stringify(articleHandler.rawData), getFileName(), 'json');
}

async function importData() {
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = '.json';

  file.onchange = async () => {
    if (!file.files || !file.files[0]) return;
    const json = await file.files[0].text();
    const articles = JSON.parse(json) as RawArticle[];

    articleHandler.articles.forEach(articleHandler.remove);
    articles.forEach((x, i) => articleHandler.import({ ...x, id: i }));
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
      articles: articleHandler.rawData,
    } satisfies AppData)
  );

  return JSON.stringify(data);
}

async function checkPassword(password: string) {
  assertExist(dataHandler.data.fragment);
  return await CryptoService.checkPassword(password, dataHandler.data.fragment);
}

async function updatePassword() {
  const password = prompt('Enter password');
  if (!password) {
    message('error', 'Password is required');
    return;
  }

  const { salt, iv, fragment } = await CryptoService.updatePassword(password);

  dataHandler.data.salt = salt;
  dataHandler.data.iv = iv;
  dataHandler.data.fragment = fragment;

  message('success', 'Password updated');
}

function clearPassword() {
  const { salt, iv, fragment } = CryptoService.clearPassword();

  dataHandler.data.salt = salt;
  dataHandler.data.iv = iv;
  dataHandler.data.fragment = fragment;

  message('success', 'Password cleared');
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

async function versionUp() {
  const response = await fetch(appUrl);

  const doc = new DOMParser().parseFromString(
    await response.text(),
    'text/html'
  );

  download(await getHtml(doc), getFileName(), 'html');
}

function getFileName() {
  const fileName = window.location.pathname.split('/').pop() ?? '';
  return fileName.endsWith('.html')
    ? fileName.replace(/\.html$/, '')
    : 'RuiWiki';
}

export const appService = {
  downloadHtml,
  exportData,
  importData,
  checkPassword,
  updatePassword,
  clearPassword,
  toggleTheme,
  versionUp,
  on: eventHandler.on,
  off: eventHandler.off,

  // pwa
  overwrite: async () => {
    const html = await getHtml();
    const succeed = await window.ruiwiki.pwa.overwrite(html);

    if (succeed) {
      eventHandler.emit(appEvent.save, undefined);
      message('info', 'file saved');
    } else {
      message('error', 'Failed to save file');
    }
  },
};
