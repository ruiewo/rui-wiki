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

const codeRenderer = renderer.code;
renderer.code = (code, info, escaped) => {
  if (info === "kv") {
    const lines = code.split("\n");

    // 奇数行目をキー、偶数行目を値として解釈
    let result = "";
    for (let i = 0; i < lines.length; i += 2) {
      const key = lines[i];
      const value = lines[i + 1];
      result += `<span class="key">${key}</span><span class="value">${
        value ?? ""
      }</span><br/>`;
    }

    return result;
  }

  return codeRenderer.call(renderer, code, info, escaped);
};

marked.use({
  breaks: false,
  gfm: true,
});

export async function parse(text: string) {
  return await marked(text, { renderer });
}
