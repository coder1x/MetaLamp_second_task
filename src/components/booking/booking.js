import ValidateForm from '@shared/helpers/validateForm/ValidateForm';

(() => {
  const className = '.js-booking';
  const elements = document.querySelectorAll(className);

  if (elements.length === 0) {
    return;
  }

  elements.forEach((element) => {
    new ValidateForm(className, element);
  });
})();
