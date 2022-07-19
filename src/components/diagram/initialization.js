import Diagram from './Diagram.js';

function renderDropDown(className) {
  const components = [];
  document.querySelectorAll(className).forEach(() => {
    components.push(new Diagram(className));
  });
  return components;
}

renderDropDown('.js-diagram');
