import './header.scss';

class headerMenu {

  className: string;
  elem: Element;
  items: HTMLElement[];
  mapLinks: Map<HTMLElement, number>;
  showElem: Element[];
  showTip: Element[];
  button: HTMLElement;
  nav: HTMLElement;
  spanBut: Element;
  linksDown: HTMLElement[];
  tip: HTMLElement[];

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.startMenu();
  }

  getElements(str: string): HTMLElement[] {
    const selector = this.className + '__' + str + '-down';
    return [...this.elem.querySelectorAll<HTMLElement>(selector)];
  }

  getElement(str: string): HTMLElement {
    const selector = this.className + '__' + str;
    return this.elem.querySelector(selector);
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
    this.linksDown = this.getElements('link');
    this.items = this.getElements('items');
    this.button = this.getElement('toggle');
    this.spanBut = this.getElement('toggle-line');
    this.nav = this.getElement('menu-wrap');

    const selector = this.className + '__tip';
    this.tip = [...this.elem.querySelectorAll<HTMLElement>(selector)];

    this.mapLinks = new Map();
    for (let i = 0; i < this.linksDown.length; i++) {
      this.mapLinks.set(this.linksDown[i], i);
    }
  }

  private getIndex(elem: HTMLElement) {
    return this.mapLinks.get(elem);
  }

  private getModify() {
    const selector = this.className + '__items-down_visible';
    return selector.replace(/^\./, '');
  }

  private getVisButton(elem: Element) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('visibility');
    return display === 'hidden' ? false : true;
  }

  private rotateTip(elem: Element, fl = false) {
    const name = (this.className + '__tip_rotate').replace(/^\./, '');
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
      const rel = e.relatedTarget as HTMLElement;
      const target = e.currentTarget as HTMLElement;
      let domEl = rel.closest('.' + this.getModify()) ?? false;

      if (!domEl) {
        {
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
    const clearName = this.className.replace(/^\./, '') + select;
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
      const elem = e.currentTarget as HTMLElement;
      let expanded = elem.getAttribute('aria-expanded');
      expanded = expanded == 'true' ? 'false' : 'true';
      elem.setAttribute('aria-expanded', expanded);

      this.toggle();
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
      item.addEventListener('mouseover', (e: MouseEvent) => {
        const elem = e.currentTarget as HTMLElement;
        this.showUl(this.getIndex(elem));
      });

      const showMenuFocus = (e: KeyboardEvent) => {
        if (e.key == ' ') {
          e.preventDefault();
          const currentEl = e.currentTarget as HTMLElement;
          const index = this.getIndex(currentEl);
          const elem = this.items[index];

          if (elem.classList.contains(this.getModify())) {
            this.closeAll();
          }
          else {
            this.showUl(this.getIndex(currentEl));
          }
        } else {
          if (e.key == 'Escape') {
            this.closeAll();
          }
        }
      };

      item.addEventListener('keydown', showMenuFocus);
    }

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const domEl = target.closest('.' + this.getModify()) ?? false;
      if (!domEl) {
        this.closeAll();
      }
    });


    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const linkEl = target.closest(
        this.className + '__link-down'
      ) ?? false;
      const ulEl = target.closest('.' + this.getModify()) ?? false;
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


renderHeaderMenu('.header');