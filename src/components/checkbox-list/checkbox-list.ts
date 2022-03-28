import './checkbox-list.scss';

class CheckBoxList {

  className: string;
  elem: Element;
  private wrap: Element | null = null;
  private headerEl: HTMLElement | null = null;
  private imgEl: HTMLElement | null = null;
  private keyF: boolean | null = null;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.init();
  }

  init() {
    this.keyF = false;
    this.setDomElem();
    this.setActions();
  }

  toggleVis() {
    let display: string = '';

    if (this.wrap)
      display = window.getComputedStyle(this.wrap, null)
        .getPropertyValue('display');
    const flag = display == 'block' ? false : true;

    this.toggleModify(this.elem, '_visible', flag);
  }

  private getElement(str: string, domBase?: Element): Function {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    const elem: Element | null = dom.querySelector(selector);
    if (elem instanceof HTMLElement)
      return function (): HTMLElement { return elem; };
    if (elem instanceof Element)
      return function (): Element { return elem; };
    return () => { return elem; };
  }

  private setDomElem() {
    this.wrap = this.getElement('__wrap')();
    this.headerEl = this.getElement('__header')();
    this.imgEl = this.getElement('__tip')();
  }

  private toggleModify(elem: Element, modify: string, flag = false) {
    let clearName = this.className.replace(/^\.js-/, '') + modify;
    let objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private setActions() {
    if (this.imgEl && this.headerEl) {
      this.headerEl.addEventListener('click', () => {
        this.toggleVis();
      });

      this.headerEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key == 'Enter' || e.key == ' ') {
          e.preventDefault();
          this.toggleVis();
        } else if (e.key == 'Escape') {
          e.preventDefault();
          this.toggleModify(this.elem, '_visible', false);
        }
      });
    }
  }
}

function renderCheckboxList(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new CheckBoxList(className, elem));
  }
  return objMas;
}

renderCheckboxList('.js-checkbox-list');



