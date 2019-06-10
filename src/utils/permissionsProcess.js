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
    debugger;
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

  return tree;
}