import SCHOOLPAL_CONFIG from "./config";
import idToNumber from './idToNumber';

const ADMIN_ID = "7";

//筛选出一级导航
function getRootMenu(item, index, array) {
  return item.cId === item.cParentId && item.cId === item.cRootId;
}

export default function (data) {
  // debugger;
  let hasChangeGroupBtn = true;
  let profile = {};
  let menu = [];
  let func = [];
  let commands = [];
  let access = [];

  profile.cRealname = data.cRealName;
  profile.cNickname = data.cNickName;
  profile.cPhone = data.cPhone;
  profile.cEmail = data.cEmail;
  profile.cQq = data.cQq;
  profile.org = {
    cId: data.org.cId,
    cName: data.org.cName
  };
  profile.roles = [];


  data.roles.map(item => {
    func = func.concat(item.functions);
    profile.roles.push(item.cName);
  });

  func = func.sort((a, b) => {
    const aid = idToNumber(a.cId);
    const bid = idToNumber(b.cId);
    let comparison = 0;

    if (aid > bid) {
      comparison = 1;
    } else {
      comparison = -1;
    }

    return comparison;
  });

  //一级导航
  menu = func.filter(getRootMenu);

  menu.map(item => {
    item.children = [];

    item.children = func.filter(children => (
      children.cId !== children.cParentId && item.cId === children.cParentId
    ));

    if (item.cRootId === ADMIN_ID) {
      hasChangeGroupBtn = false;
    }
  });

  func.map(item => {
    if (SCHOOLPAL_CONFIG.AUTH[item.cId] && SCHOOLPAL_CONFIG.AUTH[item.cId].PATH_RULE !== undefined) {
      access.push(SCHOOLPAL_CONFIG.AUTH[item.cId].PATH_RULE);
    }

    if (item.WidgetType === "MenuItem") {
      commands.push({
        id: item.cId,
        rule: SCHOOLPAL_CONFIG.AUTH[item.cId].PATH_RULE,
        commands: []
      });
    }

    if (item.WidgetType === "Command") {
      const index = commands.findIndex(cmd => (cmd.id === item.cParentId));

      if (index + 1) {
        commands[index].commands.push({
          id: item.cId,
          name: item.CommandCode
        });
      }
    }
  });

  console.log(hasChangeGroupBtn, menu, access, commands, profile);
  return {hasChangeGroupBtn, menu, access, commands, profile};
}
