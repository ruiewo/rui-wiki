class DataHandler {
  private _data: Data;

  constructor() {
    const dataStr = document.getElementById("data")!.textContent!;
    this._data = JSON.parse(dataStr) as Data;
  }

  getData() {
    return this._data.contents;
  }

  get data() {
    return this._data;
  }
}

type Data = {
  salt?: string;
  iv?: string;
  fragment?: string;
  contents: string;
};

export const dataHandler = new DataHandler();
