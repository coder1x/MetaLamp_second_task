import autoBind from 'auto-bind';

interface Options {
  message?: string,
  event?: string,
  elem: Element
}

interface RenderOptions {
  className: string,
  inputName: string,
  message?: string,
  event?: string,
  elem?: Element
}

class ValidationEmail {
  inputElem: HTMLInputElement | null = null;

  private regExpEmail: RegExp | null = null;

  private message: string = '';

  constructor(options: Options) {
    autoBind(this);
    this.init(options);
  }

  validation() {
    if (!this.regExpEmail || !this.inputElem) return false;

    return !!this.regExpEmail.test(this.inputElem.value);
  }

  private init(options: Options) {
    const event = options.event ?? '';
    this.message = options.message ?? 'Вы ввели неверный Email.';
    const elem = options.elem as HTMLInputElement;

    this.inputElem = elem;
    // eslint-disable-next-line no-control-regex
    this.regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

    if (event) { this.setEvent(event); }
  }

  private handleInputElement() {
    if (!this.validation()) {
      // eslint-disable-next-line no-alert
      alert(this.message);
    }
  }

  private setEvent(event: string) {
    if (!this.inputElem) return false;
    this.inputElem.addEventListener(event, this.handleInputElement);
    return true;
  }
}

function renderValidationEmail(options: RenderOptions) {
  const { className } = options;
  const name = options.inputName ?? '';
  const input = `${className}__input[name="${name}"]`;
  const components = document.querySelectorAll(input);
  const objMas: ValidationEmail[] = [];

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
