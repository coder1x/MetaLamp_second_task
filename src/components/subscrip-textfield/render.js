import SubscriptionTextField from './SubscriptionTextField.js';

function renderSubscrip(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new SubscriptionTextField(className, element));
  });
  return components;
}

renderSubscrip('.js-subscrip-textfield');
