import CheckBoxList from './CheckBoxList.js';

function renderCheckboxList(className) {
  const components = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new CheckBoxList(className, elem));
  });
  return components;
}

renderCheckboxList('.js-checkbox-list');
