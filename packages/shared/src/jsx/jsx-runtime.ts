type Props = { [key: string]: unknown } & { children?: Child | Child[] };

type Child = string | Element;

type FunctionComponent = (props: Props) => Element;

export const jsx = (
  tag: string | FunctionComponent | typeof Fragment,
  props: Props
) => {
  if (typeof tag === 'function') {
    return tag(props);
  }

  const element = document.createElement(tag);
  Object.entries(props ?? {}).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(key, '');
      }
    } else if (typeof value === 'function') {
      // @ts-ignore
      element[key] = value;
    } else {
      element.setAttribute(key, value as string);
    }
  });

  appendChildren(element, props.children);

  return element;
};

function appendChildren(
  element: Element | DocumentFragment,
  children?: Child | Child[]
) {
  if (Array.isArray(children)) {
    element.append(...children);
  } else if (children) {
    element.append(children);
  }
}

export const jsxs = jsx;

export const Fragment = ({ children }: { children?: Child | Child[] }) => {
  const fragment = document.createDocumentFragment();
  appendChildren(fragment, children);
  return fragment;
};

// todo SVGElement support
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = HTMLElement;
    interface IntrinsicElements extends ValuePartial<HTMLElementTagNameMap> {}
  }
}

type ValuePartial<T> = {
  [K in keyof T]: Partial<T[K]> | { class: string };
};
