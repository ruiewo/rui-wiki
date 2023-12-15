import "./index.scss";

type FlashMessageType = "success" | "error" | "info";

interface FlashMessage {
  type: FlashMessageType;
  message: string;
}

let flashMessages: FlashMessage[] = [];

export function flashMessage(type: FlashMessageType, message: string) {
  flashMessages.push({ type, message });

  const flashMessageContainer = document.getElementById(
    "flashMessageContainer"
  );
  const flashMessageElement = document.createElement("span");
  flashMessageElement.className = `flash-message ${type}`;
  flashMessageElement.textContent = message;

  flashMessageContainer?.appendChild(flashMessageElement);

  setTimeout(() => {
    flashMessages = flashMessages.filter((m) => m.message !== message);
    flashMessageContainer?.removeChild(flashMessageElement);
  }, 8000);
}
