const loadJs = (url: string, window: Window): Promise<HTMLScriptElement> => {
  const script = window.document.createElement("script");
  script.src = url;
  window.document.querySelector("head")!.appendChild(script);

  return new Promise((resolve, reject): void => {
    script.addEventListener("load", () => {
      resolve(script);
    });
    script.addEventListener("error", () => {
      reject(new Error(`Can not load: ${url}`));
    });
  });
};

const loadCss = (url: string, window: Window): Promise<HTMLLinkElement> => {
  const link = window.document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  window.document.querySelector("head")!.appendChild(link);

  return new Promise((resolve, reject): void => {
    link.addEventListener("load", () => {
      resolve(link);
    });
    link.addEventListener("error", () => {
      reject(new Error(`Can not load: ${url}`));
    });
  });
};

export type Loader<T extends HTMLElement> = (
  url: string,
  window: Window
) => Promise<T>;

export function createDynamicLoader<T extends HTMLElement>(
  loader: Loader<T>
): (url: string, window: Window) => Promise<T> {
  const cacheMap = new Map<string, T>();

  return (url: string, window: Window): Promise<T> => {
    const cachedElement = cacheMap.get(url);
    if (cachedElement) {
      return Promise.resolve(cachedElement);
    }
    return loader(url, window).then((element) => {
      cacheMap.set(url, element);
      return element;
    });
  };
}

export const dynamicImportJs = createDynamicLoader(loadJs);
export const dynamicImportCss = createDynamicLoader(loadCss);
