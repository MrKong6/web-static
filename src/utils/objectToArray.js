
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