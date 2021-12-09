
interface opt {
  className: string,
  message: string,
  elem?: Element
}


class maskedTextField {

  private className: string;
  message: string;
  private temp: string;

  constructor(options: opt) {
    this.className = options.className;
    this.message = options.message;
    this.temp = '';
    let elem = options.elem;
    if (elem)
      this.setActions(elem);
  }


  private inputProcessing(e: Event) {
    let elem = e.target as HTMLInputElement;
    let val = elem.value.replace(/[^.\d]/g, '');

    let strLen = val.length;
    if (strLen == 1) {
      if (Number(val) > 3) {
        val = '0' + val;
      }
    } else if (strLen == 4) {
      if (Number(val[strLen - 1]) > 1) {
        val = val.substr(0, strLen - 1) + '0' + val[strLen - 1];
      }
    }

    let day = `^(0|[1-9]|0[1-9]|[12][0-9]|3[01])`;
    let month = day + `\\.(0|[1-9]|0[1-9]|1[012])`;
    let year = month +
      `\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

    let point = val + '.';
    let last = point != this.temp;

    if (val.match(new RegExp(day + '\\.?$'))) {
      elem.value = val.length == 2 && last ? point : val;
    }
    else if (val.match(new RegExp(month + '\\.?$'))) {
      elem.value = val.length == 5 && last ? point : val;

    } else if (val.match(new RegExp(year))) {
      elem.value = val;
    }
    else {
      if (this.temp.length == 1) {
        elem.value = val.substr(0, val.length - 1);
      }
      else if (this.temp.length > val.length) {
        elem.value = val;
      }
      else {
        elem.value = this.temp;
      }
    }

    this.temp = elem.value;
  }

  private dateValidation(e: Event) {
    const target = e.target as HTMLInputElement;
    let regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
    let dateD = target.value;

    if (!regexp.test(dateD)) return;

    let masD = dateD.split('.').map((item: string) => Number(item.replace(/^0/, '')));
    masD[1] = masD[1] - 1;
    let d = new Date(masD[2], masD[1], masD[0]);

    const day = d.getDate() == masD[0];
    const month = d.getMonth() == masD[1];
    const year = d.getFullYear() == masD[2];

    if (year && month && day) {
      return true;
    } else {
      alert(this.message);
      return false;
    }
  }

  private setActions(elem: Element) {
    elem.addEventListener('change', (e: Event) => {
      this.dateValidation(e);
    });

    elem.addEventListener('input', (e: Event) => {
      this.inputProcessing(e);
    });
  }
}


function renderMasked(options: opt) {
  let components = document.querySelectorAll(options.className);
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









