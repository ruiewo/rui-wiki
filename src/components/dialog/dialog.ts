import { CryptoService } from "../../lib/crypto";
import "./dialog.scss";

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
