import ValidateForm from '@shared/helpers/validateForm/ValidateForm';

(() => {
  const className = '.js-search-room';
  const elements = document.querySelectorAll(className);

  if (elements.length === 0) {
    return;
  }

  elements.forEach((element) => {
    new ValidateForm(className, element);
  });
})();
