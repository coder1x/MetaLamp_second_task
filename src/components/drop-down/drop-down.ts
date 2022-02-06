import './drop-down.scss';


class dropDown {

  elem: Element;
  defaultText: string;
  className: string;
  private inputEl: HTMLInputElement;
  private clearBut: HTMLElement;
  private valMas: HTMLSpanElement[];
  private declensions: string[][];
  private selectEl: HTMLInputElement;
  private applyClass: HTMLElement;
  private items: Element[];
  private flClick: boolean;
  private disPlus: boolean;
  private tipImg: HTMLElement;

  constructor(className: string, component: Element) {
    this.className = className;
    this.elem = component;
    this.init();
  }


  getCheckVal(item: Element) {

    let minus: HTMLInputElement;
    let value: HTMLInputElement;
    let plus: HTMLInputElement;

    minus = this.getElement('__minus', item)();
    value = this.getElement('__value', item)();
    plus = this.getElement('__plus', item)();

    const getModify = (str: string, str2: string) => {
      return this.className.replace(/^\.js-/, '') + str + str2;
    };

    let classM = getModify('__minus', '_disable');
    let val = Number(value.innerText);

    if (!val) {
      minus.classList.add(classM);
      minus.disabled = true;
    } else {
      minus.classList.remove(classM);
      minus.disabled = false;
    }

    let maxVal = Number(plus.getAttribute('data-max'));
    let classP = getModify('__plus', '_disable');
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

  resetValue() {
    this.valMas.map((item: HTMLSpanElement) => item.innerText = '0');
    this.inputEl.value = this.defaultText;

    for (let item of this.items) { this.getCheckVal(item); }

    if (this.clearBut)
      this.toggleModify(this.clearBut, '__button-clear_visible');
  }

  declOfNum(number: number, words: string[]) {
    return words[(number % 100 > 4 &&
      number % 100 < 20) ? 2 :
      [2, 0, 1, 1, 1, 2][(number % 10 < 5) ?
        number % 10 : 5]];
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

  private init() {
    this.declensions = [];
    this.flClick = false;
    this.disPlus = false;

    this.setDomElem();
    this.setActions();
    this.setActionSelect();
  }


  private getElements(str: string, domBase?: Element): Element[] {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    const doms = [...dom.querySelectorAll(selector)];
    return doms;
  }


  private getElement(str: string, domBase?: Element): Function {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    const elem: Element = dom.querySelector(selector);
    if (elem instanceof HTMLElement)
      return function (): HTMLElement { return elem; };
    if (elem instanceof HTMLButtonElement)
      return function (): HTMLButtonElement { return elem; };
    if (elem instanceof HTMLInputElement)
      return function (): HTMLInputElement { return elem; };
    if (elem instanceof HTMLSpanElement)
      return function (): HTMLSpanElement { return elem; };
    if (elem instanceof Element)
      return function (): Element { return elem; };
    return () => { return elem; };
  }



  private setDomElem() {

    this.applyClass = this.getElement('__button-apply')();
    this.clearBut = this.getElement('__button-clear')();
    this.items = this.getElements('__select-item');


    this.valMas = [];
    for (let item of this.items) {
      this.getCheckVal(item);
      const dom: HTMLElement = this.getElement('__value', item)();
      this.valMas.push(dom);
      this.readingAttributes(item);
    }


    this.inputEl = this.getElement('__input')();
    this.defaultText = this.inputEl.placeholder;
    this.selectEl = this.getElement('__select')();
    this.tipImg = this.getElement('__tip')();
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

    this.tipImg.addEventListener('click', () => {
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
        const defaultText = this.inputEl.value == this.defaultText;
        const inputClear = defaultText || !this.inputEl.value;

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
        let target: Element;
        if (e.target instanceof Element)
          target = e.target;

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
    this.toggleModify(this.elem, '_visible', flagVis);
  }


  private toggleModify(elem: Element, modify: string, flag = false) {
    let clearName = this.className.replace(/^\.js-/, '') + modify;
    let objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }


  private setActionSelect() {

    const funAct = (e: Event) => {
      e.preventDefault();
      let liEl: Element;

      if (e.currentTarget instanceof Element)
        liEl = e.currentTarget;

      let target: Element;
      if (e.target instanceof Element)
        target = e.target;

      const valueEl: HTMLSpanElement =
        this.getElement('__value', liEl)();

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
      this.getCheckVal(liEl);
      this.setInput();
    };

    for (let item of this.items) {
      item.addEventListener('click', funAct);
    }
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
        this.toggleModify(
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
      setData(false, '', this.defaultText);
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

renderDropDown('.js-drop-down');



