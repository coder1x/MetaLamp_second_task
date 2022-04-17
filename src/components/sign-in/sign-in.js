import autoBind from 'auto-bind';
import './sign-in.scss';

class SignIn {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this._setDom(elem);
    this._setAction();
  }

  _setDom(elem) {
    const email = `${this.className}__email-wrap input`;
    const pass = `${this.className}__pass-wrap input`;
    const submit = `${this.className}__button-wrap button`;

    this._emailInputs = elem.querySelector(email);
    this._passInput = elem.querySelector(pass);
    this._buttonEl = elem.querySelector(submit);
  }

  _validation() {
    if (!this._emailInputs || !this._passInput) return false;

    if (!this._emailInputs.value) {
      // eslint-disable-next-line no-alert
      alert('Введите Email');
      return false;
    }

    if (!this._passInput.value) {
      // eslint-disable-next-line no-alert
      alert('Введите пароль');
      return false;
    }
    return true;
  }

  _handleButtonClick(event) {
    if (!this._validation()) { event.preventDefault(); }
  }

  _setAction() {
    if (this._buttonEl) {
      this._buttonEl.addEventListener('click', this._handleButtonClick);
    }
  }
}

function renderSignIn(className) {
  const components = document.querySelectorAll(className);
  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new SignIn(className, elem));
  });
  return objMas;
}

renderSignIn('.js-sign-in');
