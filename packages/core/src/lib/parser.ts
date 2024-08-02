import { TokenizerAndRendererExtension, Tokens, marked } from 'marked';

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (token: Tokens.Link) => {
  const html = linkRenderer.call(renderer, token);
  return html.replace(
    /^<a /,
    '<a target="_blank" rel="noreferrer noopener nofollow" '
  );
};

const codeRenderer = renderer.code;
renderer.code = (token: Tokens.Code) => {
  if (token.lang === 'kv') {
    const lines = token.text.split('\n');

    // 奇数行目をキー、偶数行目を値として解釈
    let result = '';
    for (let i = 0; i < lines.length; i += 2) {
      const key = lines[i];
      const value = lines[i + 1];
      result += `<span class="key">${key}</span><span class="value">${value ?? ''}</span><br/>`;
    }

    return `<div class="keyValue">${result}</div>`;
  }

  const fileInfo = `<div class="fileInfo">lang: ${token.lang}</div>`;
  const copyButton = `<button class="copyButton">Copy</button>`;
  const originalCode = codeRenderer.call(renderer, token);
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

const ruiwikiLink: TokenizerAndRendererExtension = {
  name: 'ruiwikiLink',
  level: 'inline',
  start(src: string) {
    return src.match(/\[\[/)?.index;
  },
  tokenizer(src) {
    const rule = /^\[\[(.*?)\]\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'ruiwikiLink',
        raw: match[0],
        ruiwikiLink: match[1].trim(),
      };
    }
  },
  renderer(token) {
    return `<a class="ruiwikiLink">${token.ruiwikiLink}</a>`;
  },
  childTokens: [],
};
marked.use({ extensions: [ruiwikiLink] });
