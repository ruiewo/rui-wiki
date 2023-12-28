import { flashMessage } from "../components/flashMessage";

export function assertExist<T>(params: T): asserts params is NonNullable<T> {
  if (params === null || params === undefined) {
    throw new Error("Assertion failed. params is null or undefined");
  }
}

export function clearChildren(element: HTMLElement) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function getDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  return div.firstChild as HTMLElement;
}

export function download(
  text: string,
  fileName: string,
  fileType: "html" | "json"
) {
  let type;
  switch (fileType) {
    case "html":
      type = "text/html";
      break;
    case "json":
      type = "application/json";
      break;
    default:
      throw new Error("Assertion failed. fileType is invalid");
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = fileName;
  a.click();
}

export class EventHandler<EventMap extends Record<string, any>> {
  private listeners: {
    [K in keyof EventMap]?: Array<(event: EventMap[K]) => void>;
  } = {};

  on = <K extends keyof EventMap>(
    event: K | K[],
    listener: (event: EventMap[K]) => void
  ) => {
    (Array.isArray(event) ? event : [event]).forEach((event) => {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event]?.push(listener);
    });
  };

  off = <K extends keyof EventMap>(
    event: K | K[],
    listener: (event: EventMap[K]) => void
  ) => {
    (Array.isArray(event) ? event : [event]).forEach((event) => {
      this.listeners[event] = this.listeners[event]?.filter(
        (x) => x !== listener
      );
    });
  };

  emit = <K extends keyof EventMap>(event: K, data: EventMap[K]) => {
    this.listeners[event]?.forEach((listener) => listener(data));
  };
}

export function copyToClipboard(text: string | null | undefined) {
  if (!text) return;

  navigator.clipboard.writeText(text.trim());
  flashMessage("success", "Copied to clipboard");
}
