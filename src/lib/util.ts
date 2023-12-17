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
  button.innerHTML = getSvg(type);
  button.onclick = onClick;

  return button;
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}
