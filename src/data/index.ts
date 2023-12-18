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

With these features, RuiWiki can handle a variety of uses, from personal note-taking to project management. Organize your information and share your knowledge with RuiWiki.`,

      tags: "area1",
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
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "article4",
      content: "content",
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "article5",
      content: "content",
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
    {
      title: "article6",
      content: "content",
      tags: "area2",
      created: "2020-03-03",
      modified: "2020-03-03",
    },
  ],
};
