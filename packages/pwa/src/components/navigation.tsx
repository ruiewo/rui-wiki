import { get, set } from 'idb-keyval';
import { createNewFile, verifyPermission } from '../lib/fileSystem';
import { showFile } from './main';
import { updateRuiwikiWindow } from '../lib/window';

export const navigation = (
  <nav class="open">
    <div
      class="menuButton"
      onclick={() => {
        navigation.classList.toggle('open');
      }}
    >
      <span class="bar" />
    </div>
    <button class="directory" onclick={selectDirectory}>
      directory
    </button>
    <ul>
      <li class="add" onclick={add}>
        create new
      </li>
    </ul>
  </nav>
);

export async function loadDirectory() {
  const dirHandle = await get<FileSystemDirectoryHandle>('directory');
  if (dirHandle && (await verifyPermission(dirHandle))) {
    await showList(dirHandle);
  }
}

function setSelectState(element: HTMLElement) {
  navigation
    .querySelectorAll('.selected')
    .forEach((el) => el.classList.remove('selected'));

  element.classList.add('selected');
}

async function showList(dirHandle: FileSystemDirectoryHandle) {
  const ul = navigation.querySelector('ul')!;
  ul.innerHTML = '';

  for await (let [name, handle] of dirHandle) {
    if (handle.kind !== 'file') {
      continue;
    }

    if (!name.endsWith('.html') || name.endsWith('.rwk')) {
      continue;
    }

    ul.appendChild(
      <li
        onclick={async (e) => {
          const fileHandle = await dirHandle!.getFileHandle(name);
          setSelectState(e.target as HTMLElement);
          loadFile(fileHandle);
        }}
      >
        {name}
      </li>
    );
  }
}

async function selectDirectory() {
  const dirHandle = await window.showDirectoryPicker();
  await set('directory', dirHandle);
  await showList(dirHandle);
}

async function loadFile(fileHandle: FileSystemFileHandle) {
  updateRuiwikiWindow(fileHandle);

  const file = await fileHandle.getFile();
  showFile(file);
}

async function add() {
  let dirHandle = await get<FileSystemDirectoryHandle>('directory');
  if (!dirHandle) {
    dirHandle = await window.showDirectoryPicker();
    await set('directory', dirHandle);
  }

  if (!dirHandle || !(await verifyPermission(dirHandle))) {
    return;
  }

  const fileHandle = await createNewFile(dirHandle);

  await showList(dirHandle);

  setSelectState(
    [...navigation.querySelectorAll('li')].find(
      (x) => x.textContent === fileHandle.name
    )!
  );
  loadFile(fileHandle);
}
