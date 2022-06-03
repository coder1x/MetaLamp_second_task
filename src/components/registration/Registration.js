import autoBind from 'auto-bind';

import message from '@shared/helpers/message/message';

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
    const minLengthName = 3;
    const maxLengthDate = 10;
    const minLengthEmail = 5;
    const minLengthPassword = 6;

    switch (string) {
      case 'name':
        isValid = Registration._checkLength(length < minLengthName, 'Имя');
        break;
      case 'surname':
        isValid = Registration._checkLength(length < minLengthName, 'Фамилию');
        break;
      case 'date':
        isValid = Registration._checkLength(length !== maxLengthDate, 'дату рождения');
        break;
      case 'email':
        isValid = Registration._checkLength(length < minLengthEmail, 'Email');
        break;
      case 'pass':
        isValid = Registration._checkLength(length < minLengthPassword, 'Пароль');
        break;
      default:
        break;
    }
    return isValid;
  }

  _validation() {
    const fields = ['name', 'surname', 'date', 'email', 'pass'];

    for (let i = 0; i < fields.length; i += 1) {
      const item = fields[i];
      const domElement = this.getElement(item);

      if (domElement && !Registration._messageError(item, domElement.value.length)) {
        return false;
      }
    }
    return true;
  }

  _handleButtonClick(event) {
    if (!this._validation()) { event.preventDefault(); }
  }

  _bindEvent() {
    if (this._buttonElement) {
      this._buttonElement.addEventListener('click', this._handleButtonClick);
    }
  }
}

export default Registration;
