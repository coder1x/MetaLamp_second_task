import Booking from './Booking.js';

function renderDropDown(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new Booking(element));
  });
  return components;
}

renderDropDown('.js-booking');
