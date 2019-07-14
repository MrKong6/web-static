export default function (date) {
  const d = new Date(date);
  const yy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();

  return yy + '-' + mm + '-' + dd
}

export function formatWithTime(date) {
    const d = new Date(date);
    const yy = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();

    return yy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute;
}