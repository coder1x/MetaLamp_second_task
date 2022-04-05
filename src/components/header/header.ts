import autoBind from 'auto-bind';
import './header.scss';

class HeaderMenu {
  className: string;

  elem: Element;

  private items: Element[] | null = null;

  private mapLinks: Map<HTMLElement, number> | null = null;

  private showElem: Element[] | null = null;

  private showTip: Element[] | null = null;

  private button: HTMLElement | null = null;

  private nav: HTMLElement | null = null;

  private spanBut: Element | null = null;

  private linksDown: Element[] | null = null;

  private tip: Element[] | null = null;

  constructor(className: string, elem: Element) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this.startMenu();
  }

  private getElements(str: string, domBase?: Element): Element[] {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    const doms = [...dom.querySelectorAll(selector)];
    return doms;
  }

  private getElement(str: string, domBase?: Element) {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    return dom.querySelector(selector);
  }

  closeAll() {
    if (this.showElem) {
      if (this.showElem.length) {
        this.showElem.forEach((elem) => {
          this.closeUl(elem);
        });
      }
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
    this.button = this.getElement('__toggle') as HTMLElement;
    this.spanBut = this.getElement('__toggle-line');
    this.nav = this.getElement('__menu-wrap') as HTMLElement;
    this.tip = this.getElements('__tip');

    this.mapLinks = new Map();
    for (let i = 0; i < this.linksDown.length; i += 1) {
      const tt = this.linksDown[i];
      if (tt instanceof HTMLElement) { this.mapLinks.set(tt, i); }
    }
  }

  private getIndex(elem: HTMLElement) {
    if (!this.mapLinks) return null;
    return this.mapLinks.get(elem);
  }

  private getModify() {
    const selector = `${this.className}__items-down_visible`;
    return selector.replace(/^\.js-/, '');
  }

  private static getVisButton(elem: Element) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('visibility');
    return display !== 'hidden';
  }

  private rotateTip(elem: Element, flag = false) {
    const name = (`${this.className}__tip_rotate`).replace(/^\.js-/, '');
    if (!flag) {
      elem.classList.remove(name);
    } else {
      elem.classList.add(name);
      if (Array.isArray(this.showTip)) { this.showTip.push(elem); }
    }
  }

  private showUl(index: number) {
    if (this.button) { if (HeaderMenu.getVisButton(this.button)) return false; }

    this.closeAll();

    if (Array.isArray(this.items)) {
      const elem = this.items[index];

      if (Array.isArray(this.tip)) { this.rotateTip(this.tip[index], true); }
      elem.classList.add(this.getModify());

      if (elem instanceof HTMLElement) { this.trackMouse(elem); }

      if (Array.isArray(this.showElem)) { this.showElem.push(elem); }
    }

    return true;
  }

  private closeTip() {
    if (!Array.isArray(this.showTip)) return false;

    if (this.showTip.length) {
      this.showTip.forEach((elem) => {
        this.rotateTip(elem);
      });
    }
    this.showTip = [];

    return true;
  }

  private handleTrackMouse(event: MouseEvent) {
    const domElement = event.relatedTarget as Element;
    const target = event.currentTarget as Element;

    const domEl = domElement.closest(`.${this.getModify()}`) ?? false;
    if (!domEl) {
      this.closeUl(target);
      this.closeTip();
    }
  }

  private trackMouse(elem: HTMLElement) { // следим за курсором когда он попадает на список
    elem.addEventListener('mouseout', this.handleTrackMouse);
  }

  private closeUl(elem: Element) {
    elem.classList.remove(this.getModify());
  }

  private static getVisible(elem: Element) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  private setModify(elem: Element, modifier: string, flag = false) {
    const select = `__${modifier}_visible`;
    const clearName = `${this.className.replace(/^\.js-/, '')}${select}`;
    const objClass = elem.classList;

    if (!flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  private toggle() {
    if (this.nav && this.spanBut) {
      const navVisible = HeaderMenu.getVisible(this.nav);
      this.setModify(this.nav, 'menu-wrap', navVisible);
      this.setModify(this.spanBut, 'toggle-line', navVisible);
    }
  }

  private handleButtonClick(event: Event) {
    const elem = event.currentTarget as Element;

    let expanded = elem.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    elem.setAttribute('aria-expanded', expanded);
    this.toggle();
  }

  private handleButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggle();
    }
  }

  private handleMenuMouseover(event: MouseEvent) {
    const elem = event.currentTarget as HTMLElement;

    const index = this.getIndex(elem);
    if (index != null) { this.showUl(index); }
  }

  private handleMenuKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      const currentEl = event.currentTarget as HTMLElement;

      let index = this.getIndex(currentEl);

      if (index == null) return false;

      let elem: Element | null = null;
      if (Array.isArray(this.items)) { elem = this.items[index]; }

      if (elem) {
        if (elem.classList.contains(this.getModify())) {
          this.closeAll();
        } else {
          index = this.getIndex(currentEl);
          if (index != null) this.showUl(index);
        }
      }
    } else if (event.key === 'Escape') {
      this.closeAll();
    }

    return true;
  }

  private handleDocumentMouse(event: MouseEvent) {
    const target = event.target as Element;

    const domEl = target.closest(`.${this.getModify()}`) ?? false;
    if (!domEl) {
      this.closeAll();
    }
  }

  private handleDocumentFocus(event: FocusEvent) {
    const target = event.target as Element;

    const linkElement = target.closest(`${this.className}__link-down`) ?? false;
    const ulElement = target.closest(`.${this.getModify()}`) ?? false;
    if (!linkElement && !ulElement) { this.closeAll(); }
  }

  private setActions() {
    if (!this.button || !this.nav) return false;

    this.button.addEventListener('click', this.handleButtonClick);
    this.button.addEventListener('keydown', this.handleButtonKeydown);
    this.nav.addEventListener('keydown', this.handleButtonKeydown);

    if (Array.isArray(this.linksDown)) {
      this.linksDown.forEach((item) => {
        const dom = item as HTMLElement;
        dom.addEventListener('mouseover', this.handleMenuMouseover);
        dom.addEventListener('keydown', this.handleMenuKeydown);
      });
    }

    document.addEventListener('click', this.handleDocumentMouse);
    document.addEventListener('focusin', this.handleDocumentFocus);

    return true;
  }
}

function renderHeaderMenu(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: HeaderMenu[] = [];
  components.forEach((elem) => {
    objMas.push(new HeaderMenu(className, elem));
  });
  return objMas;
}

renderHeaderMenu('.js-header');
