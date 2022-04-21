import Slider from './Slider.js';

function renderSlider(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new Slider(className, element));
  });
  return components;
}

renderSlider('.js-room-card');
