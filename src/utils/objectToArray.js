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