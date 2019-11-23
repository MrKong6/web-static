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
    debugger;
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
    profile.cId = data.cId;
    profile.teacherId = data.teacherId;
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
                    name: item.CommandCode,
                    fullName: item.cNameLong
                });
            }
        }
    });

    console.log(hasChangeGroupBtn, menu, access, commands, profile);
    //处理三级权限  即页面中tab页面情况   如班级管理详情tab
    if(commands && commands.length > 0){
        let array = [];
        let sonArray = [],sonOwnClass = [],sonStudentArray = [],sonOwnStudentArray = [];
        let groupCommands,ownClass,student,ownStudent;
        commands.map(item => {
           if(item.id == '5-4'){
               groupCommands = item;
           } else if(item.id == '5-4-1' || item.id == '5-4-2' || item.id == '5-4-3'|| item.id == '5-4-4'|| item.id == '5-4-5'|| item.id == '5-4-6'){
               //班级管理
               if(item.commands && item.commands.length > 0){
                   for(let j=0;j<item.commands.length;j++){
                       groupCommands.commands.push(item.commands[j]);
                   }
                   item.commands = [];
               }
               sonArray.push(item);
           }else if(item.id == '6-1'){
               //我的班级
               ownClass = item;
           }else if(item.id == '6-1-1' || item.id == '6-1-2' || item.id == '6-1-3'|| item.id == '6-1-4'
               || item.id == '6-1-5'|| item.id == '6-1-6'){
               //班级管理
               if(item.commands && item.commands.length > 0){
                   for(let j=0;j<item.commands.length;j++){
                       ownClass.commands.push(item.commands[j]);
                   }
                   item.commands = [];
               }
               sonOwnClass.push(item);
           }else if(item.id == '3-2'){
               //学员管理
               student = item;
           }else if(item.id == '3-2-1' || item.id == '3-2-2' || item.id == '3-2-3'|| item.id == '3-2-4'){
               //学员管理
               if(item.commands && item.commands.length > 0){
                   for(let j=0;j<item.commands.length;j++){
                       student.commands.push(item.commands[j]);
                   }
                   item.commands = [];
               }
               sonStudentArray.push(item);
           }else if(item.id == '2-3'){
               //我的学员
               ownStudent = item;
           }else if(item.id == '2-3-1' || item.id == '2-3-2' || item.id == '2-3-3'|| item.id == '2-3-4'){
               //我的学员
               if(item.commands && item.commands.length > 0){
                   for(let j=0;j<item.commands.length;j++){
                       ownStudent.commands.push(item.commands[j]);
                   }
                   item.commands = [];
               }
               sonOwnStudentArray.push(item);
           }else{
               array.push(item);
           }
        });
        if(groupCommands && groupCommands.id){
            groupCommands.sonResource = sonArray;
            array.push(groupCommands);
        }
        if(ownClass && ownClass.id){
            ownClass.sonResource = sonOwnClass;
            array.push(ownClass);
        }
        if(student && student.id){
            student.sonResource = sonStudentArray;
            array.push(student);
        }
        if(ownStudent && ownStudent.id){
            ownStudent.sonResource = sonOwnStudentArray;
            array.push(ownStudent);
        }
    }
    return {hasChangeGroupBtn, menu, access, commands, profile};
}
