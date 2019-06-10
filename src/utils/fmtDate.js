export default function (date) {
  const d = new Date(date);
  const yy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();

  return yy + '-' + mm + '-' + dd
}