import SearchRoom from './SearchRoom.js';

function renderSearchRoom(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new SearchRoom(className, element));
  });
  return components;
}

renderSearchRoom('.js-search-room');
renderSearchRoom('.js-booking');
