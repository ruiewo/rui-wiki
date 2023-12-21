export interface RuiWikiWindow extends Window {
  ruiwiki: {
    pwa: { overwrite: (html: string) => Promise<boolean> };
  };
}
