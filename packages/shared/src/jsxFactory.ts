type Props = { [key: string]: unknown };

type Child = string | Element;

type FunctionComponent = (props: Props) => Element;

export function h(
  type: string | FunctionComponent | typeof Fragment,
  props: Props,
  ...children: Child[]
) {
  const isString = typeof type === 'string';

  const dom = isString
    ? document.createElement(type)
    : type({ children, ...(props ?? {}) }); // todo treat children as props

  if (isString) {
    Object.entries(props ?? {}).forEach(([key, value]) => {
      if (!(dom instanceof Element)) throw new Error();

      if (typeof value === 'boolean') {
        if (value) {
          dom.setAttribute(key, '');
        }
      } else if (typeof value === 'function') {
        // @ts-ignore
        dom[key] = value;
      } else {
        dom.setAttribute(key, value as string);
      }
    });
  }

  dom.append(...children);

  return dom;
}

export const Fragment = () => document.createDocumentFragment();

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
