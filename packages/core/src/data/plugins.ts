import { RawArticle } from "../lib/articleHandler";
import { systemTag } from "../lib/tag";
import aceEditor from "@rui-wiki/shared/src/plugins/aceEditor";

export const plugins: RawArticle[] = [
  {
    title: "ruiwiki_plugin_editor",
    content: aceEditor,
    tags: systemTag.plugin,
    created: "2023-01-10",
    modified: "2023-01-10",
  },
];
