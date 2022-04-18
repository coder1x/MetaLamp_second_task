import SignIn from './SignIn.js';

function renderSignIn(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new SignIn(className, elem));
  });
  return objMas;
}

renderSignIn('.js-sign-in');
