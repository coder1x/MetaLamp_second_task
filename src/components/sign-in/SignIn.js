import autoBind from 'auto-bind';

import message from '@shared/helpers/message/message';

class SignIn {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this._setDomElement(element);
    this._setAction();
  }

  _setDomElement(element) {
    this._emailInputs = element.querySelector(`${this.className}__email-wrapper input`);
    this._passwordInput = element.querySelector(`${this.className}__password-wrapper input`);
    this._buttonElement = element.querySelector(`${this.className}__button-wrapper button`);
  }

  _checkField() {
    if (!this._emailInputs || !this._passwordInput) {
      return false;
    }

    if (!this._emailInputs.value) {
      message('Введите Email');
      return false;
    }

    if (!this._passwordInput.value) {
      message('Введите пароль');
      return false;
    }
    return true;
  }

  _handleButtonClick(event) {
    if (!this._checkField()) {
      event.preventDefault();
    }
  }

  _setAction() {
    if (this._buttonElement) {
      this._buttonElement.addEventListener('click', this._handleButtonClick);
    }
  }
}

export default SignIn;
