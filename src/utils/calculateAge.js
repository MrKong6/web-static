export default function (birthday) {
  if (!birthday.getFullYear) {
    birthday = new Date(birthday);
  }

  return new Date().getFullYear() - birthday.getFullYear();
}