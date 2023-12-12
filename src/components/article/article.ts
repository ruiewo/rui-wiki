export const createArticle = (article: Article) => {
  const section = document.createElement("section");

  return section;
};

export type Article = {
  title: string;
  content: string;
  tag: string;
  createdAt: string;
};
