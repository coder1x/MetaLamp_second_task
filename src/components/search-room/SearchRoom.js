import autoBind from 'auto-bind';

import message from '@shared/helpers/message/message';

class SearchRoom {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this._setDomElement(element);
    this._bindEvent();
  }

  _setDomElement(element) {
    this._dateInputs = [
      ...element.querySelectorAll(`${this.className}__date-wrapper input`),
    ];
    this._guestsInput = element.querySelector(
      `${this.className}__dropdown-wrapper input`,
    );
    this._buttonElement = element.querySelector(
      `${this.className}__button-wrapper button`,
    );
  }

  _validateDate() {
    let inputFrom = null;
    let inputTo = null;

    if (this._dateInputs) { [inputFrom] = this._dateInputs; }

    if (this._dateInputs) { [, inputTo] = this._dateInputs; }

    let valueInputFrom = 0;
    let valueInputTo = 0;

    if (inputFrom instanceof HTMLInputElement) {
      valueInputFrom = inputFrom.value.length;
    }

    if (inputTo instanceof HTMLInputElement) {
      valueInputTo = inputTo.value.length;
    }

    const MAX_LENGTH_DATE = 10;
    const isLengthString = valueInputFrom === MAX_LENGTH_DATE && valueInputTo === MAX_LENGTH_DATE;

    if (isLengthString) {
      return true;
    }
    return false;
  }

  _validateGuests() {
    let value = '';

    if (this._guestsInput instanceof HTMLInputElement) {
      value = this._guestsInput.value;
    }
    const isValue = value && value !== 'Сколько гостей';

    if (isValue) {
      return true;
    }
    return false;
  }

  _messageError() {
    if (!this._validateDate()) {
      message('Выберите дату.');
      return false;
    }

    if (!this._validateGuests()) {
      message('Сколько гостей ?');
      return false;
    }
    return true;
  }

  _handleButtonClick(event) {
    if (!this._messageError()) {
      event.preventDefault();
    }
  }

  _bindEvent() {
    if (this._buttonElement) {
      this._buttonElement.addEventListener('click', this._handleButtonClick);
    }
  }
}

export default SearchRoom;
