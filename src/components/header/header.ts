import './header.scss';

class headerMenu {

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
    const elem: Element | null = dom.querySelector(selector);
    if (elem instanceof HTMLElement)
      return function (): HTMLElement { return elem; };
    if (elem instanceof Element)
      return function (): Element { return elem; };
    return () => { return elem; };
  }

  closeAll() {
    if (this.showElem)
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
    if (!this.mapLinks) return null;
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
      if (Array.isArray(this.showTip))
        this.showTip.push(elem);
    }
  }

  private showUl(index: number) {
    if (this.button)
      if (this.getVisButton(this.button)) return;

    this.closeAll();

    if (Array.isArray(this.items)) {
      const elem = this.items[index];
      if (Array.isArray(this.tip))
        this.rotateTip(this.tip[index], true);
      elem.classList.add(this.getModify());
      if (elem instanceof HTMLElement)
        this.trackMouse(elem);
      if (Array.isArray(this.showElem))
        this.showElem.push(elem);
    }
  }

  private closeTip() {
    if (Array.isArray(this.showTip))
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

      if (rel instanceof Element) {
        const domEl = rel.closest('.' + this.getModify()) ?? false;
        if (!domEl) {
          {
            if (target instanceof Element)
              this.closeUl(target);
            this.closeTip();
          }
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
    if (this.nav && this.spanBut) {
      const navVisible: boolean = this.getVisible(this.nav);
      this.setModify(this.nav, 'menu-wrap', navVisible);
      this.setModify(this.spanBut, 'toggle-line', navVisible);
    }
  }

  private setActions() {
    if (this.button)
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

    if (this.button)
      this.button.addEventListener('keydown', keydown);
    if (this.nav)
      this.nav.addEventListener('keydown', keydown);

    if (Array.isArray(this.linksDown))
      for (let item of this.linksDown) {
        const dom = item;
        if (dom instanceof HTMLElement)
          dom.addEventListener('mouseover', (e: MouseEvent) => {
            const elem = e.currentTarget;
            if (elem instanceof HTMLElement) {
              const index = this.getIndex(elem);
              if (index != null)
                this.showUl(index);
            }

          });

        const showMenuFocus = (e: KeyboardEvent) => {
          if (e.key == ' ') {
            e.preventDefault();
            const currentEl = e.currentTarget;

            if (currentEl instanceof HTMLElement) {
              const index = this.getIndex(currentEl);
              if (index == null) return;
              let elem: Element | null = null;
              if (Array.isArray(this.items))
                elem = this.items[index];

              if (elem)
                if (elem.classList.contains(this.getModify())) {
                  this.closeAll();
                }
                else {
                  if (currentEl instanceof HTMLElement) {
                    const index = this.getIndex(currentEl);
                    if (index != null)
                      this.showUl(index);
                  }
                }
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

      if (target instanceof Element) {
        const domEl = target.closest('.' + this.getModify()) ?? false;
        if (!domEl) {
          this.closeAll();
        }
      }
    });

    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target;

      if (target instanceof Element) {
        const linkEl = target.closest(
          this.className + '__link-down'
        ) ?? false;

        const ulEl = target.closest('.' + this.getModify()) ?? false;
        if (!linkEl && !ulEl) { this.closeAll(); }
      }

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