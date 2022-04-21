import DateDropDown from './DateDropDown.js';

function renderComponent(className) {
  const components = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new DateDropDown(className, elem));
  });
  return components;
}

renderComponent('.js-date-dropdown');
