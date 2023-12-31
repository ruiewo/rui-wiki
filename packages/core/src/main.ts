import { IEditorPlugin, RuiWikiWindow } from "@rui-wiki/shared/src";
import { showLoginDialog } from "./components/dialog";
import { defaultAppData } from "./data";
import { CryptoService } from "./lib/crypto";
import { dataHandler } from "./lib/store";
import { createSvgSymbols, getFaviconSvg } from "./lib/svg";
import { MainPage } from "./pages/main";
import "./styles/_common.scss";

async function initialize() {
  initPlugin();

  setFavicon();
  createSvgSymbols();

  const data = dataHandler.data;
  CryptoService.initialize(data.salt, data.iv);
  let appData = data.appData;
  if (data.salt && data.iv && data.fragment) {
    await showLoginDialog();
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

function isInIframe() {
  return window !== window.parent;
}

function initPlugin() {
  if (!isInIframe()) return;

  const { overwrite, plugins } = (
    window.parent as RuiWikiWindow
  ).ruiwiki.getSettings();

  const defaultOverwrite = async (_html: string) => false;
  window.ruiwiki = {
    pwa: {
      overwrite: overwrite ?? defaultOverwrite,
    },
    // @ts-ignore
    getSettings: undefined,
  };
  middleware.editor = plugins.editor;
}

export const middleware: Middleware = {
  editor: null,
};

type Middleware = {
  editor: IEditorPlugin | null;
};

declare let window: RuiWikiWindow;

initialize();
