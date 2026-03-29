import { helper } from "@ember/component/helper";

const MAX_VISIBLE = 3;

function isVersionTag(name) {
  if (!name) return false;

  return (
    /^(alpha|beta|rc)-\d+(?:-\d+)*$/.test(name) || // alpha-1-2-2 / beta-1-2-3 / rc-1-3-4
    /^\d+(?:-\d+)+$/.test(name)                    // 1-2 / 1-3-5 / 1-0
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

  function tagSortKey(name) {
    if (!name) return priorityList.length + 1;

    const exactIndex = priorityList.indexOf(name);
    return exactIndex !== -1 ? exactIndex : priorityList.length;
  }

  const sorted = [...tags].sort((a, b) => {
    return tagSortKey(tagName(a)) - tagSortKey(tagName(b));
  });

  const seen = new Set();
  const deduped = sorted.filter((tag) => {
    const name = tagName(tag);
    if (!name || seen.has(name)) return false;

    seen.add(name);
    return true;
  });

  const decorated = deduped.map(decorateTag);

  return {
    visible: decorated.slice(0, MAX_VISIBLE),
    hidden: decorated.slice(MAX_VISIBLE),
  };
});