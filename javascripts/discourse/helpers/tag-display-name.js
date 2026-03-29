import { helper } from "@ember/component/helper";

function isVersionTag(name) {
  if (!name) return false;

  // alpha-1-2-2, beta-1-2-3, rc-1-3-4
  if (/^(alpha|beta|rc)-\d+(?:-\d+)*$/.test(name)) {
    return true;
  }

  // 1-2, 1-3-5, 1-0
  if (/^\d+(?:-\d+)+$/.test(name)) {
    return true;
  }

  return false;
}

export default helper(function tagDisplayName([name]) {
  if (!name) {
    return name;
  }

  if (isVersionTag(name)) {
    return name.replaceAll("-", ".");
  }

  return name;
});