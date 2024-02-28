import { isCtrlKeyHeldDown } from '@rui-wiki/shared/src/key';

export const main = <main />;

export const showFile = async (file: File) => {
  main.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.src = URL.createObjectURL(file);

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

  main.appendChild(iframe);
};
