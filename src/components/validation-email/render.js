import ValidationEmail from './ValidationEmail.js';

function renderValidationEmail(options) {
  const name = options.inputName ?? '';
  const input = `${options.className}__input[name="${name}"]`;
  const objMas = [];

  document.querySelectorAll(input).forEach((elem) => {
    objMas.push(new ValidationEmail({
      message: options.message,
      event: options.event,
      elem,
    }));
  });

  return objMas;
}

renderValidationEmail({
  className: '.text-field',
  inputName: 'email',
  event: 'change',
});
