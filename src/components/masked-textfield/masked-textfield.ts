import autoBind from 'auto-bind';

interface Options {
  className: string,
  message: string,
  elem?: Element
}
class MaskedTextField {
  message: string = '';

  private tempValue: string = '';

  constructor(options: Options) {
    autoBind(this);
    this.message = options.message;
    this.tempValue = '';
    const { elem } = options;
    if (elem) { this.setActions(elem); }
  }

  private inputProcessing(event: Event) {
    const domElement = event.target as HTMLInputElement;

    let value = domElement.value.replace(/[^.\d]/g, '');

    const strLen = value.length;
    if (strLen === 1) {
      if (Number(value) > 3) {
        value = `0${value}`;
      }
    } else if (strLen === 4) {
      if (Number(value[strLen - 1]) > 1) {
        value = `${value.substr(0, strLen - 1)}0${value[strLen - 1]}`;
      }
    }

    const day = '^(0|[1-9]|0[1-9]|[12][0-9]|3[01])';
    const month = `${day}\\.(0|[1-9]|0[1-9]|1[012])`;
    const year = `${month}\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

    const point = `${value}.`;
    const last = point !== this.tempValue;

    if (value.match(new RegExp(`${day}\\.?$`))) {
      domElement.value = value.length === 2 && last ? point : value;
    } else if (value.match(new RegExp(`${month}\\.?$`))) {
      domElement.value = value.length === 5 && last ? point : value;
    } else if (value.match(new RegExp(year))) {
      domElement.value = value;
    } else if (this.tempValue.length === 1) {
      domElement.value = value.substr(0, value.length - 1);
    } else if (this.tempValue.length > value.length) {
      domElement.value = value;
    } else {
      domElement.value = this.tempValue;
    }

    this.tempValue = domElement.value;
  }

  private dateValidation(event: Event) {
    const target = event.target as HTMLInputElement;
    const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
    const dateTarget = target.value;

    if (!regexp.test(dateTarget)) return false;

    const masDate = dateTarget.split('.').map((item: string) => Number(item.replace(/^0/, '')));
    masDate[1] -= 1;
    const date = new Date(masDate[2], masDate[1], masDate[0]);

    const day = date.getDate() === masDate[0];
    const month = date.getMonth() === masDate[1];
    const year = date.getFullYear() === masDate[2];

    if (year && month && day) {
      return true;
    }
    // eslint-disable-next-line no-alert
    alert(this.message);

    return false;
  }

  private setActions(elem: Element) {
    elem.addEventListener('change', this.dateValidation);
    elem.addEventListener('input', this.inputProcessing);
  }
}

function renderMasked(options: Options) {
  const components = document.querySelectorAll(options.className);
  const objMas: MaskedTextField[] = [];
  components.forEach((elem) => {
    objMas.push(new MaskedTextField({
      className: options.className,
      message: options.message,
      elem,
    }));
  });
  return objMas;
}

renderMasked({
  className: '.js-masked-date',
  message: 'Введена некорректная дата!',
});
