import autoBind from 'auto-bind';
import './header.scss';

class HeaderMenu {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this.elem = elem;

    this._startMenu();
  }

  _getElements(str, domBase) {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    const doms = [...dom.querySelectorAll(selector)];
    return doms;
  }

  _getElement(str, domBase) {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    return dom.querySelector(selector);
  }

  closeAll() {
    if (this._showElem) {
      if (this._showElem.length) {
        this._showElem.forEach((elem) => {
          this._closeUl(elem);
        });
      }
    }
    this._showElem = [];

    this._closeTip();
  }

  _startMenu() {
    this._showElem = [];
    this._showTip = [];
    this._setDom();
    this._setActions();
  }

  _setDom() {
    this._linksDown = this._getElements('__link-down');
    this._items = this._getElements('__items-down');
    this._button = this._getElement('__toggle');
    this._spanBut = this._getElement('__toggle-line');
    this._nav = this._getElement('__menu-wrap');
    this._tip = this._getElements('__tip');

    this._mapLinks = new Map();
    for (let i = 0; i < this._linksDown.length; i += 1) {
      const tt = this._linksDown[i];
      if (tt instanceof HTMLElement) { this._mapLinks.set(tt, i); }
    }
  }

  _getIndex(elem) {
    if (!this._mapLinks) return null;
    return this._mapLinks.get(elem);
  }

  _getModify() {
    const selector = `${this.className}__items-down_visible`;
    return selector.replace(/^\.js-/, '');
  }

  static _getVisButton(elem) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('visibility');
    return display !== 'hidden';
  }

  _rotateTip(elem, flag = false) {
    const name = (`${this.className}__tip_rotate`).replace(/^\.js-/, '');
    if (!flag) {
      elem.classList.remove(name);
    } else {
      elem.classList.add(name);
      if (Array.isArray(this._showTip)) { this._showTip.push(elem); }
    }
  }

  _showUl(index) {
    if (this._button) {
      if (HeaderMenu._getVisButton(this._button)) return false;
    }

    this.closeAll();

    if (Array.isArray(this._items)) {
      const elem = this._items[index];

      if (Array.isArray(this._tip)) { this._rotateTip(this._tip[index], true); }
      elem.classList.add(this._getModify());

      if (elem instanceof HTMLElement) { this._trackMouse(elem); }

      if (Array.isArray(this._showElem)) { this._showElem.push(elem); }
    }

    return true;
  }

  _closeTip() {
    if (!Array.isArray(this._showTip)) return false;

    if (this._showTip.length) {
      this._showTip.forEach((elem) => {
        this._rotateTip(elem);
      });
    }
    this._showTip = [];

    return true;
  }

  _handleTrackMouse(event) {
    const domElement = event.relatedTarget;
    const target = event.currentTarget;

    const domEl = domElement.closest(`.${this._getModify()}`) ?? false;
    if (!domEl) {
      this._closeUl(target);
      this._closeTip();
    }
  }

  _trackMouse(elem) { // следим за курсором когда он попадает на список
    elem.addEventListener('mouseout', this._handleTrackMouse);
  }

  _closeUl(elem) {
    elem.classList.remove(this._getModify());
  }

  static _getVisible(elem) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  _setModify(elem, modifier, flag = false) {
    const select = `__${modifier}_visible`;
    const clearName = `${this.className.replace(/^\.js-/, '')}${select}`;
    const objClass = elem.classList;

    if (!flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  _toggle() {
    if (this._nav && this._spanBut) {
      const navVisible = HeaderMenu._getVisible(this._nav);
      this._setModify(this._nav, 'menu-wrap', navVisible);
      this._setModify(this._spanBut, 'toggle-line', navVisible);
    }
  }

  _handleButtonClick(event) {
    const elem = event.currentTarget;

    let expanded = elem.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    elem.setAttribute('aria-expanded', expanded);
    this._toggle();
  }

  _handleButtonKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleMenuMouseover(event) {
    const elem = event.currentTarget;

    const index = this._getIndex(elem);
    if (index != null) { this._showUl(index); }
  }

  _handleMenuKeydown(event) {
    if (event.key === ' ') {
      event.preventDefault();
      const currentEl = event.currentTarget;

      let index = this._getIndex(currentEl);

      if (index == null) return false;

      let elem = null;
      if (Array.isArray(this._items)) { elem = this._items[index]; }

      if (elem) {
        if (elem.classList.contains(this._getModify())) {
          this.closeAll();
        } else {
          index = this._getIndex(currentEl);
          if (index != null) this._showUl(index);
        }
      }
    } else if (event.key === 'Escape') {
      this.closeAll();
    }

    return true;
  }

  _handleDocumentMouse(event) {
    const { target } = event;

    const domEl = target.closest(`.${this._getModify()}`) ?? false;
    if (!domEl) {
      this.closeAll();
    }
  }

  _handleDocumentFocus(event) {
    const { target } = event;

    const linkElement = target.closest(`${this.className}__link-down`) ?? false;
    const ulElement = target.closest(`.${this._getModify()}`) ?? false;
    if (!linkElement && !ulElement) { this.closeAll(); }
  }

  _setActions() {
    if (!this._button || !this._nav) return false;

    this._button.addEventListener('click', this._handleButtonClick);
    this._button.addEventListener('keydown', this._handleButtonKeydown);
    this._nav.addEventListener('keydown', this._handleButtonKeydown);

    if (Array.isArray(this._linksDown)) {
      this._linksDown.forEach((item) => {
        const dom = item;
        dom.addEventListener('mouseover', this._handleMenuMouseover);
        dom.addEventListener('keydown', this._handleMenuKeydown);
      });
    }

    document.addEventListener('click', this._handleDocumentMouse);
    document.addEventListener('focusin', this._handleDocumentFocus);

    return true;
  }
}

function renderHeaderMenu(className) {
  const components = document.querySelectorAll(className);
  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new HeaderMenu(className, elem));
  });
  return objMas;
}

renderHeaderMenu('.js-header');
