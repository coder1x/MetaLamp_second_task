import autoBind from 'auto-bind';

import TextField from '@com/text-field/TextField';
import message from '@com/message/message';

class SignIn {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this._setDomElement(element);
    this._bindEvent();
  }

  _setDomElement(element) {
    const emailElement = element.querySelector(`${this.className}__email-wrapper`);
    this._passwordInput = element.querySelector(`${this.className}__password-wrapper input`);
    this._buttonElement = element.querySelector(`${this.className}__button-wrapper button`);

    const textFieldEmail = new TextField({
      element: emailElement.firstElementChild,
      type: 'email',
    });

    this._emailInputs = textFieldEmail.inputElement;
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

  _bindEvent() {
    this._buttonElement.addEventListener('click', this._handleButtonClick);
  }
}

export default SignIn;
