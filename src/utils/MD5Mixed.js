import MD5 from 'crypto-js/md5';

export default function (string) {
  return MD5(string).toString();
}