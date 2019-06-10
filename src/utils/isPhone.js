export default function () {
  const point = 1025;

  if (window.screen.width < point) {
    return true;
  }

  return false;
}