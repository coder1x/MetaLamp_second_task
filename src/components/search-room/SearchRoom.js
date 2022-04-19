import autoBind from 'auto-bind';

import message from '@com/message/message';

import './search-room.scss';

class SearchRoom {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this._setDom(elem);
    this._setAction();
  }

  _setDom(elem) {
    this._dateInputs = [
      ...elem.querySelectorAll(`${this.className}__date-wrap input`),
    ];
    this._guestsInput = elem.querySelector(
      `${this.className}__dropdown-wrap input`,
    );
    this._buttonEl = elem.querySelector(
      `${this.className}__button-wrap button`,
    );
  }

  _validDate() {
    let input1 = null;
    let input2 = null;

    if (this._dateInputs) { [input1] = this._dateInputs; }

    if (this._dateInputs) { [, input2] = this._dateInputs; }

    let valInput1 = 0;
    let valInput2 = 0;
    if (input1 instanceof HTMLInputElement) { valInput1 = input1.value.length; }

    if (input2 instanceof HTMLInputElement) { valInput2 = input2.value.length; }

    const filled = valInput1 === 10 && valInput2 === 10;

    if (filled) {
      return true;
    }
    return false;
  }

  _validGuests() {
    let value = '';

    if (this._guestsInput instanceof HTMLInputElement) {
      value = this._guestsInput.value;
    }
    const filled = value && value !== 'Сколько гостей';

    if (filled) {
      return true;
    }
    return false;
  }

  _messageErr() {
    if (!this._validDate()) {
      message('Выберите дату.');
      return false;
    }

    if (!this._validGuests()) {
      message('Сколько гостей ?');
      return false;
    }
    return true;
  }

  _handleButtonClick(event) {
    if (!this._messageErr()) {
      event.preventDefault();
    }
  }

  _setAction() {
    if (this._buttonEl) {
      this._buttonEl.addEventListener('click', this._handleButtonClick);
    }
  }
}

export default SearchRoom;
