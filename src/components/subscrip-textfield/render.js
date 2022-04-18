import SubscriptionTextField from './SubscriptionTextField.js';

function renderSubscrip(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new SubscriptionTextField(className, elem));
  });
  return objMas;
}

renderSubscrip('.js-subscrip-textfield');
