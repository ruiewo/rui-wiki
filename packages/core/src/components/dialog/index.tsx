import { appService } from '../../lib/appService';
import { getSvg } from '../../lib/svg';
import { flashMessage } from '../flashMessage';
import './index.scss';

export async function showLoginDialog() {
  return new Promise((resolve) => {
    const content = (
      <div>
        <input
          type="password"
          id="password"
          class="input"
          placeholder="Password"
        />
      </div>
    );

    const buttons = [
      [
        'Log in',
        async (close: () => void) => {
          const password =
            content.querySelector<HTMLInputElement>('#password')!.value;

          if (await appService.checkPassword(password)) {
            close();
            resolve('success');
          } else {
            flashMessage('error', 'Wrong password');
          }
        },
      ] as const,
    ];

    const dialog = showDialog({ content, buttons });
    const input = dialog.querySelector<HTMLInputElement>('#password')!;
    input.focus();
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        dialog.querySelector<HTMLButtonElement>('button')!.click();
      }
    };
  });
}

export function showDialog(props: DialogProps) {
  const dialog = <Dialog {...props} />;
  document.body.appendChild(dialog);

  return dialog;
}

type ButtonCallback = (close: () => void) => void | Promise<void>;
type DialogProps = {
  content: HTMLElement;
  buttons: (readonly [string, ButtonCallback])[];
};

const Dialog = ({ content, buttons }: DialogProps) => {
  const close = () => dialog.remove();
  const dialog = (
    <div class="dialogContainer">
      <div class="dialog">
        <div class="appIcon">{getSvg('app')}</div>
        {content}
        {...buttons.map(([label, onClick]) => (
          <Button label={label} onClick={() => onClick(close)}></Button>
        ))}
      </div>
    </div>
  );

  return dialog;
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
