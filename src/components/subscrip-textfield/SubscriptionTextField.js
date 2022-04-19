import autoBind from 'auto-bind';

import message from '@com/message/message';

import './subscrip-textfield.scss';

import ValidationEmail from '../validation-email/ValidationEmail';

class SubscriptionTextField {
  constructor(className, wrapper) {
    autoBind(this);
    this.input = wrapper.querySelector('input');

    this.link = wrapper.querySelector(`${className}__link`);
    this._valid = new ValidationEmail({
      elem: this.input,
    });

    this._setActions();
  }

  _validEmail() {
    if (this._valid) {
      if (this._valid.validation()) {
        message('Вы оформили подписку.');
      } else {
        message('Вы ввели неверный Email.');
      }
    }
  }

  _handleDomKeydown(event) {
    if (event.key === 'Enter') { this._validEmail(); }
  }

  _handleLinkClick() {
    this._validEmail();
  }

  _setActions() {
    if (!this.input || !this.link) return false;

    this.input.addEventListener('keydown', this._handleDomKeydown);
    this.link.addEventListener('click', this._handleLinkClick);

    return true;
  }
}

export default SubscriptionTextField;
