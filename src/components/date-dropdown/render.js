import DateDropDown from './DateDropDown.js';

function renderComponent(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new DateDropDown(className, elem));
  });
  return objMas;
}

renderComponent('.js-date-dropdown');
