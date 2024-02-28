import { get, set } from 'idb-keyval';
import { editor } from './plugins/editor';
import { RuiWikiWindow } from '@rui-wiki/shared/src/window';
import { isCtrlKeyHeldDown } from '@rui-wiki/shared/src/key';
import './styles/reset.css';
import './styles/index.css';
import { createNewFile } from './lib/fileSystem';

// todo serialize file handle
// https://developer.chrome.com/docs/capabilities/web-apis/file-system-access?hl=ja#ask-the-user-to-pick-a-file-to-read

// FIXME
// @ts-ignore
window.ruiwiki = {};

async function initialize() {
  document.body.classList.add('dark');
  const html = `<nav class="open"></nav><main></main>`;
  const app = document.getElementById('app')!;
  app.innerHTML = html;

  const nav = document.querySelector('nav')!;
  const main = document.querySelector('main')!;

  nav.innerHTML = `<div class="menuButton"><span class="bar"></span></div><button class="directory">directory</button><ul><li class="add">create new</li></ul>`;
  const menuButton = nav.querySelector('.menuButton') as HTMLElement;

  menuButton.onclick = () => {
    nav.classList.toggle('open');
  };

  const button = nav.querySelector('button')!;
  button.onclick = async () => {
    const dirHandle = await window.showDirectoryPicker();
    await set('directory', dirHandle);
    await showList(dirHandle, nav);
  };

  nav.onclick = async (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'LI') {
      return;
    }

    if (target.classList.contains('add')) {
      let dirHandle = await get<FileSystemDirectoryHandle>('directory');
      if (!dirHandle) {
        dirHandle = await window.showDirectoryPicker();
        await set('directory', dirHandle);
      }

      if (!dirHandle || !(await verifyPermission(dirHandle))) {
        return;
      }

      const fileHandle = await createNewFile(dirHandle);

      await showList(dirHandle, nav);
      const li = [...nav.querySelectorAll('li')].find(
        (x) => x.textContent === fileHandle.name
      )!;
      selectFile(li);
      showFile(fileHandle);

      return;
    }

    const dirHandle = await get<FileSystemDirectoryHandle>('directory');
    const fileName = selectFile(target);
    const fileHandle = await dirHandle!.getFileHandle(fileName);
    showFile(fileHandle);
  };

  // FIXME needs user action
  const dirHandle = await get<FileSystemDirectoryHandle>('directory');

  if (dirHandle && (await verifyPermission(dirHandle))) {
    await showList(dirHandle, nav);
  }
}

function selectFile(target: HTMLElement) {
  const nav = document.querySelector('nav')!;

  nav
    .querySelectorAll('.selected')
    .forEach((el) => el.classList.remove('selected'));
  target.classList.add('selected');

  const name = target.textContent!;

  return name;
}

async function showFile(fileHandle: FileSystemFileHandle) {
  const main = document.querySelector('main')!;

  const file = await fileHandle.getFile();

  const iframe = document.createElement('iframe');
  iframe.src = URL.createObjectURL(file);

  (window as unknown as RuiWikiWindow).ruiwiki.getSettings = () => {
    const overwrite = async (html: string) => {
      if (!fileHandle) {
        return false;
      }

      try {
        const writable = await fileHandle.createWritable();
        writable.write(html);
        await writable.close();
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    return {
      overwrite,
      plugins: {
        editor,
      },
    };
  };
  iframe.onload = () => {
    const body = iframe.contentWindow?.document.body;
    body?.addEventListener('keydown', (e) => {
      if (isCtrlKeyHeldDown(e) && e.key === 's') {
        e.preventDefault();
        body
          ?.querySelector<HTMLElement>('.sideMenu .iconButton.overwrite')
          ?.click();
      }
    });
  };

  main.innerHTML = '';
  main.appendChild(iframe);
}

async function showList(
  dirHandle: FileSystemDirectoryHandle,
  nav: HTMLElement
) {
  const ul = nav.querySelector('ul')!;
  ul.innerHTML = '';

  for await (let [name, handle] of dirHandle) {
    if (handle.kind !== 'file') {
      continue;
    }

    if (!handle.name.endsWith('.html') || handle.name.endsWith('.rwk')) {
      continue;
    }

    ul.insertAdjacentHTML('beforeend', `<li>${name}</li>`);
  }
}

async function verifyPermission(
  dirHandle: FileSystemDirectoryHandle,
  readWrite: FileSystemPermissionMode = 'readwrite'
) {
  const options = { mode: readWrite };

  if ((await dirHandle.queryPermission(options)) === 'granted') {
    return true;
  }

  if ((await dirHandle.requestPermission(options)) === 'granted') {
    return true;
  }

  return false;
}

initialize();
