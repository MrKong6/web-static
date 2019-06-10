import SCHOOLPAL_CONFIG from "./config";

export default function (path) {
  const authItems = Object.values(SCHOOLPAL_CONFIG.AUTH);
  const matchItem = authItems.find((auth) => (auth.PATH_RULE && auth.PATH_RULE.test(path) === true));

  return {
    text: matchItem.CATEGORY + (matchItem.NAME ? matchItem.NAME : '管理'),
    icon: matchItem.ICON_CLASS
  };
}