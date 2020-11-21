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

//根据组织层级获取下级组织列表
export function sonListByGroup(orgList, sonList) {
    orgList.map(item => {
        if (item.cId && item.cName) {
            sonList.push({id:item.cId,name:item.cName});
        }
        if (item.children && item.children.length > 0) {
            item.children.map(sonItem => {
                if (sonItem.cId && sonItem.cName) {
                    sonList.push({id:sonItem.cId,name:sonItem.cName});
                    if (sonItem.children && sonItem.children.length > 0) {
                        sonListByGroup(sonItem.children, sonList)
                    }
                }
            })
        }
    })
}

//根据组织层级和组织id获取元素
export function getSonListByGroupId(orgList, orgId) {
    let data = null;
    for(let i=0;i<orgList.length;i++){
        let item = orgList[i];
        if (item.cId == orgId) {
            data = item;
            break;
        } else {
            if (item.children && item.children.length > 0) {
                for(let j=0;j<item.children.length;j++){
                    let sonItem = item.children[j];
                    if (sonItem.cId == orgId) {
                        data = item;
                        break;
                    }else{
                        data = getSonListByGroupId(sonItem.children, orgId)
                    }
                }
            }
            if(data){
                break;
            }
        }
    }
    return data;
}

export default function (data) {
    let group = [];

    data.map((item, index) => {
        if (index === 0) {
            if (item.cId === item.cRootId) {
                group.push(item);
            } else {
                let temp = {cId: item.cRootId, children: []};

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
