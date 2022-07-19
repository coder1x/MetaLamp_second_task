import DropDown from './DropDown.js';

function renderDropDown(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new DropDown(className, element));
  });
  return components;
}

renderDropDown('.js-dropdown');
