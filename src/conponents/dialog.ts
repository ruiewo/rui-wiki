import { MainPage } from "../pages/main";
import "./dialog.scss";

const root = document.getElementById("app")!;

export function createLoginDom() {
  const html =
    `<div class="dialogContainer">` +
    `<div class="dialog">` +
    `<div class="appIcon"></div>` +
    `<div class="input"><input type="password" id="password" placeholder="Password"></div>` +
    `<button type=""button id="loginButton" class="shrinkButton">Log in</button>` +
    `</div>` +
    `</div>`;

  root.innerHTML = html;

  const loginButton = document.getElementById("loginButton")!;
  loginButton.onclick = () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    // const succeed = authApi.login(name, password);
    // if (!succeed) {
    //   console.log("login failed.");
    // }

    if (password) {
      MainPage.load("");
    }
  };

  // todo remove
  // (document.getElementById("nameInput") as HTMLInputElement).value = "Owner";
  // (document.getElementById("passwordInput") as HTMLInputElement).value =
  //   "b2OWNNU|ED9F";
}
