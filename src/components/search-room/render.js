import SearchRoom from './SearchRoom.js';

function renderDropDown(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new SearchRoom(element));
  });
  return components;
}

renderDropDown('.js-search-room');
