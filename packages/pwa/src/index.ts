import { get, set } from "idb-keyval";

import { RuiWikiWindow } from "@rui-wiki/shared";
import "./styles/index.scss";

// todo serialize file handle
// https://developer.chrome.com/docs/capabilities/web-apis/file-system-access?hl=ja#ask-the-user-to-pick-a-file-to-read

let handleMap = new Map<string, FileSystemFileHandle>();

async function initialize() {
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
    await set("directory", dirHandle);
    await showList(dirHandle, nav);
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

  const dirHandle = (await get("directory")) as
    | FileSystemDirectoryHandle
    | undefined;
  if (dirHandle && (await verifyPermission(dirHandle))) {
    await showList(dirHandle, nav);
  }
}

async function showList(
  dirHandle: FileSystemDirectoryHandle,
  nav: HTMLElement
) {
  for await (let [name, handle] of dirHandle) {
    if (handle.kind !== "file") {
      continue;
    }

    if (!handle.name.endsWith(".html") || handle.name.endsWith(".rwk")) {
      continue;
    }

    handleMap.clear();
    handleMap.set(name, handle);

    const ul = nav.querySelector("ul")!;
    ul.innerHTML = "";
    ul.insertAdjacentHTML("beforeend", `<li>${name}</li>`);
  }
}

async function verifyPermission(
  dirHandle: FileSystemDirectoryHandle,
  readWrite: FileSystemPermissionMode = "readwrite"
) {
  const options = { mode: readWrite };

  if ((await dirHandle.queryPermission(options)) === "granted") {
    return true;
  }

  if ((await dirHandle.requestPermission(options)) === "granted") {
    return true;
  }

  return false;
}

initialize();
