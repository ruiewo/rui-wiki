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
renderer.code = (code, language, isEscaped) => {
  if (language === "kv") {
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

    return `<div class="keyValue">${result}</div>`;
  }

  const fileInfo = `<div class="fileInfo">lang: ${language}</div>`;
  const copyButton = `<button class="copyButton">Copy</button>`;
  const originalCode = codeRenderer.call(renderer, code, language, isEscaped);
  const newCode = `<div class="codeBlock">${fileInfo}${originalCode}${copyButton}</div>`;

  return newCode;
};

marked.use({
  breaks: true,
  gfm: true,
});

export async function parse(text: string) {
  return await marked(text, { renderer });
}
