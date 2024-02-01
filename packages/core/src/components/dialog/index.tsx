import { appService } from '../../lib/appService';
import { getSvg } from '../../lib/svg';
import { flashMessage } from '../flashMessage';
import './index.css';

export const showLoginDialog = () => {
  return new Promise((resolve) => {
    const dialog = (
      <dialog class="dialog">
        <div class="appIcon">{getSvg('app')}</div>
        <div>
          <input
            type="password"
            id="password"
            class="input"
            placeholder="Password"
            autofocus
          />
        </div>
        <Button
          label="Log in"
          onClick={async () => {
            const password =
              dialog.querySelector<HTMLInputElement>('#password')!.value;

            if (await appService.checkPassword(password)) {
              dialog.close();
              dialog.remove();
              resolve('success');
            } else {
              flashMessage('error', 'Wrong password');
            }
          }}
        />
      </dialog>
    ) as HTMLDialogElement;

    dialog.oncancel = (e) => e.preventDefault(); // disable escape key

    const input = dialog.querySelector<HTMLInputElement>('#password')!;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        dialog.querySelector<HTMLButtonElement>('button')!.click();
      }
    };

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
