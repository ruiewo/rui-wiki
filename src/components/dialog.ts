import { CryptoService } from "../lib/crypto";
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

    if (password) {
      MainPage.load("");
    }
  };
}

export async function showLoginDialog(fragment: string) {
  return new Promise((resolve) => {
    const app = document.getElementById("app")!;

    const html =
      `<div class="dialogContainer">` +
      `<div class="dialog">` +
      `<div class="appIcon"></div>` +
      `<div class="input"><input type="password" id="password" placeholder="Password"></div>` +
      `<button type=""button id="loginButton" class="shrinkButton">Log in</button>` +
      `</div>` +
      `</div>`;

    app.innerHTML = html;

    const loginButton = document.getElementById("loginButton")!;
    loginButton.onclick = async () => {
      const password = (document.getElementById("password") as HTMLInputElement)
        .value;

      if (await CryptoService.checkPassword(password, fragment)) {
        resolve("success");
      } else {
        // flashMessage("Wrong password");
      }
    };
  });
}
