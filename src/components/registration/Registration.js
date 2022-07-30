import autoBind from 'auto-bind';

import TextField from '@com/text-field/TextField';
import message from '@com/message/message';

class Registration {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this.element = element;
    this._setDomElement();
    this._bindEvent();
  }

  getElement(string) {
    return this.element.querySelector(`${this.className}__${string}-wrapper input`);
  }

  _setDomElement() {
    this._buttonElement = this.element.querySelector(
      `${this.className}__submit-wrapper button`,
    );

    const textFieldDate = this.element.querySelector(`${this.className}__date-wrapper`);
    const textFieldEmail = this.element.querySelector(`${this.className}__email-wrapper`);

    new TextField({
      element: textFieldDate.firstElementChild,
      type: 'date',
    });

    new TextField({
      element: textFieldEmail.firstElementChild,
      type: 'email',
    });
  }

  static _checkLength(result, text) {
    if (result) {
      message(`Введите ${text}`);
      return false;
    }
    return true;
  }

  static _messageError(string, length) {
    let isValid = true;
    const MIN_LENGTH_NAME = 3;
    const MAX_LENGTH_DATE = 10;
    const MIN_LENGTH_EMAIL = 5;
    const MIN_LENGTH_PASSWORD = 6;

    switch (string) {
      case 'name':
        isValid = Registration._checkLength(length < MIN_LENGTH_NAME, 'Имя');
        break;
      case 'surname':
        isValid = Registration._checkLength(length < MIN_LENGTH_NAME, 'Фамилию');
        break;
      case 'date':
        isValid = Registration._checkLength(length !== MAX_LENGTH_DATE, 'дату рождения');
        break;
      case 'email':
        isValid = Registration._checkLength(length < MIN_LENGTH_EMAIL, 'Email');
        break;
      case 'password':
        isValid = Registration._checkLength(length < MIN_LENGTH_PASSWORD, 'Пароль');
        break;
      default:
        break;
    }
    return isValid;
  }

  _validation() {
    const FIELDS = ['name', 'surname', 'date', 'email', 'password'];

    for (let i = 0; i < FIELDS.length; i += 1) {
      const item = FIELDS[i];
      const domElement = this.getElement(item);

      if (domElement && !Registration._messageError(item, domElement.value.length)) {
        return false;
      }
    }
    return true;
  }

  _handleButtonClick(event) {
    if (!this._validation()) {
      event.preventDefault();
    }
  }

  _bindEvent() {
    this._buttonElement.addEventListener('click', this._handleButtonClick);
  }
}

export default Registration;
