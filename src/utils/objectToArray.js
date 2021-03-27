
export default function (obj) {
  const keys = Object.keys(obj);
  let arr = [];

  keys.map(key => {
    arr.push({
      id: key,
      name: obj[key]
    });
  });

  return arr;
}

/**
 * 数组里面的元素转为int
 * @param data
 * @returns {Array}
 */
export function changeArrayItemToInt(data){
    let retval = [];
    if(data && data.length > 0){
        data.map(item => {
          retval.push(Number(item));
        });
    }
    return retval;
}

/**
 * 数组转换为字符串
 * @param data
 * @returns {string}
 */
export function changeArrayItemToString(data){
    let retval = "";
    if(data && data.length > 0){
        console.log(data);
        let idx = 1;
        data.map(item => {
            retval += item;
            if(idx != data.length){
                retval += ",";
            }
            idx ++;
        });
    }
    return retval;
}


/**
 * 对象数组转换为字符串
 * @param data
 * @returns {string}
 */
export function changeObjArrayItemToString(data,key){
    let retval = "";
    if(data && data.length > 0){
        let idx = 1;
        data.map(item => {
            retval += item[key];
            if(idx != data.length){
                retval += "/";
            }
            idx ++;
        });
    }
    return retval;
}

/**
 * 数组转换为字符串
 * @param data
 * @returns {string}
 */
export function changeStringToArrayInt(data){
    let retval = [];
    if (data && data.indexOf(",") != -1) {
        retval = data.split(",");
    } else if(data){
        retval.push(data);
    }
    retval = changeArrayItemToInt(retval);
    return retval;
}

/**
 * js实现深拷贝
 * @param obj
 * @returns {*}
 */
export function deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    // Date类型
    if (obj instanceof Date) {
        const copy = new Date()
        copy.setTime(obj.getTime())
        return copy
    }
    // 正则类型类型
    if (obj instanceof RegExp) {
        const Constructor = obj.constructor
        return new Constructor(obj)
    }
    // 如果是数组等引用数据类型
    if(obj && typeof obj==="object"){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}

/**
 * 获取某个元素在数组中的下标
 * @param obj  数组
 * @param aimObj  目标元素
 * @param field  比较属性
 * @returns {number}
 */
export function getArrayIndex(obj, aimObj, field){
    if(field){
        for(let i=0;i<=obj.length;i++){
            if(obj[i][field] == aimObj[field]){
                return i;
            }
        }
    }else{
        for(let i=0;i<=obj.length;i++){
            if(obj[i] == aimObj){
                return i;
            }
        }
    }
    return 0;
}

/**
 * 获取数组中的某个子数组
 * @param obj  数组对象
 * @param fromIndex  从第几个下标开始
 * @param toIndex 到第几个下标结束
 * @returns {Array}
 */
export function getSubArray(obj, fromIndex, toIndex){
    let subArray = [];
    for(let i=0;i<=obj.length;i++){
        if(i >= fromIndex && i<=toIndex){
            subArray.push(deepClone(obj[i]));
        }
    }
    return subArray;
}

/**
 * 将一个数组追加到一个数组上
 * @param obj
 * @param objAim
 * @returns {*}
 */
export function arrayAppend(obj, objAim){
    if(!obj){
        obj = [];
    }
    if(objAim.length > 0){
        objAim.map(item => {
            obj.push(deepClone(item));
        });
    }
    return obj;
}

