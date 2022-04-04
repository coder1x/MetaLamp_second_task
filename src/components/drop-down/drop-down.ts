import autoBind from 'auto-bind';
import './drop-down.scss';

class DropDown {
  elem: Element;

  defaultText: string = '';

  className: string;

  private inputEl: HTMLInputElement | null = null;

  private clearBut: HTMLElement | null = null;

  private valMas: HTMLSpanElement[] | null = null;

  private declensions: string[][] = [];

  private selectEl: HTMLInputElement | null = null;

  private applyClass: HTMLElement | null = null;

  private items: Element[] | null = null;

  private flClick: boolean = false;

  private disPlus: boolean = false;

  private tipImg: HTMLElement | null = null;

  constructor(className: string, component: Element) {
    autoBind(this);
    this.className = className;
    this.elem = component;
    this.init();
  }

  getCheckVal(item: Element) {
    const minus = this.getElement('__minus', item) as HTMLInputElement;
    const value = this.getElement('__value', item) as HTMLInputElement;
    const plus = this.getElement('__plus', item) as HTMLInputElement;

    const getModify = (str: string, str2: string) => this.className.replace(/^\.js-/, '') + str + str2;

    const classM = getModify('__minus', '_disable');
    const val = Number(value.innerText);

    if (!val) {
      minus.classList.add(classM);
      minus.disabled = true;
    } else {
      minus.classList.remove(classM);
      minus.disabled = false;
    }

    const maxVal = Number(plus.getAttribute('data-max'));
    const classP = getModify('__plus', '_disable');
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
    if (!this.valMas || !this.inputEl) return false;

    this.valMas.forEach((item: HTMLSpanElement) => {
      const span = item;
      span.innerText = '0';
    });

    this.inputEl.value = this.defaultText;

    if (!this.items || !this.clearBut) return false;

    this.items.map((item: Element) => this.getCheckVal(item));
    this.toggleModify(this.clearBut, '__button-clear_visible');

    return true;
  }

  static declOfNum(number: number, words: string[]) {
    return words[(number % 100 > 4
      && number % 100 < 20) ? 2
      : [2, 0, 1, 1, 1, 2][(number % 10 < 5)
        ? number % 10 : 5]];
  }

  getMapValue() {
    const fields = new Map();
    if (Array.isArray(this.valMas)) {
      for (let i = 0; i < this.valMas.length; i += 1) {
        const typeText = this.declensions[i].join(',');
        const value = Number(this.valMas[i].innerText);

        if (fields.has(typeText)) {
          const oldValue = fields.get(typeText);
          const newValue = oldValue + value;
          fields.set(typeText, newValue);
        } else {
          fields.set(typeText, value);
        }
      }
    }
    return fields;
  }

  private init() {
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

  private getElement(str: string, domBase?: Element) {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    return dom.querySelector(selector);
  }

  private setDomElem() {
    this.applyClass = this.getElement('__button-apply') as HTMLElement;
    this.clearBut = this.getElement('__button-clear') as HTMLElement;
    this.items = this.getElements('__select-item');

    this.valMas = [];

    this.items.forEach((item) => {
      this.getCheckVal(item);
      const dom = this.getElement('__value', item) as HTMLElement;
      if (this.valMas) { this.valMas.push(dom); }
      this.readingAttributes(item);
    });

    this.inputEl = this.getElement('__input') as HTMLInputElement;

    this.defaultText = this.inputEl.placeholder;
    this.selectEl = this.getElement('__select') as HTMLInputElement;
    this.tipImg = this.getElement('__tip') as HTMLElement;
  }

  private readingAttributes(elem: Element) {
    if (elem) {
      const type = elem.getAttribute('data-type') ?? '';
      this.declensions.push(type.split(','));
    }
  }

  private handleInputMouseup() {
    this.toggle();
    this.flClick = false;
  }

  private handleInputMousedown() {
    this.flClick = true;
  }

  private handleInputFocus() {
    if (!this.flClick) { this.toggle(); }
  }

  private handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggle(true);
    } else if (event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  private handleTipClick() {
    this.toggle();
  }

  private handleSelectKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggle(true);
    }
  }

  private handleApplyClick(event: Event) {
    event.preventDefault();

    if (this.inputEl instanceof HTMLInputElement) {
      const defaultText = this.inputEl.value === this.defaultText;
      const inputClear = defaultText || !this.inputEl.value;

      if (inputClear) {
        // eslint-disable-next-line no-alert
        alert('Выберите количество гостей.');
      } else {
        this.toggle();
      }
    }
  }

  private handleClearClick(event: Event) {
    event.preventDefault();
    this.resetValue();
  }

  private handleDocumentEvent(event: Event) {
    const target = event.target as Element;
    const domEl = target.closest(this.className);
    if (domEl !== this.elem) { this.toggle(true); }
  }

  private setActions() {
    if (!this.inputEl || !this.tipImg) return false;

    this.inputEl.addEventListener('mouseup', this.handleInputMouseup);
    this.inputEl.addEventListener('mousedown', this.handleInputMousedown);
    this.inputEl.addEventListener('focus', this.handleInputFocus);
    this.inputEl.addEventListener('keydown', this.handleInputKeydown);
    this.tipImg.addEventListener('click', this.handleTipClick);

    if (this.selectEl) {
      this.selectEl.addEventListener('keydown', this.handleSelectKeydown);
    }

    if (this.applyClass) {
      this.applyClass.addEventListener('click', this.handleApplyClick);
    }

    if (this.clearBut) {
      this.clearBut.addEventListener('click', this.handleClearClick);
    }

    const eventDoc = (event: string) => {
      document.addEventListener(event, this.handleDocumentEvent);
    };

    eventDoc('click');
    eventDoc('focusin');

    return true;
  }

  private static getVisible(elem: Element) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  private toggle(flag = false) {
    if (!this.selectEl) return;
    const UlVisible: boolean = DropDown.getVisible(this.selectEl);
    const flagVis = !UlVisible && !flag;
    this.toggleModify(this.elem, '_visible', flagVis);
  }

  private toggleModify(elem: Element, modify: string, flag = false) {
    const clearName = this.className.replace(/^\.js-/, '') + modify;
    const objClass = elem.classList;

    if (flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  private handleItemClick(event: Event) {
    event.preventDefault();

    const target = event.target as Element;
    const liEl = event.currentTarget as Element;

    const valueEl = this.getElement('__value', liEl) as HTMLSpanElement;
    const minusEl = target.closest(`${this.className}__minus`);
    const plusEl = target.closest(`${this.className}__plus`);

    let num = Number(valueEl.innerText);
    if (minusEl && num) {
      num -= 1;
    } else if (plusEl && !this.disPlus) {
      num += 1;
    }

    valueEl.innerText = String(num);
    this.getCheckVal(liEl);
    this.setInput();
  }

  private setActionSelect() {
    if (Array.isArray(this.items)) {
      this.items.forEach((item) => {
        item.addEventListener('click', this.handleItemClick);
      });
    }
  }

  private setInput() {
    let text = '';
    const mergeText = (
      num: number,
      strMas: string[],
      fl = false,
    ) => {
      const number = Number(num);
      if (!number) return;

      if (!fl) {
        text += `${number} ${DropDown.declOfNum(number, strMas)}`;
      } else {
        const comma = text ? ', ' : '';
        text += `${comma + number} ${DropDown.declOfNum(number, strMas)}`;
      }
    };

    let kl = false;

    this.getMapValue().forEach((value, key) => {
      mergeText(value, key.split(','), Boolean(kl));
      kl = true;
    });

    const setData = (
      visibility: boolean,
      value: string,
      placeholder: string,
    ) => {
      if (this.clearBut) {
        this.toggleModify(
          this.clearBut,
          '__button-clear_visible',
          visibility,
        );
      }

      if (this.inputEl instanceof HTMLInputElement) {
        this.inputEl.value = value;
        this.inputEl.placeholder = placeholder;
      }
    };

    if (text) {
      setData(true, text, text);
    } else {
      setData(false, '', this.defaultText);
    }
  }
}

//= =========================================================================

function renderDropDown(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: DropDown[] = [];
  components.forEach((elem) => {
    objMas.push(new DropDown(className, elem));
  });
  return objMas;
}

renderDropDown('.js-drop-down');
