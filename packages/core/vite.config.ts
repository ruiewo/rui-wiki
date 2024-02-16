import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [visualizer()],
    },
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
    name: 'html-transform',
    transformIndexHtml: {
      order: 'pre' as const,
      handler: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) => params[p1] ?? match),
    },
  };
}
