

interface optV {
  message?: string,
  event?: string,
  elem: Element
}

class validationEmail {

  constructor(options: optV) {

    let event = options.event ?? '';
    let message = options.message ?? 'Вы ввели неверный Email.';
    this.inputElem = options.elem;

    // eslint-disable-next-line no-control-regex
    this.regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

    if (event)
      this.setEvent(event, message);

  }

  private inputElem: any;
  private regExpEmail: RegExp;

  private setEvent(event: string, message: string) {
    this.inputElem.addEventListener(event, () => {
      if (!this.validation())
        alert(message);
    });
  }

  public validation() {
    if (this.regExpEmail.test(this.inputElem.value)) {
      return true;
    }
    return false;
  }
}


interface opt {
  className: string,
  inputName: string,
  message?: string,
  event?: string,
  elem?: Element
}

function renderValidationEmail(options: opt) {

  const className = options.className;
  const name = options.inputName ?? '';
  const input = className + '__input[name="' + name + '"]';

  let components = document.querySelectorAll(input);
  let objMas = [];
  for (let elem of components) {
    options.elem = elem;
    objMas.push(new validationEmail({
      message: options.message,
      event: options.event,
      elem: options.elem
    }));
  }
  return objMas;
}



renderValidationEmail({
  className: '.text-field',
  inputName: 'email',
  event: 'change',
});




export { renderValidationEmail, validationEmail };
