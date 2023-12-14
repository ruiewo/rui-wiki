import { marked } from "marked";

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(
    /^<a /,
    '<a target="_blank" rel="noreferrer noopener nofollow" '
  );
};

export async function parse(text: string) {
  return await marked(text, { renderer });
}
