function insertGroup(rootData, data) {
  if (rootData.id === data.parentId) {
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
    if (item.id === item.rootId) {
      group.push(item);

    } else {
      const rootItem = group.filter(groupItem => {
        return item.rootId === groupItem.id;
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
