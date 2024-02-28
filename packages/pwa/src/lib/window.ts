import { RuiWikiWindow } from '@rui-wiki/shared/src/window';
import { editor } from '../plugins/editor';

function initialize() {
  // FIXME
  // @ts-ignore
  window.ruiwiki = {};
}

export function updateRuiwikiWindow(fileHandle: FileSystemFileHandle) {
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
}

initialize();
