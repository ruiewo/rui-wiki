// todo serialize file handle
// https://developer.chrome.com/docs/capabilities/web-apis/file-system-access?hl=ja#ask-the-user-to-pick-a-file-to-read

export const createNewFile = async (dirHandle: FileSystemDirectoryHandle) => {
  const fileName = 'RuiWiki';
  let index = 0;
  let newFileName = fileName;

  while (true) {
    try {
      await dirHandle.getFileHandle(`${newFileName}.html`, {
        create: false,
      });
      newFileName = `${fileName}_${++index}`;
    } catch {
      break;
    }
  }

  const fileHandle = await dirHandle.getFileHandle(`${newFileName}.html`, {
    create: true,
  });

  const res = await fetch('https://ruiewo.github.io/rui-wiki/');
  const html = await res.text();

  const writable = await fileHandle.createWritable();
  await writable.write(html);
  await writable.close();

  return fileHandle;
};

export async function verifyPermission(
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
