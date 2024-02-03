import { appService } from '../../lib/appService';
import { getSvg } from '../../lib/svg';
import { flashMessage } from '../flashMessage';
import './index.css';

export const showLoginDialog = () => {
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
      if (await appService.checkPassword(passwordInput.value)) {
        dialog.close();
        dialog.remove();
        resolve('success');
      } else {
        flashMessage('error', 'Wrong password');
      }
    };

    const dialog = (
      <dialog class="dialog">
        <div class="appIcon">{getSvg('app')}</div>
        <div>{passwordInput}</div>
        <Button label="Log in" onClick={onSubmit} />
      </dialog>
    ) as HTMLDialogElement;

    dialog.oncancel = (e) => e.preventDefault(); // disable escape key

    document.body.appendChild(dialog);
    dialog.showModal();
  });
};

type ButtonProps = {
  label: string;
  onClick: () => void | Promise<void>;
};
const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button class="shrinkButton" onclick={onClick}>
      {label}
    </button>
  );
};
