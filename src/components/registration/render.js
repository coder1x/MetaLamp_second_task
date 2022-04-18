import Registration from './Registration.js';

function renderRegistration(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new Registration(className, elem));
  });
  return objMas;
}

renderRegistration('.js-registration');
