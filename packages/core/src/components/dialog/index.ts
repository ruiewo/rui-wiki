import { appService } from "../../lib/appService";
import { getSvg } from "../../lib/svg";
import { createElementFromHTML } from "../../lib/util";
import { flashMessage } from "../flashMessage";
import "./index.scss";

export async function showLoginDialog() {
  return new Promise((resolve) => {
    const contentStr = `<div><input type="password" id="password" class="input" placeholder="Password"></div>`;
    const content = createElementFromHTML(contentStr);

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

    const dialog = showDialog(content, buttons);
    const input = dialog.querySelector<HTMLInputElement>("#password")!;
    input.focus();
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        dialog.querySelector<HTMLButtonElement>("button")!.click();
      }
    };
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

  const dialogContainer = createElementFromHTML(html);

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

  return dialogContainer;
}
