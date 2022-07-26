import ValidationEmail from './ValidationEmail.js';

function renderValidationEmail(options) {
  const inputName = options.inputName ?? '';
  const components = [];

  document.querySelectorAll(`${options.className}__input[name="${inputName}"]`)
    .forEach((element) => {
      components.push(new ValidationEmail({
        message: options.message,
        event: options.event,
        element,
      }));
    });

  return components;
}

renderValidationEmail({
  className: '.text-field',
  inputName: 'email',
  event: 'change',
});
