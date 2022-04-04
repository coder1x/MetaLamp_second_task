import autoBind from 'auto-bind';

import './checkbox-list.scss';

class CheckBoxList {
  className: string;

  elem: Element;

  private wrap: Element | null = null;

  private headerEl: HTMLElement | null = null;

  private imgEl: HTMLElement | null = null;

  constructor(className: string, elem: Element) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this.init();
  }

  init() {
    this.setDomElem();
    this.setActions();
  }

  toggleVis() {
    let display: string = '';

    if (this.wrap) {
      display = window.getComputedStyle(this.wrap, null)
        .getPropertyValue('display');
    }
    const flag = display !== 'block';

    this.toggleModify(this.elem, '_visible', flag);
  }

  private getElement(str: string, domBase?: Element) {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    return dom.querySelector(selector);
  }

  private setDomElem() {
    this.wrap = this.getElement('__wrap');
    this.headerEl = this.getElement('__header') as HTMLElement;
    this.imgEl = this.getElement('__tip') as HTMLElement;
  }

  private toggleModify(elem: Element, modify: string, flag = false) {
    const clearName = `${this.className.replace(/^\.js-/, '')}${modify}`;
    const objClass = elem.classList;

    if (flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleVis();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.toggleModify(this.elem, '_visible', false);
    }
  }

  private setActions() {
    if (this.imgEl && this.headerEl) {
      this.headerEl.addEventListener('click', this.toggleVis);
      this.headerEl.addEventListener('keydown', this.handleKeydown);
    }
  }
}

function renderCheckboxList(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: CheckBoxList[] = [];
  components.forEach((elem) => {
    objMas.push(new CheckBoxList(className, elem));
  });
  return objMas;
}

renderCheckboxList('.js-checkbox-list');
