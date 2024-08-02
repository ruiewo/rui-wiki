import { getSvg } from '../../lib/svg';
import { message } from '../message';
import './index.css';

export const showLoginDialog = (
  checkPassword: (password: string) => Promise<boolean>
) => {
  return new Promise((resolve) => {
    const passwordInput = (
      <input
        type="password"
        class="input"
        placeholder="Password"
        autofocus
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
    ) as HTMLInputElement;

    const onSubmit = async () => {
      if (await checkPassword(passwordInput.value)) {
        dialog.close();
        dialog.remove();
        resolve('success');
      } else {
        message('error', 'Wrong password');
      }
    };

    const dialog = (
      <dialog class="dialog">
        <div class="appIcon">{getSvg('app')}</div>
        <div>{passwordInput}</div>
        <button class="shrinkButton" onclick={onSubmit}>
          Log in
        </button>
      </dialog>
    ) as HTMLDialogElement;

    dialog.oncancel = (e) => e.preventDefault(); // disable escape key

    document.body.appendChild(dialog);
    dialog.showModal();
  });
};
