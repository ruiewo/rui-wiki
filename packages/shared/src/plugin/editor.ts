export interface IEditorFactory {
  create: (content: string, fn: EditorUtil) => IEditor;
}

export interface IEditor {
  dom: HTMLElement;
  get value(): string;
}

export type EditorUtil = {
  delete: () => void;
  close: () => void;
  save: () => void;
};
