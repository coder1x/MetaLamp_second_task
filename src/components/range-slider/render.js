import RangeSlider from './RangeSlider.js';

function renderRangeSlider(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new RangeSlider(className, element));
  });

  return components;
}

renderRangeSlider('.js-range-slider');
