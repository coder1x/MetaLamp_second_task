import autoBind from 'auto-bind';

import message from '@shared/helpers/message/message';

import ValidationEmail from '@shared/helpers/validationEmail/ValidationEmail';

class SubscriptionTextField {
  constructor(className, wrapper) {
    autoBind(this);
    this.input = wrapper.querySelector(`${className}__input`);
    this.link = wrapper.querySelector(`${className}__link`);
    this._validationEmail = new ValidationEmail({
      element: this.input,
    });

    this._bindEvent();
  }

  _checkEmail(event) {
    if (this._validationEmail && this._validationEmail.validateField()) {
      message('Вы оформили подписку.');
    } else {
      message('Вы ввели неверный Email.');
      event.preventDefault();
    }
  }

  _handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      this._checkEmail(event);
    }
  }

  _handleLinkClick(event) {
    this._checkEmail(event);
  }

  _bindEvent() {
    if (!this.input || !this.link) {
      return false;
    }

    this.input.addEventListener('keydown', this._handleInputKeyDown);
    this.link.addEventListener('click', this._handleLinkClick);

    return true;
  }
}

export default SubscriptionTextField;
