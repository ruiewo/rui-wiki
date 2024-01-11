export const systemTag = {
  plugin: "plugin",
};

export const systemTags = Object.values(systemTag);

export const isSystemTag = (tags: string | undefined): boolean =>
  tags === undefined
    ? false
    : tags.split(" ").some((x) => systemTags.includes(x));
