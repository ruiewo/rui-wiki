// ctrl+enter for windows, command+return for mac
export const isCtrlKeyHeldDown = (e: KeyboardEvent) =>
  (e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey);
