class DataHandler {
  private _data: Data;

  constructor() {
    const dataStr = document.getElementById("data")!.textContent!;
    this._data = JSON.parse(dataStr) as Data;
  }

  getData() {
    return this._data.appData;
  }

  get data() {
    return this._data;
  }
}

type Data = {
  salt?: string;
  iv?: string;
  fragment?: string;
  appData: string;
};

export const dataHandler = new DataHandler();
