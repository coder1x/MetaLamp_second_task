import Slider from './Slider.js';

function renderSlider(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new Slider(className, elem));
  });
  return objMas;
}

renderSlider('.js-room-card');
