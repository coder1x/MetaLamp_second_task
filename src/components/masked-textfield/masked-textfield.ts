interface Options {
  className: string,
  message: string,
  elem?: Element
}
class maskedTextField {
  message: string = '';
  private tempValue: string = '';

  constructor(options: Options) {
    this.message = options.message;
    this.tempValue = '';
    const elem = options.elem;
    if (elem)
      this.setActions(elem);
  }

  private inputProcessing = (event: Event) => {
    const dom = event.target as HTMLInputElement;

    let value = dom.value.replace(/[^.\d]/g, '');

    const strLen = value.length;
    if (strLen == 1) {
      if (Number(value) > 3) {
        value = '0' + value;
      }
    } else if (strLen == 4) {
      if (Number(value[strLen - 1]) > 1) {
        value = value.substr(0, strLen - 1) + '0' + value[strLen - 1];
      }
    }

    const day = `^(0|[1-9]|0[1-9]|[12][0-9]|3[01])`;
    const month = day + `\\.(0|[1-9]|0[1-9]|1[012])`;
    const year = month +
      `\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

    const point = value + '.';
    const last = point != this.tempValue;

    if (value.match(new RegExp(day + '\\.?$'))) {
      dom.value = value.length == 2 && last ? point : value;
    }
    else if (value.match(new RegExp(month + '\\.?$'))) {
      dom.value = value.length == 5 && last ? point : value;

    } else if (value.match(new RegExp(year))) {
      dom.value = value;
    }
    else {
      if (this.tempValue.length == 1) {
        dom.value = value.substr(0, value.length - 1);
      }
      else if (this.tempValue.length > value.length) {
        dom.value = value;
      }
      else {
        dom.value = this.tempValue;
      }
    }

    this.tempValue = dom.value;
  }

  private dateValidation = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
    const dateD = target.value;

    if (!regexp.test(dateD)) return;

    let masD = dateD.split('.').map((item: string) => Number(item.replace(/^0/, '')));
    masD[1] = masD[1] - 1;
    const date = new Date(masD[2], masD[1], masD[0]);

    const day = date.getDate() == masD[0];
    const month = date.getMonth() == masD[1];
    const year = date.getFullYear() == masD[2];

    if (year && month && day) {
      return true;
    } else {
      alert(this.message);
      return false;
    }
  }

  private setActions(elem: Element) {
    elem.addEventListener('change', this.dateValidation);
    elem.addEventListener('input', this.inputProcessing);
  }
}

function renderMasked(options: Options) {
  const components = document.querySelectorAll(options.className);
  let objMas = [];
  for (let elem of components) {
    options.elem = elem;
    objMas.push(new maskedTextField(options));
  }
  return objMas;
}

renderMasked({
  className: '.js-masked-date',
  message: 'Введена некорректная дата!'
});