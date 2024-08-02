import { defaultAppData } from '../data';
import { AppData } from '../pages/main';
import {
  checkPassword,
  crypto as defaultCrypto,
  updatePassword,
} from './crypto';

const dataStr = document.getElementById('data')!.textContent!;
const data: Data = JSON.parse(dataStr);

const state = {
  data,
  crypto: defaultCrypto,
};

export const dataHandler = {
  get encryptParams() {
    return data.encryptParams;
  },
  loadAppData: async (): Promise<AppData> => {
    const { appData: appDataRaw } = data;
    const appData = await state.crypto.decrypt(appDataRaw);

    return appData ? JSON.parse(appData) : defaultAppData;
  },
  serializeAppData: async (currentAppData: AppData) => {
    const appData = JSON.stringify(currentAppData);
    data.appData = await state.crypto.encrypt(appData);

    return JSON.stringify(data);
  },
  password: {
    check: async (password: string, encryptParams: EncryptParams) => {
      const crypto = await checkPassword(password, encryptParams);
      if (!crypto) {
        return false;
      }

      state.crypto = crypto;
      return true;
    },
    update: async (password: string) => {
      const { crypto, encryptParams } = await updatePassword(password);
      state.crypto = crypto;
      data.encryptParams = encryptParams;
    },
    clear: () => {
      state.crypto = defaultCrypto;
      data.encryptParams = undefined;
    },
  },
};

export type EncryptParams = {
  salt: string;
  iv: string;
  fragment: string;
};

type Data = {
  encryptParams?: EncryptParams;
  appData: string;
};
