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
