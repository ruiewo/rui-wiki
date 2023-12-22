import { AppData } from "../pages/main";

export const defaultAppData: AppData = {
  setting: {
    title: "RuiWiki",
    subTitle: "Your Personal Knowledge Base",
  },
  articles: [
    {
      title: "RuiWiki",
      content: `RuiWiki is a tool that perfectly combines simplicity and convenience, making it ideal for personal information management and knowledge organization.

Similar to TiddlyWiki, RuiWiki operates on a single HTML file. This means that you don't need any special databases or servers, and you can easily manage your information on any device.

### Features of RuiWiki
- Single HTML: All information is stored in one HTML file, eliminating the need for any special databases or servers.
- User-friendly: Its simple and intuitive interface allows anyone to start using it easily.

With these features, RuiWiki can handle a variety of uses, from personal note-taking to project management. Organize your information and share your knowledge with RuiWiki.

### PWA
[PWA site](https://ruiewo.github.io/rui-wiki/pwa.html)
`,
      tags: "",
      created: "2023-12-18",
      modified: "2023-12-18",
    },
    {
      title: "article2",
      content: "# header1\n## header2\n### header3\n content",
      tags: "area1",
      created: "2022-02-02",
      modified: "2022-02-02",
    },
    {
      title: "article3",
      content: `content
  
  \`\`\`kv
  key
  value
  key2
  value2
  key3
  \`\`\`
  
  \`\`\`kv2
  key
  value
  key2
  value2
  \`\`\`
  `,
      tags: "",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "Release Note",
      content: `# alpha version
## 0.1.0 2023-12-21
alpha 0.1.0 released
`,
      tags: "",
      created: "2023-12-21",
      modified: "2023-12-21",
    },
    {
      title: "article5",
      content: "content",
      tags: "",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "Markdown",
      content: `
### link
[RuiWiki GitHub repository](https://github.com/ruiewo/rui-wiki)

### text style
**strong**

*em*

\`code\`

### image
![image](https://avatars0.githubusercontent.com/u/20625401?s=460&v=4)

### blockquote
> blockquote

### list

- term1
    - My description of term1
    - My description of term2
- \`term2\`
    - My description of term2



### table
| Heading 1 | Heading 2 | Heading 3 |
|-----------|-----------|-----------|
| cell 1    | cell 2    | cell 3    |
| cell 4    | cell 5    | cell 6    |

### code block

\`\`\`js
const a = 1;
\`\`\`

# original

\`\`\`kv
key
value
key2
value2
\`\`\`


`,
      tags: "",
      created: "2023-12-19",
      modified: "2023-12-19",
    },
  ],
};
