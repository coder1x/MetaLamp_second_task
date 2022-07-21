import MaskedTextField from '@shared/helpers/maskedTextField/maskedTextField';

(() => {
  const inputs = document.querySelectorAll('.js-text-field input');

  if (inputs.length === 0) {
    return;
  }

  inputs.forEach((input) => {
    new MaskedTextField({
      element: input,
    });
  });
})();
