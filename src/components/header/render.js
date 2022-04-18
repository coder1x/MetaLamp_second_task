import HeaderMenu from './HeaderMenu.js';

function renderHeaderMenu(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new HeaderMenu(className, elem));
  });
  return objMas;
}

renderHeaderMenu('.js-header');
