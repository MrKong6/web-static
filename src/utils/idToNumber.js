export default function (id) {
  if (id.indexOf('-')) {
    return parseInt(id.split('-').join(''), 10)
  }

  return parseInt(id, 10)
}