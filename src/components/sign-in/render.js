import SignIn from './SignIn.js';

function renderSignIn(className) {
  const components = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new SignIn(className, element));
  });
  return components;
}

renderSignIn('.js-sign-in');
