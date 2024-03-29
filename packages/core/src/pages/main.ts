import { message } from '../components/message';
import { createMain } from '../components/main';
import { createSideMenu } from '../components/sideMenu';
import { RawArticle, articleHandler } from '../lib/articleHandler';
import { Setting, settingHandler } from '../lib/setting';
import { updateAvailable } from '../lib/version';

import './main.css';

export const MainPage = {
  load: async (appData: AppData) => {
    settingHandler.initialize(appData.setting);
    articleHandler.initialize(appData.articles);

    const app = document.getElementById('app')!;

    const layout = createLayout();

    const main = createMain();
    layout.appendChild(main);

    const sideMenu = createSideMenu();
    layout.appendChild(sideMenu);

    app.appendChild(layout);

    if (await updateAvailable()) {
      message('info', 'A new version of RuiWiki is available.', 10000);
    }
  },
};

export type AppData = {
  setting: Setting;
  articles: RawArticle[];
};

function createLayout() {
  const layout = document.createElement('div');
  layout.classList.add('layout');
  return layout;
}
