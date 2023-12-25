import { IEditorPlugin } from "./plugins/editor";

export interface RuiWikiWindow extends Window {
  ruiwiki: {
    pwa: { overwrite: (html: string) => Promise<boolean> };
    getSettings: () => {
      overwrite: (html: string) => Promise<boolean>;
      plugins: { editor: IEditorPlugin };
    };
  };
}
