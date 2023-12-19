import { RuiWikiWindow } from "../lib/appService";
import "./index.scss";

let handleMap = new Map<string, FileSystemFileHandle>();

function initialize() {
  document.body.classList.add("dark");
  const html = `<nav class="open"></nav><main></main>`;
  const app = document.getElementById("app")!;
  app.innerHTML = html;

  const nav = document.querySelector("nav")!;
  const main = document.querySelector("main")!;

  nav.innerHTML = `<div class="menuButton"><span class="bar"></span></div><button class="directory">directory</button><ul></ul>`;
  const menuButton = nav.querySelector(".menuButton") as HTMLElement;

  menuButton.onclick = () => {
    nav.classList.toggle("open");
  };

  const button = nav.querySelector("button")!;
  button.onclick = async () => {
    const dirHandle = await window.showDirectoryPicker();

    for await (let [name, handle] of dirHandle) {
      if (handle.kind !== "file") {
        continue;
      }

      handleMap.set(name, handle);
      nav
        .querySelector("ul")!
        .insertAdjacentHTML("beforeend", `<li>${name}</li>`);
    }
  };

  nav.onclick = async (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "LI") {
      return;
    }

    const name = target.textContent!;
    const handle = handleMap.get(name)!;
    const file = await handle.getFile();

    const iframe = document.createElement("iframe");
    iframe.src = URL.createObjectURL(file);

    main.innerHTML = "";
    main.appendChild(iframe);

    iframe.onload = () => {
      (iframe.contentWindow as RuiWikiWindow).ruiwiki.pwa.overwrite = async (
        html: string
      ) => {
        try {
          const writable = await handle.createWritable();
          writable.write(html);
          await writable.close();
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      };
    };
  };
}

initialize();
