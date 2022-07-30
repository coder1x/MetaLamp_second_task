import autoBind from 'auto-bind';

import TextField from '@com/text-field/TextField';
import message from '@com/message/message';

class SubscriptionTextField {
  constructor(className, wrapper) {
    autoBind(this);
    this.link = wrapper.querySelector(`${className}__link`);
    this._init(wrapper);
    this._bindEvent();
  }

  _init(wrapper) {
    const textFieldElement = wrapper.querySelector('.js-text-field');
    this._textField = new TextField({
      element: textFieldElement,
      type: 'email',
    });

    this.input = this._textField.inputElement;
  }

  _checkEmail(event) {
    if (this._textField.validateFieldEmail()) {
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
