import DropDown from './DropDown.js';

function renderDropDown(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new DropDown(className, elem));
  });
  return objMas;
}

renderDropDown('.js-drop-down');
