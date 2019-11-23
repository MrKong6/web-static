function insertPermissions(rootData, data) {
  if (rootData.cId === data.cParentId) {
    if (data.cCommandTypeId) {
      if (!rootData.action) {
        rootData.action = [];
      }

      rootData.action.push(data);
    } else {
      if (!rootData.children) {
        rootData.children = [];
      }

      rootData.children.push(data);
    }
  } else {
    if (rootData.children && rootData.children.length) {
      rootData.children.map((item) => {
        insertPermissions(item, data);
      })
    }
  }
}

export default function (data) {
  let tree = [];

  if (data.length) {
    //先遍历查找根节点
    data.map((item) => {
        if (item.cId === item.cRootId) {
            tree.push(item);
        }
    })
    data.map((item) => {
      if (item.cId !== item.cRootId) {
        const rootItem = tree.find((treeItem) => {
          return item.cRootId === treeItem.cId
        })

        if (rootItem) {
          insertPermissions(rootItem, item);
        }
      }
    })
  }
    // tree = [{
    //     "cId": "7",
    //     "cRootId": "7",
    //     "cParentId": "7",
    //     "cNameShort": "系统",
    //     "cNameLong": "系统管理",
    //     "cAction": "/ajax/sys/",
    //     "cWidgetTypeId": 1,
    //     "cOrderNum": 7,
    //     "cIcon": "",
    //     "children": [{
    //         "cId": "7-1",
    //         "cRootId": "7",
    //         "cParentId": "7",
    //         "cNameShort": "",
    //         "cNameLong": "组织管理",
    //         "cAction": "/ajax/sys/",
    //         "cWidgetTypeId": 2,
    //         "cOrderNum": 1,
    //         "cIcon": "",
    //         children:[{
    //             "cId": "7-1-1",
    //             "cRootId": "7",
    //             "cParentId": "7-1",
    //             "cNameShort": "",
    //             "cNameLong": "组织管理子",
    //             "cAction": "/ajax/sys/",
    //             "cWidgetTypeId": 2,
    //             "cOrderNum": 1,
    //             "cIcon": "",
    //             "action": [{
    //                 "cId": "7-1-1",
    //                 "cRootId": "7",
    //                 "cParentId": "7-1",
    //                 "cNameShort": "",
    //                 "cNameLong": "新建",
    //                 "cAction": "/ajax/sys/org/add.do",
    //                 "cWidgetTypeId": 3,
    //                 "cOrderNum": 1,
    //                 "cIcon": "",
    //                 "cCommandTypeId": "1"
    //             }, {
    //                 "cId": "7-1-2",
    //                 "cRootId": "7",
    //                 "cParentId": "7-1",
    //                 "cNameShort": "",
    //                 "cNameLong": "编辑",
    //                 "cAction": "/ajax/sys/org/mod.do",
    //                 "cWidgetTypeId": 3,
    //                 "cOrderNum": 2,
    //                 "cIcon": "",
    //                 "cCommandTypeId": "2"
    //             }, {
    //                 "cId": "7-1-3",
    //                 "cRootId": "7",
    //                 "cParentId": "7-1",
    //                 "cNameShort": "",
    //                 "cNameLong": "删除",
    //                 "cAction": "/ajax/sys/org/del.do",
    //                 "cWidgetTypeId": 3,
    //                 "cOrderNum": 3,
    //                 "cIcon": "",
    //                 "cCommandTypeId": "3"
    //             }]
    //         }]
    //     }, {
    //         "cId": "7-2",
    //         "cRootId": "7",
    //         "cParentId": "7",
    //         "cNameShort": "",
    //         "cNameLong": "角色管理",
    //         "cAction": "/ajax/sys/role/",
    //         "cWidgetTypeId": 2,
    //         "cOrderNum": 2,
    //         "cIcon": "",
    //         "action": [{
    //             "cId": "7-2-1",
    //             "cRootId": "7",
    //             "cParentId": "7-2",
    //             "cNameShort": "",
    //             "cNameLong": "新建",
    //             "cAction": "/ajax/sys/role/add.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 1,
    //             "cIcon": "",
    //             "cCommandTypeId": "1"
    //         }, {
    //             "cId": "7-2-2",
    //             "cRootId": "7",
    //             "cParentId": "7-2",
    //             "cNameShort": "",
    //             "cNameLong": "编辑",
    //             "cAction": "/ajax/sys/role/mod.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 2,
    //             "cIcon": "",
    //             "cCommandTypeId": "2"
    //         }, {
    //             "cId": "7-2-3",
    //             "cRootId": "7",
    //             "cParentId": "7-2",
    //             "cNameShort": "",
    //             "cNameLong": "删除",
    //             "cAction": "/ajax/sys/role/del.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 3,
    //             "cIcon": "",
    //             "cCommandTypeId": "3"
    //         }]
    //     }, {
    //         "cId": "7-3",
    //         "cRootId": "7",
    //         "cParentId": "7",
    //         "cNameShort": "",
    //         "cNameLong": "权限管理",
    //         "cAction": "/ajax/sys/role/",
    //         "cWidgetTypeId": 2,
    //         "cOrderNum": 3,
    //         "cIcon": "",
    //         "action": [{
    //             "cId": "7-3-1",
    //             "cRootId": "7",
    //             "cParentId": "7-3",
    //             "cNameShort": "",
    //             "cNameLong": "授权",
    //             "cAction": "/ajax/sys/role/auth.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 1,
    //             "cIcon": "",
    //             "cCommandTypeId": "4"
    //         }]
    //     }, {
    //         "cId": "7-4",
    //         "cRootId": "7",
    //         "cParentId": "7",
    //         "cNameShort": "",
    //         "cNameLong": "用户管理",
    //         "cAction": "/ajax/sys/user/",
    //         "cWidgetTypeId": 2,
    //         "cOrderNum": 4,
    //         "cIcon": "",
    //         "action": [{
    //             "cId": "7-4-1",
    //             "cRootId": "7",
    //             "cParentId": "7-4",
    //             "cNameShort": "",
    //             "cNameLong": "新建",
    //             "cAction": "/ajax/sys/user/add.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 1,
    //             "cIcon": "",
    //             "cCommandTypeId": "1"
    //         }, {
    //             "cId": "7-4-2",
    //             "cRootId": "7",
    //             "cParentId": "7-4",
    //             "cNameShort": "",
    //             "cNameLong": "编辑",
    //             "cAction": "/ajax/sys/user/mod.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 2,
    //             "cIcon": "",
    //             "cCommandTypeId": "2"
    //         }, {
    //             "cId": "7-4-3",
    //             "cRootId": "7",
    //             "cParentId": "7-4",
    //             "cNameShort": "",
    //             "cNameLong": "删除",
    //             "cAction": "/ajax/sys/user/del.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 3,
    //             "cIcon": "",
    //             "cCommandTypeId": "3"
    //         }, {
    //             "cId": "7-4-4",
    //             "cRootId": "7",
    //             "cParentId": "7-4",
    //             "cNameShort": "",
    //             "cNameLong": "启用/停用",
    //             "cAction": "/ajax/sys/user/enable.do",
    //             "cWidgetTypeId": 3,
    //             "cOrderNum": 4,
    //             "cIcon": "",
    //             "cCommandTypeId": "5"
    //         }]
    //     }]
    // }];
  return tree;
}