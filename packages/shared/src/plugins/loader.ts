const loadJs = (url: string): Promise<HTMLScriptElement> => {
  const script = document.createElement('script');
  script.src = url;
  document.querySelector('head')!.appendChild(script);

  return new Promise((resolve, reject): void => {
    script.addEventListener('load', () => {
      resolve(script);
    });
    script.addEventListener('error', () => {
      reject(new Error(`Can not load: ${url}`));
    });
  });
};

const loadCss = (url: string): Promise<HTMLLinkElement> => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.querySelector('head')!.appendChild(link);

  return new Promise((resolve, reject): void => {
    link.addEventListener('load', () => {
      resolve(link);
    });
    link.addEventListener('error', () => {
      reject(new Error(`Can not load: ${url}`));
    });
  });
};

type Loader<T extends HTMLElement> = (url: string) => Promise<T>;

function createDynamicLoader<T extends HTMLElement>(
  loader: Loader<T>
): Loader<T> {
  const cacheMap = new Map<string, T>();

  return (url) => {
    const cachedElement = cacheMap.get(url);
    if (cachedElement) {
      //   return Promise.resolve('cachedElement');
      return Promise.resolve(cachedElement);
    }

    return loader(url).then((element) => {
      cacheMap.set(url, element);
      return element;
    });
  };
}

const dynamicImportJs = createDynamicLoader(loadJs);
const dynamicImportCss = createDynamicLoader(loadCss);

export const loader = {
  dynamicImportJs,
  dynamicImportCss,
};

export type DynamicLoader = typeof loader;
