import Registration from './Registration.js';

function renderRegistration(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new Registration(className, element));
  });
  return components;
}

renderRegistration('.js-registration');
