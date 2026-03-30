import { helper } from "@ember/component/helper";

function isVersionTag(name) {
  if (!name) return false;

  return (
    /^(alpha|beta|rc)-\d+(?:-\d+)*$/.test(name) ||
    /^\d+(?:-\d+)+$/.test(name)
  );
}

function tagName(tag) {
  return typeof tag === "string" ? tag : tag?.name;
}

function decorateTag(tag) {
  const name = tagName(tag);
  const classes = [];

  if (isVersionTag(name)) {
    classes.push("milestone");
  }

  return {
    original: tag,
    name,
    classes,
    className: classes.join(" "),
  };
}

export default helper(function structuredTags([tags]) {
  if (!tags?.length) return null;

  let priorityList = settings.priority_tags || [];

  if (typeof priorityList === "string") {
    priorityList = priorityList.split("|").map(t => t.trim());
  }

  const seen = new Set();

  return tags
    .filter((tag) => {
      const name = tagName(tag);
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .map(decorateTag)
    .filter(({ name }) => isVersionTag(name) || priorityList.includes(name));
});