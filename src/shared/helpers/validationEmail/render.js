import ValidationEmail from './ValidationEmail.js';

function renderValidationEmail(options) {
  const inputName = options.inputName ?? '';
  const selector = `${options.className}__input[name="${inputName}"]`;
  const components = [];

  document.querySelectorAll(selector).forEach((element) => {
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
