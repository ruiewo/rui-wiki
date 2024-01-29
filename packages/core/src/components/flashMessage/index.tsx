import './index.css';

type FlashMessageType = 'success' | 'error' | 'info';

interface FlashMessage {
  type: FlashMessageType;
  message: string;
}

let messages: FlashMessage[] = [];
let container: HTMLElement | null = null;

function initialize() {
  container = <div id="flashMessageContainer"></div>;
  document.body.appendChild(container);
}

initialize();

export function flashMessage(
  type: FlashMessageType,
  message: string,
  msec: number = 5000
) {
  messages.push({ type, message });

  const flashMessage = <span class={`flashMessage ${type}`}>{message}</span>;

  container?.appendChild(flashMessage);

  setTimeout(() => {
    messages = messages.filter((m) => m.message !== message);
    container?.removeChild(flashMessage);
  }, msec);
}
