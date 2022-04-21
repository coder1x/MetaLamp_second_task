import HeaderMenu from './HeaderMenu.js';

function renderHeaderMenu(className) {
  const components = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new HeaderMenu(className, elem));
  });
  return components;
}

renderHeaderMenu('.js-header');
