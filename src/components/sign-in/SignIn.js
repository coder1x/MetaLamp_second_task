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
    this._emailInputs = elem.querySelector(
      `${this.className}__email-wrap input`,
    );
    this._passInput = elem.querySelector(
      `${this.className}__pass-wrap input`,
    );
    this._buttonEl = elem.querySelector(
      `${this.className}__button-wrap button`,
    );
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

export default SignIn;
