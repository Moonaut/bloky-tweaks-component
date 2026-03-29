import { helper } from "@ember/component/helper";

const MAX_VISIBLE = 3;

function tagName(tag) {
  return typeof tag === "string" ? tag : tag?.name;
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

  function decorateTag(tag) {
    return {
      original: tag,
      name: tagName(tag),
      classes: [],
      className: "",
    };
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