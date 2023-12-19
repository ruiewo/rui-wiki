import "./index.scss";

type FlashMessageType = "success" | "error" | "info";

interface FlashMessage {
  type: FlashMessageType;
  message: string;
}

let messages: FlashMessage[] = [];

function initialize() {
  const container = document.createElement("div");
  container.id = "flashMessageContainer";
  document.body.appendChild(container);
}

initialize();

export function flashMessage(type: FlashMessageType, message: string) {
  messages.push({ type, message });

  const flashMessage = document.createElement("span");
  flashMessage.className = `flashMessage ${type}`;
  flashMessage.textContent = message;

  const container = document.getElementById("flashMessageContainer");
  container?.appendChild(flashMessage);

  setTimeout(() => {
    messages = messages.filter((m) => m.message !== message);
    container?.removeChild(flashMessage);
  }, 5000);
}
