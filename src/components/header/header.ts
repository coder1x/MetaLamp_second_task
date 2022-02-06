import './header.scss';

class headerMenu {

  className: string;
  elem: Element;
  private items: Element[];
  private mapLinks: Map<HTMLElement, number>;
  private showElem: Element[];
  private showTip: Element[];
  private button: HTMLElement;
  private nav: HTMLElement;
  private spanBut: Element;
  private linksDown: Element[];
  private tip: Element[];

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.startMenu();
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
    if (elem instanceof Element)
      return function (): Element { return elem; };
    return () => { return elem; };
  }


  closeAll() {
    if (this.showElem.length) {
      this.showElem.map((elem) => {
        this.closeUl(elem);
      });
    }
    this.showElem = [];

    this.closeTip();
  }

  private startMenu() {
    this.showElem = [];
    this.showTip = [];
    this.setDom();
    this.setActions();
  }

  private setDom() {
    this.linksDown = this.getElements('__link-down');
    this.items = this.getElements('__items-down');
    this.button = this.getElement('__toggle')();
    this.spanBut = this.getElement('__toggle-line')();
    this.nav = this.getElement('__menu-wrap')();
    this.tip = this.getElements('__tip');

    this.mapLinks = new Map();
    for (let i = 0; i < this.linksDown.length; i++) {
      const tt = this.linksDown[i];
      if (tt instanceof HTMLElement)
        this.mapLinks.set(tt, i);
    }
  }

  private getIndex(elem: HTMLElement) {
    return this.mapLinks.get(elem);
  }

  private getModify() {
    const selector = this.className + '__items-down_visible';
    return selector.replace(/^\.js-/, '');
  }

  private getVisButton(elem: Element) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('visibility');
    return display === 'hidden' ? false : true;
  }

  private rotateTip(elem: Element, fl = false) {
    const name = (this.className + '__tip_rotate').replace(/^\.js-/, '');
    if (!fl) {
      elem.classList.remove(name);
    } else {
      elem.classList.add(name);
      this.showTip.push(elem);
    }
  }

  private showUl(index: number) {
    if (this.getVisButton(this.button)) return;

    this.closeAll();
    const elem = this.items[index];
    this.rotateTip(this.tip[index], true);
    elem.classList.add(this.getModify());
    if (elem instanceof HTMLElement)
      this.trackMouse(elem);
    this.showElem.push(elem);
  }

  private closeTip() {
    if (this.showTip.length) {
      this.showTip.map((elem) => {
        this.rotateTip(elem);
      });
    }
    this.showTip = [];
  }

  private trackMouse(elem: HTMLElement) {  // следим за курсором когда он попадает на список
    elem.addEventListener('mouseout', (e: MouseEvent) => {
      const rel = e.relatedTarget;
      const target = e.currentTarget;

      let domEl: false | Element;
      if (rel instanceof Element)
        domEl = rel.closest('.' + this.getModify()) ?? false;

      if (!domEl) {
        {
          if (target instanceof Element)
            this.closeUl(target);
          this.closeTip();
        }
      }
    });
  }

  private closeUl(elem: Element) {
    elem.classList.remove(this.getModify());
  }

  private getVisible(elem: Element) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }

  private setModify(elem: Element, mod: string, fl = false) {
    const select = '__' + mod + '_visible';
    const clearName = this.className.replace(/^\.js-/, '') + select;
    let objClass = elem.classList;
    !fl ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private toggle() {
    const navVisible: boolean = this.getVisible(this.nav);
    this.setModify(this.nav, 'menu-wrap', navVisible);
    this.setModify(this.spanBut, 'toggle-line', navVisible);
  }

  private setActions() {

    this.button.addEventListener('click', (e: Event) => {

      const elem = e.currentTarget;
      if (elem instanceof Element) {
        let expanded = elem.getAttribute('aria-expanded');
        expanded = expanded == 'true' ? 'false' : 'true';
        elem.setAttribute('aria-expanded', expanded);
        this.toggle();
      }
    });

    const keydown = (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle();
      }
    };

    this.button.addEventListener('keydown', keydown);
    this.nav.addEventListener('keydown', keydown);


    for (let item of this.linksDown) {

      const dom = item;
      if (dom instanceof HTMLElement)
        dom.addEventListener('mouseover', (e: MouseEvent) => {
          const elem = e.currentTarget;
          if (elem instanceof HTMLElement)
            this.showUl(this.getIndex(elem));
        });

      const showMenuFocus = (e: KeyboardEvent) => {
        if (e.key == ' ') {
          e.preventDefault();
          const currentEl = e.currentTarget;

          let index: number;
          if (currentEl instanceof HTMLElement)
            index = this.getIndex(currentEl);

          const elem = this.items[index];

          if (elem.classList.contains(this.getModify())) {
            this.closeAll();
          }
          else {
            if (currentEl instanceof HTMLElement)
              this.showUl(this.getIndex(currentEl));
          }
        } else {
          if (e.key == 'Escape') {
            this.closeAll();
          }
        }
      };

      if (dom instanceof HTMLElement)
        dom.addEventListener('keydown', showMenuFocus);
    }

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target;
      let domEl: false | Element;
      if (target instanceof Element)
        domEl = target.closest('.' + this.getModify()) ?? false;
      if (!domEl) {
        this.closeAll();
      }
    });


    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target;
      let linkEl: false | Element;
      if (target instanceof Element)
        linkEl = target.closest(
          this.className + '__link-down'
        ) ?? false;

      let ulEl: false | Element;
      if (target instanceof Element)
        ulEl = target.closest('.' + this.getModify()) ?? false;
      if (!linkEl && !ulEl) { this.closeAll(); }
    });

  }
}


function renderHeaderMenu(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new headerMenu(className, elem));
  }
  return objMas;
}


renderHeaderMenu('.js-header');