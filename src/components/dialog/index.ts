import { appService } from "../../lib/appService";
import { getSvg } from "../../lib/svg";
import { createElementFromHTML } from "../../lib/util";
import { flashMessage } from "../flashMessage";
import "./index.scss";

export async function showLoginDialog() {
  return new Promise((resolve) => {
    const contentStr = `<div class="input"><input type="password" id="password" placeholder="Password"></div>`;
    const content = createElementFromHTML(contentStr) as HTMLElement;

    const buttons = [
      [
        "Log in",
        async (close: () => void) => {
          const password =
            content.querySelector<HTMLInputElement>("#password")!.value;

          if (await appService.checkPassword(password)) {
            close();
            resolve("success");
          } else {
            flashMessage("error", "Wrong password");
          }
        },
      ] as const,
    ];

    showDialog(content, buttons);
  });
}

function showDialog(
  content: HTMLElement,
  buttons: (readonly [string, (close: () => void) => void | Promise<void>])[]
) {
  const html =
    `<div class="dialogContainer">` +
    `<div class="dialog">` +
    `<div class="appIcon">${getSvg("app")}</div>` +
    `</div>` +
    `</div>`;

  const dialogContainer = createElementFromHTML(html) as HTMLElement;

  const dialog = dialogContainer.querySelector<HTMLElement>(".dialog")!;
  dialog.appendChild(content);

  const close = () => dialogContainer.remove();
  buttons.forEach(([text, onClick]) => {
    const button = document.createElement("button");
    button.classList.add("shrinkButton");
    button.textContent = text;
    button.onclick = () => onClick(close);
    dialog.appendChild(button);
  });

  document.body.appendChild(dialogContainer);
}
