export default function () {
  const mainElem = document.getElementById('main');
  let nH = document.getElementById('nav') ? document.getElementById('nav').getBoundingClientRect().height : 0;
  let snH = document.getElementById('subNav') ? document.getElementById('subNav').getBoundingClientRect().height : 0;
  let stnH = 0;
  if(document.getElementById('secondSubNav')){
      stnH = document.getElementById('secondSubNav').getBoundingClientRect().height;
  }

  if(mainElem){
      mainElem.style.top = (nH + snH + stnH) + 'px';
  }
}