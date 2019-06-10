function insertGroup(rootData, data) {
  if (rootData.cId === data.cParentId) {
    if (!rootData.children) {
      rootData.children = [];
    }

    rootData.children.push(data);
  } else {
    if (rootData.children && rootData.children.length) {
      rootData.children.map(item => {
        insertGroup(item, data);
      });
    }
  }
}

export default function (data) {
  let group = [];

  data.map((item, index) => {
    if (index === 0) {
      if (item.cId === item.cRootId) {
        group.push(item);
      } else {
        let temp = { cId: item.cRootId, children: [] };

        temp.children.push(item);
        group.push(temp);
      }
    } else {
      const rootItem = group.filter(groupItem => {
        return item.cRootId === groupItem.cId;
      });

      if (rootItem.length) {
        rootItem.map(root => {
          insertGroup(root, item);
        });
      }
    }
  });

  return group;
}
