function insertAct(rootData, data) {
  if (rootData.id === data.parentId) {
    if (!rootData.children) {
      rootData.children = [];
    }

    rootData.children.push({
      id: data.id,
      name: data.name,
      parentId: data.parentId,
      type: 'act',
    });
  } else {
    if (rootData.children && rootData.children.length) {
      rootData.children.map(item => {
        insertAct(item, data);
      });
    }
  }
}

function getActTree(data) {
  let act = [];

  data.map(item => {
    if (item.id === item.rootId) {
      act.push({
        id: item.id,
        parentId: item.parentId,
        name: item.name,
        type: 'act',
      });
    } else {
      const rootItem = act.filter(actItem => (item.rootId === actItem.id));

      if (rootItem.length) {
        rootItem.map(root => {
          insertAct(root, item);
        });
      }
    }
  });

  return act;
}

export default function (data, isAll) {
  let act = [];

  data.orgList.map((org) => {
    if (data.actListMap[org.cId].length) {
      let actList = data.actListMap[org.cId];

      if (!isAll) {
        actList = actList.filter(act => (act.level < 3))
      }

      const temp = {
        id: org.cId,
        name: org.cName,
        type: 'group',
        children: getActTree(actList)
      };

      act.push(temp)
    }
  });

  return act;
}