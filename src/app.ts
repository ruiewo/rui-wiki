import { createLoginDom } from "./conponents/dialog";
import { Crypto } from "./lib/crypto";

export function initialize() {
  window.ruiwiki = {};

  createLoginDom();
  const password = Crypto.isEncrypted() ? prompt("Enter password")! : undefined;

  Crypto.initialize(password);

  //   const contents = loadContents();

  //   render(contents);
}
