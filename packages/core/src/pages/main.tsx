import { message } from '../components/message';
import { Main } from '../components/main';
import { SideMenu } from '../components/sideMenu';
import { RawArticle, articleHandler } from '../lib/articleHandler';
import { Setting, settingHandler } from '../lib/setting';
import { updateAvailable } from '../lib/version';

import './main.css';

export const MainPage = {
  load: async (appData: AppData) => {
    settingHandler.initialize(appData.setting);
    articleHandler.initialize(appData.articles);

    const app = document.getElementById('app')!;

    app.appendChild(
      <div class="layout">
        <Main />
        <SideMenu />
      </div>
    );

    if (await updateAvailable()) {
      message('info', 'A new version of RuiWiki is available.', 10000);
    }
  },
};

export type AppData = {
  setting: Setting;
  articles: RawArticle[];
};
