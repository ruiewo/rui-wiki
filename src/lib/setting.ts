export type Setting = {
  title: string;
  subTitle: string;
};

let setting: Setting;

export const settingHandler = {
  initialize,
  get setting() {
    return setting;
  },
};

function initialize(_setting: Setting) {
  setting = _setting;
}
