import MaskedTextField from './MaskedTextField.js';

function renderMasked(options) {
  const components = [];
  document.querySelectorAll(options.className).forEach((element) => {
    components.push(new MaskedTextField({
      className: options.className,
      message: options.message,
      element,
    }));
  });
  return components;
}

renderMasked({
  className: '.js-masked-date',
  message: 'Введена некорректная дата!',
});
