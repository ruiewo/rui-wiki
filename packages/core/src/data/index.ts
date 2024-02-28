import { AppData } from '../pages/main';
// import { plugins } from "./plugins";

export const defaultAppData: AppData = {
  setting: {
    title: 'RuiWiki',
    subTitle: 'Your Personal Knowledge Base',
  },
  articles: [
    {
      title: 'RuiWiki',
      content: `RuiWiki is a tool that perfectly combines simplicity and convenience, making it ideal for personal information management and knowledge organization.

Similar to TiddlyWiki, RuiWiki operates on a single HTML file. This means that you don't need any special databases or servers, and you can easily manage your information on any device.

### Features of RuiWiki
- Single HTML: All information is stored in one HTML file, eliminating the need for any special databases or servers.
- User-friendly: Its simple and intuitive interface allows anyone to start using it easily.

With these features, RuiWiki can handle a variety of uses, from personal note-taking to project management. Organize your information and share your knowledge with RuiWiki.

### PWA
[PWA site](https://ruiewo.github.io/rui-wiki/pwa.html)
`,
      tags: '',
      created: '2023-12-18T03:00:00.000Z',
      modified: '2023-12-18T03:00:00.000Z',
    },
    {
      title: 'Markdown',
      content: `
# header1
## header2
### header3
#### header4
##### header5

## link
[RuiWiki GitHub repository](https://github.com/ruiewo/rui-wiki)

## text style
**strong**

*em*

\`code\`

## image
![image](https://avatars0.githubusercontent.com/u/20625401?s=460&v=4)

## blockquote
> blockquote

## list

- term1
    - My description of term1
    - My description of term2
- \`term2\`
    - My description of term2



## table
| Heading 1 | Heading 2 | Heading 3 |
|-----------|-----------|-----------|
| cell 1    | cell 2    | cell 3    |
| cell 4    | cell 5    | cell 6    |

## code block

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
      tags: '',
      created: '2023-12-19T03:00:00.000Z',
      modified: '2023-12-19T03:00:00.000Z',
    },
    // ...plugins, // todo
  ],
};
