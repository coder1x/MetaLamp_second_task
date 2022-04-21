import DropDown from './DropDown.js';

function renderDropDown(className) {
  const components = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new DropDown(className, elem));
  });
  return components;
}

renderDropDown('.js-drop-down');
