import autoBind from 'auto-bind';

import message from '@com/message/message';

import ValidationEmail from '@shared/helpers/validation-email/ValidationEmail';

class SubscriptionTextField {
  constructor(className, wrapper) {
    autoBind(this);
    this.input = wrapper.querySelector('input');

    this.link = wrapper.querySelector(`${className}__link`);
    this._validationEmail = new ValidationEmail({
      element: this.input,
    });

    this._bindEvent();
  }

  _checkEmail() {
    if (this._validationEmail && this._validationEmail.validateField()) {
      message('Вы оформили подписку.');
    } else {
      message('Вы ввели неверный Email.');
    }
  }

  _handleInputKeydown(event) {
    if (event.key === 'Enter') {
      this._checkEmail();
    }
  }

  _handleLinkClick() {
    this._checkEmail();
  }

  _bindEvent() {
    if (!this.input || !this.link) return false;

    this.input.addEventListener('keydown', this._handleInputKeydown);
    this.link.addEventListener('click', this._handleLinkClick);

    return true;
  }
}

export default SubscriptionTextField;
