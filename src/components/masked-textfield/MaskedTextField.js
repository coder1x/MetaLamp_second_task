import autoBind from 'auto-bind';

import message from '@com/message/message';

class MaskedTextField {
  constructor(options) {
    autoBind(this);
    this.message = options.message;
    this._tempValue = '';
    const { element } = options;
    if (element) { this._setActions(element); }
  }

  _handleInput(event) {
    const domElement = event.target;

    let value = domElement.value.replace(/[^.\d]/g, '');

    const stringLength = value.length;
    if (stringLength === 1 && Number(value) > 3) {
      value = `0${value}`;
    } else if (stringLength === 4 && Number(value[stringLength - 1]) > 1) {
      value = `${value.substr(0, stringLength - 1)}0${value[stringLength - 1]}`;
    }

    const day = '^(0|[1-9]|0[1-9]|[12][0-9]|3[01])';
    const month = `${day}\\.(0|[1-9]|0[1-9]|1[012])`;
    const year = `${month}\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

    const point = `${value}.`;
    const lastDate = point !== this._tempValue;

    if (value.match(new RegExp(`${day}\\.?$`))) {
      domElement.value = value.length === 2 && lastDate ? point : value;
    } else if (value.match(new RegExp(`${month}\\.?$`))) {
      domElement.value = value.length === 5 && lastDate ? point : value;
    } else if (value.match(new RegExp(year))) {
      domElement.value = value;
    } else if (this._tempValue.length === 1) {
      domElement.value = value.substr(0, value.length - 1);
    } else if (this._tempValue.length > value.length) {
      domElement.value = value;
    } else {
      domElement.value = this._tempValue;
    }

    this._tempValue = domElement.value;
  }

  _handleInputChange(event) {
    const { target } = event;
    const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
    const dateTarget = target.value;

    if (!regexp.test(dateTarget)) return false;

    const dates = dateTarget.split('.').map((item) => Number(item.replace(/^0/, '')));
    dates[1] -= 1;
    const date = new Date(dates[2], dates[1], dates[0]);

    const day = date.getDate() === dates[0];
    const month = date.getMonth() === dates[1];
    const year = date.getFullYear() === dates[2];

    if (year && month && day) {
      return true;
    }

    message(this.message);

    return false;
  }

  _setActions(elem) {
    elem.addEventListener('change', this._handleInputChange);
    elem.addEventListener('input', this._handleInput);
  }
}

export default MaskedTextField;
