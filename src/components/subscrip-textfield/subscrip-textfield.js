import autoBind from 'auto-bind';
import './subscrip-textfield.scss';

import { ValidationEmail } from '../validation-email/validation-email';

class SubscriptionTextField {
  constructor(className, wrapper) {
    autoBind(this);
    const input = wrapper.querySelector('input');
    this.input = input;

    this.link = wrapper.querySelector(`${className}__link`);
    this._valid = new ValidationEmail({
      elem: this.input,
    });

    this._setActions();
  }

  _validEmail() {
    if (this._valid) {
      if (this._valid.validation()) {
        // eslint-disable-next-line no-alert
        alert('Вы оформили подписку.');
      } else {
        // eslint-disable-next-line no-alert
        alert('Вы ввели неверный Email.');
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

function renderSubscrip(className) {
  const components = document.querySelectorAll(className);

  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new SubscriptionTextField(className, elem));
  });
  return objMas;
}

renderSubscrip('.js-subscrip-textfield');
