import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  plugins: [htmlPlugin(), viteSingleFile()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

function htmlPlugin() {
  const params: Record<string, string | undefined> = {
    VERSION: process.env.npm_package_version,
  };

  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre" as const,
      transform: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) => params[p1] ?? match),
    },
  };
}
