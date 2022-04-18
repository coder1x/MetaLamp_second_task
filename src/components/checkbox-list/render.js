import CheckBoxList from './CheckBoxList.js';

function renderCheckboxList(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new CheckBoxList(className, elem));
  });
  return objMas;
}

renderCheckboxList('.js-checkbox-list');
