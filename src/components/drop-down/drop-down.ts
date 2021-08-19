import './drop-down.scss';

interface optE {
  str: string,
  fl?: boolean,
  dom?: Element
}

class dropDown {

  inputEl: HTMLInputElement;
  private imgClass: string;
  private selectEl: HTMLInputElement;
  clearBut: Element;
  private applyClass: Element;
  elem: Element;
  private items: HTMLElement[];
  defoultText: string;
  valMas: HTMLElement[];
  declensions: string[][];
  className: string;
  private flClick: boolean;
  private disPlus: boolean;

  constructor(className: string, component: Element) {

    this.declensions = [];
    this.className = className;
    this.elem = component;

    this.flClick = false;
    this.disPlus = false;

    this.setDomElem();
    this.setActions();
    this.setActionSelect();
  }

  private getElem(param: optE) {
    let elem: HTMLElement[] | Element;
    let dom = param.dom ?? this.elem;
    let name = this.className + param.str;
    if (param.fl) {
      elem = [...dom.querySelectorAll<HTMLElement>(name)];
    }
    else {
      elem = dom.querySelector(name);
    }
    return elem;
  }

  private setDomElem() {
    const valueClass = this.className + '__value';

    this.applyClass = this.getElem({ str: '__button-apply' }) as HTMLElement;
    this.clearBut = this.getElem({ str: '__button-clear' }) as HTMLElement;
    this.items = this.getElem({
      str: '__select-item',
      fl: true
    }) as HTMLElement[];

    this.valMas = [];
    for (let item of this.items) {
      this.getСheckVal(item);
      this.valMas.push(item.querySelector(valueClass));
      this.readingAttributes(item);
    }

    this.inputEl = this.getElem({ str: '__input' }) as HTMLInputElement;
    this.defoultText = this.inputEl.placeholder;
    this.selectEl = this.getElem({ str: '__select' }) as HTMLInputElement;
  }


  getСheckVal(item: Element) {
    let minus = (this.getElem({
      str: '__minus',
      dom: item
    }) as HTMLInputElement);
    let value = (this.getElem({
      str: '__value',
      dom: item
    }) as HTMLInputElement);
    let plus = (this.getElem({
      str: '__plus',
      dom: item
    }) as HTMLInputElement);

    const getModif = (str: string, str2: string) => {
      return this.className.replace(/^\./, '') + str + str2;
    };

    let classM = getModif('__minus', '_disable');
    let val = Number(value.innerText);

    if (!val) {
      minus.classList.add(classM);
      minus.disabled = true;
    } else {
      minus.classList.remove(classM);
      minus.disabled = false;
    }

    let maxVal = Number(plus.getAttribute('data-max'));
    let classP = getModif('__plus', '_disable');
    if (val >= maxVal) {
      plus.classList.add(classP);
      this.disPlus = true;
      plus.disabled = true;
    } else {
      plus.classList.remove(classP);
      this.disPlus = false;
      plus.disabled = false;
    }
  }

  private readingAttributes(elem: Element) {
    this.declensions.push(elem.getAttribute('data-type').split(','));
  }

  private setActions() {

    this.inputEl.addEventListener('mouseup', () => {
      this.toggle();
      this.flClick = false;
    });

    this.inputEl.addEventListener('mousedown', () => {
      this.flClick = true;
    });

    this.inputEl.addEventListener('focus', () => {
      if (!this.flClick)
        this.toggle();
    });


    const inputKeydown = (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle(true);
      } else if (e.key == ' ') {
        e.preventDefault();
        this.toggle();
      }
    };

    const selectKeydown = (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle(true);
      }
    };

    this.selectEl.addEventListener('keydown', selectKeydown);
    this.inputEl.addEventListener('keydown', inputKeydown);

    if (this.applyClass)
      this.applyClass.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const defoultText = this.inputEl.value == this.defoultText;
        const inputClear = defoultText || !this.inputEl.value;

        if (inputClear) {
          alert('Выберите количество гостей.');
        }
        else {
          this.toggle();
        }
      });

    if (this.clearBut)
      this.clearBut.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.resetValue();
      });


    const eventDoc = (event: string) => {
      document.addEventListener(event, (e: Event) => {
        const target = e.target as HTMLElement;
        const domEl = target.closest(this.className);
        if (domEl != this.elem)
          this.toggle(true);
      });
    };

    eventDoc('click');
    eventDoc('focusin');
  }

  private getVisible(elem: Element) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }


  private toggle(flag = false) {
    const UlVisible: boolean = this.getVisible(this.selectEl);
    let flagVis = !UlVisible && !flag;
    this.toggleModif(this.elem, '_visible', flagVis);
  }


  private toggleModif(elem: Element, modif: string, flag = false) {
    let clearName = this.className.replace(/^\./, '') + modif;
    let objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }


  resetValue() {
    this.valMas.map((item: HTMLElement) => item.innerText = '0');
    this.inputEl.value = this.defoultText;

    for (let item of this.items) { this.getСheckVal(item); }

    if (this.clearBut)
      this.toggleModif(this.clearBut, '__button-clear_visible');
  }

  declOfNum(number: number, words: string[]) {
    return words[(number % 100 > 4 &&
      number % 100 < 20) ? 2 :
      [2, 0, 1, 1, 1, 2][(number % 10 < 5) ?
        number % 10 : 5]];
  }


  private setActionSelect() {

    const funAct = (e: Event) => {
      e.preventDefault();
      let liEl = e.currentTarget as HTMLElement;
      let target = e.target as HTMLElement;

      const valueEl =
        liEl.querySelector(this.className + '__value') as HTMLElement;
      const minusEl = target.closest(this.className + '__minus');
      const plusEl = target.closest(this.className + '__plus');

      let num = Number(valueEl.innerText);
      if (minusEl && num) {
        --num;
      }
      else if (plusEl && !this.disPlus) {
        ++num;
      }

      valueEl.innerText = String(num);
      this.getСheckVal(liEl);
      this.setInput();
    };

    for (let item of this.items) {
      item.addEventListener('click', funAct);
    }
  }


  getMapValue() {
    let fields = new Map();
    for (let i = 0; i < this.valMas.length; i++) {
      let typeText = this.declensions[i].join(',');
      let value = Number(this.valMas[i].innerText);
      if (fields.has(typeText)) {
        let oldValue = fields.get(typeText);
        let newValue = oldValue + value;
        fields.set(typeText, newValue);
      }
      else {
        fields.set(typeText, value);
      }
    }
    return fields;
  }

  private setInput() {
    let text = '';
    let mergeText = (
      num: number,
      strMas: string[], fl = false) => {
      num = Number(num);
      if (!num) return;

      if (!fl) {
        text += num + ' ' +
          this.declOfNum(num, strMas);
      }
      else {
        let comma = text ? ', ' : '';
        text += comma + num + ' ' +
          this.declOfNum(num, strMas);
      }
    };


    let kl = false;
    for (let item of this.getMapValue()) {
      mergeText(item[1], item[0].split(','), Boolean(kl));
      kl = true;
    }


    let setData = (
      visibility: boolean,
      value: string,
      placeholder: string) => {

      if (this.clearBut) {
        this.toggleModif(
          this.clearBut,
          '__button-clear_visible',
          visibility);
      }

      this.inputEl.value = value;
      this.inputEl.placeholder = placeholder;
    };


    if (text) {
      setData(true, text, text);
    } else {
      setData(false, '', this.defoultText);
    }
  }
}


//==========================================================================

function renderDropDown(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new dropDown(className, elem));
  }
  return objMas;
}

renderDropDown('.drop-down');



