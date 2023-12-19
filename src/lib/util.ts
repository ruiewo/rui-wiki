import { SvgType, getSvg } from "./svg";

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

export function createIconButton(
  type: SvgType,
  onClick: (e: MouseEvent) => void
) {
  const button = document.createElement("button");
  button.classList.add("iconButton");
  button.classList.add(type);
  button.innerHTML = getSvg(type);
  button.onclick = onClick;

  return button;
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}

export function downloadHtml(text: string, fileName: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/html" }));
  a.download = fileName;
  a.click();
}

export function downloadJson(text: string, fileName: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = fileName;
  a.click();
}
