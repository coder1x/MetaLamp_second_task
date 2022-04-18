import MaskedTextField from './MaskedTextField.js';

function renderMasked(options) {
  const objMas = [];
  document.querySelectorAll(options.className).forEach((elem) => {
    objMas.push(new MaskedTextField({
      className: options.className,
      message: options.message,
      elem,
    }));
  });
  return objMas;
}

renderMasked({
  className: '.js-masked-date',
  message: 'Введена некорректная дата!',
});
