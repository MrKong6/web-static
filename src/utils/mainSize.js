export default function () {
  const mainElem = document.getElementById('main');
  let nH = document.getElementById('nav') ? document.getElementById('nav').getBoundingClientRect().height : 0;
  let snH = document.getElementById('subNav') ? document.getElementById('subNav').getBoundingClientRect().height : 0;

  mainElem.style.top = (nH + snH) + 'px';
}