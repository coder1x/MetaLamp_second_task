import RangeSlider from './RangeSlider.js';

function renderRangeSlider(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new RangeSlider(className, elem));
  });

  return objMas;
}

renderRangeSlider('.js-range-slider');
