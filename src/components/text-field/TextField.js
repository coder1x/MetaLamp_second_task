import autoBind from 'auto-bind';
import message from '@com/message/message';

class TextField {
  constructor(options = {}) {
    autoBind(this);
    this.options = options;
    this.element = options.element;
    this.className = '.js-text-field';
    this._init();
  }

  isVisible() {
    const attribute = this.element.getAttribute('data-type');
    return attribute !== 'hidden';
  }

  validateFieldEmail() {
    if (!this._regExpEmail || !this.inputElement) {
      return false;
    }

    return !!this._regExpEmail.test(this.inputElement.value);
  }

  toggleTip(isTop = false) {
    if (!this.tipElement) {
      return false;
    }

    const CLASS_NAME_TIP = 'text-field__tip_is-rotate';

    if (isTop) {
      this.tipElement.classList.add(CLASS_NAME_TIP);
    } else {
      this.tipElement.classList.remove(CLASS_NAME_TIP);
    }

    return true;
  }

  selectionChecks(type = '') {
    if (!type) {
      return false;
    }

    switch (type) {
      case 'date':
        this._maskedTextField();
        break;
      case 'email':
        this._validationEmail();
        break;
      default:
        break;
    }
    return true;
  }

  _init() {
    this._tempValue = '';
    this._setElement();
    this.selectionChecks(this.options.type);
  }

  _getElement(nameElement, parentElement) {
    return (parentElement ?? this.element).querySelector(`${this.className}__${nameElement}`);
  }

  _setElement() {
    this.inputElement = this._getElement('input');
    this.tipElement = this._getElement('tip');
  }

  _maskedTextField() {
    this._message = this.options.message ?? 'Введена некорректная дата!';
    this._bindEventMasked();
  }

  _validateDate(data) {
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

    domElement.value = this._validateDate({
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

    if (!REGEXP.test(dateTarget)) {
      return false;
    }

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

  _bindEventMasked() {
    if (!this.inputElement) {
      return false;
    }
    this.inputElement.addEventListener('change', this._handleInputChange);
    this.inputElement.addEventListener('input', this._handleInputInput);

    return true;
  }

  _validationEmail() {
    this._message = this.options.message ?? 'Вы ввели неверный Email.';
    // eslint-disable-next-line no-control-regex
    this._regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

    this._bindEventEmail(this.options.event ?? 'change');
  }

  _handleInputEvent() {
    if (!this.validateFieldEmail()) {
      message(this._message);
    }
  }

  _bindEventEmail(event) {
    if (!this.inputElement) {
      return false;
    }
    this.inputElement.addEventListener(event, this._handleInputEvent);
    return true;
  }
}

export default TextField;
