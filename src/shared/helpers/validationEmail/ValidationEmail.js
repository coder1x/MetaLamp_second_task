import autoBind from 'auto-bind';

import message from '../message/message';

class ValidationEmail {
  constructor(options) {
    autoBind(this);
    this._init(options);
  }

  validateField() {
    if (!this._regExpEmail || !this.inputElement) return false;

    return !!this._regExpEmail.test(this.inputElement.value);
  }

  _init(options) {
    const event = options.event ?? '';
    this._message = options.message ?? 'Вы ввели неверный Email.';
    this.inputElement = options.element;
    // eslint-disable-next-line no-control-regex
    this._regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

    if (event) { this._bindEvent(event); }
  }

  _handleInputElement() {
    if (!this.validateField()) {
      message(this._message);
    }
  }

  _bindEvent(event) {
    if (!this.inputElement) return false;
    this.inputElement.addEventListener(event, this._handleInputElement);
    return true;
  }
}

export default ValidationEmail;
