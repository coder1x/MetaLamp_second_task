import SearchRoom from './SearchRoom.js';

function renderSearchRoom(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new SearchRoom(className, elem));
  });
  return objMas;
}

renderSearchRoom('.js-search-room');
renderSearchRoom('.js-booking');
