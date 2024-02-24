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
    } catch (e) {
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
