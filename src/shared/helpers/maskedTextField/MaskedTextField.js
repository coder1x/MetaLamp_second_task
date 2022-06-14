import autoBind from 'auto-bind';

import message from '@shared/helpers/message/message';

class MaskedTextField {
  constructor(options) {
    autoBind(this);
    this.message = options.message;
    this._tempValue = '';
    const { element } = options;
    if (element) { this._bindEvent(element); }
  }

  _validateData(data) {
    const {
      value,
      day,
      lastDate,
      point,
      month,
      year,
    } = data;

    if (value.match(new RegExp(`${day}\\.?$`))) {
      return (value.length === 2 && lastDate ? point : value);
    }

    if (value.match(new RegExp(`${month}\\.?$`))) {
      return (value.length === 5 && lastDate ? point : value);
    }

    if (value.match(new RegExp(year))) {
      return value;
    }

    if (this._tempValue.length === 1) {
      return (value.substr(0, value.length - 1));
    }

    if (this._tempValue.length > value.length) {
      return value;
    }
    return this._tempValue;
  }

  _handleInputInput(event) {
    const domElement = event.target;

    let value = domElement.value.replace(/[^.\d]/g, '');

    const stringLength = value.length;

    const isDay = stringLength === 1;
    const isMonth = stringLength === 4;
    const isValidNumberDay = Number(value) > 3;
    const isValidNumberMonth = Number(value[stringLength - 1]) > 1;

    if (isDay && isValidNumberDay) {
      value = `0${value}`;
    } else if (isMonth && isValidNumberMonth) {
      value = `${value.substr(0, stringLength - 1)}0${value[stringLength - 1]}`;
    }

    const DAY = '^(0|[1-9]|0[1-9]|[12][0-9]|3[01])';
    const MONTH = `${DAY}\\.(0|[1-9]|0[1-9]|1[012])`;
    const YEAR = `${MONTH}\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

    const point = `${value}.`;
    const lastDate = point !== this._tempValue;

    domElement.value = this._validateData({
      value,
      day: DAY,
      lastDate,
      point,
      month: MONTH,
      year: YEAR,
    });

    this._tempValue = domElement.value;

    return true;
  }

  _handleInputChange(event) {
    const { target } = event;
    const REGEXP = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
    const dateTarget = target.value;

    if (!REGEXP.test(dateTarget)) return false;

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

  _bindEvent(elem) {
    elem.addEventListener('change', this._handleInputChange);
    elem.addEventListener('input', this._handleInputInput);
  }
}

export default MaskedTextField;
