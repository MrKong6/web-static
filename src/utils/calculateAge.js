export default function (birthday) {
  if(!birthday){
    birthday = new Date();
  }
  if (!birthday || !birthday.getFullYear) {
    birthday = new Date(birthday);
  }

  return new Date().getFullYear() - birthday.getFullYear();
}