import SCHOOLPAL_CONFIG from "./config";
import idToNumber from './idToNumber';

const ADMIN_ID = "7";

//筛选出一级导航
function getRootMenu(item, index, array) {
    return item.cId === item.cParentId && item.cId === item.cRootId;
}

/**
 * 按照id去重
 * @param arr
 * @returns {Array}
 */
function unique5(arr, field) {
    var retval = [];
    if (arr && arr.length > 0) {
        var exist = false;
        for (var i = 0; i < arr.length; i++) {
            exist = false;
            if (retval && retval.length > 0) {
                for (var j = 0; j < retval.length; j++) {
                    if (arr[i].cId == retval[j].cId) {
                        exist = true;
                        break;
                    }
                }
            }
            if (exist) {
                continue;
            } else {
                retval.push(arr[i]);
            }
        }
    } else {
        retval = arr;
    }
    return retval;
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
        // const aid = idToNumber(a.cOrderByNum);
        // const bid = idToNumber(b.cOrderByNum);
        let comparison = 0;

        if (a.cOrderByNum > b.cOrderByNum) {
            comparison = 1;
        } else {
            comparison = -1;
        }

        return comparison;
    });

    //一级导航
    menu = func.filter(getRootMenu);
    menu = unique5(menu);

    menu.map(item => {
        item.children = [];

        item.children = func.filter(children => (
            children.cId !== children.cParentId && item.cId === children.cParentId
        ));

        if (item.cRootId === ADMIN_ID) {
            hasChangeGroupBtn = false;
        }
    });
    debugger
    func = unique5(func);
    func.map(item => {
        item.children = unique5(item.children);
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
