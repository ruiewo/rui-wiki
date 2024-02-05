import './index.css';

type MessageType = 'success' | 'error' | 'info';

let container: HTMLElement | null = null;

function initialize() {
  container = <div id="messageContainer" />;
  document.body.appendChild(container);
}

initialize();

export function message(
  type: MessageType,
  message: string,
  msec: number = 5000
) {
  const dom = <span class={`message ${type}`}>{message}</span>;
  container?.appendChild(dom);

  setTimeout(() => {
    container?.removeChild(dom);
  }, msec);
}
