import autoBind from 'auto-bind';

class ValidationEmail {
  constructor(options) {
    autoBind(this);
    this._init(options);
  }

  validation() {
    if (!this._regExpEmail || !this.inputElem) return false;

    return !!this._regExpEmail.test(this.inputElem.value);
  }

  _init(options) {
    const event = options.event ?? '';
    this._message = options.message ?? 'Вы ввели неверный Email.';
    const { elem } = options;

    this.inputElem = elem;
    // eslint-disable-next-line no-control-regex
    this._regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

    if (event) { this._setEvent(event); }
  }

  _handleInputElement() {
    if (!this.validation()) {
      // eslint-disable-next-line no-alert
      alert(this._message);
    }
  }

  _setEvent(event) {
    if (!this.inputElem) return false;
    this.inputElem.addEventListener(event, this._handleInputElement);
    return true;
  }
}

function renderValidationEmail(options) {
  const { className } = options;
  const name = options.inputName ?? '';
  const input = `${className}__input[name="${name}"]`;
  const components = document.querySelectorAll(input);
  const objMas = [];

  components.forEach((elem) => {
    objMas.push(new ValidationEmail({
      message: options.message,
      event: options.event,
      elem,
    }));
  });

  return objMas;
}

renderValidationEmail({
  className: '.text-field',
  inputName: 'email',
  event: 'change',
});

export { renderValidationEmail, ValidationEmail };
