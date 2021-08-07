import './header.scss';

class headerMenu {

  className: string;
  elem: Element;
  items: any;
  mapLinks: any;
  showElem: Element[];
  showTip: Element[];
  button: Element;
  nav: Element;
  spanBut: Element;
  linksDown: any;
  tip: any;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.startMenu();
  }

  private startMenu() {
    this.showElem = [];
    this.showTip = [];
    this.setDom();
    this.setActions();
  }


  getElements(str: string): any {
    const selector = this.className + '__' + str + '-down';
    return this.elem.querySelectorAll(selector);
  }

  getElement(str: string): Element {
    const selector = this.className + '__' + str;
    return this.elem.querySelector(selector);
  }

  private setDom() {
    this.linksDown = this.getElements('link');
    this.items = this.getElements('items');
    this.button = this.getElement('toggle');
    this.spanBut = this.getElement('toggle-line');
    this.nav = this.getElement('menu-wrap');

    const selector = this.className + '__tip';
    this.tip = this.elem.querySelectorAll(selector);

    this.mapLinks = new Map();
    for (let i = 0; i < this.linksDown.length; i++) {
      this.mapLinks.set(this.linksDown[i], i);
    }
  }

  private getIndex(elem: Element) {
    return this.mapLinks.get(elem);
  }

  private getModif() {
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
    elem.classList.add(this.getModif());
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

  private trackMouse(elem: Element) {  // следим за курсором когда он попадает на список
    elem.addEventListener('mouseout', (e: any) => {
      const rel = e.relatedTarget;
      let domEl = rel.closest('.' + this.getModif()) ?? false;

      if (!domEl) {
        {
          this.closeUl(e.currentTarget);
          this.closeTip();
        }
      }
    });
  }

  private closeUl(elem: Element) {
    elem.classList.remove(this.getModif());
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

  private getVisible(elem: Element) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }

  private setModif(elem: Element, mod: string, fl = false) {
    const select = '__' + mod + '_visible';
    const clearName = this.className.replace(/^\./, '') + select;
    let objClass = elem.classList;
    !fl ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private toggle() {
    const navVisible: boolean = this.getVisible(this.nav);
    this.setModif(this.nav, 'menu-wrap', navVisible);
    this.setModif(this.spanBut, 'toggle-line', navVisible);
  }

  private setActions() {

    this.button.addEventListener('click', (e: any) => {
      const elem = e.currentTarget;
      let expanded = elem.getAttribute('aria-expanded');
      expanded = expanded == 'true' ? 'false' : 'true';
      elem.setAttribute('aria-expanded', expanded);

      this.toggle();
    });

    const keydown = (e: any) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle();
      }
    };

    this.button.addEventListener('keydown', keydown);
    this.nav.addEventListener('keydown', keydown);


    for (let item of this.linksDown) {
      item.addEventListener('mouseover', (e: any) => {
        const elem = e.currentTarget;
        this.showUl(this.getIndex(elem));
      });

      const showMenuFocus = (e: any) => {
        if (e.key == ' ') {
          e.preventDefault();
          const currentEl = e.currentTarget;
          const index = this.getIndex(currentEl);
          const elem = this.items[index];

          if (elem.classList.contains(this.getModif())) {
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

    document.addEventListener('click', (e: any) => {
      const domEl = e.target.closest('.' + this.getModif()) ?? false;
      if (!domEl) {
        this.closeAll();
      }

    });


    document.addEventListener('focusin', (e: any) => {
      const linkEl = e.target.closest(
        this.className + '__link-down'
      ) ?? false;
      const ulEl = e.target.closest('.' + this.getModif()) ?? false;
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