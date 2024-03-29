import autoBind from 'auto-bind';

class HeaderMenu {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this.element = element;

    this._startMenu();
  }

  _getElements(nameElement, parentElement) {
    return [
      ...(parentElement ?? this.element).querySelectorAll(`${this.className}__${nameElement}`),
    ];
  }

  _getElement(nameElement, parentElement) {
    return (parentElement ?? this.element).querySelector(`${this.className}__${nameElement}`);
  }

  closeAll() {
    if (!this._showElement) {
      return false;
    }

    if (this._showElement.length) {
      this._showElement.forEach((element) => {
        this._closeList(element);
      });
    }

    this._showElement = [];

    this._closeTip();
    return true;
  }

  _startMenu() {
    this._showElement = [];
    this._showTip = [];
    this._setDomElement();
    this._bindEvent();
  }

  _setDomElement() {
    this._linksDown = this._getElements('link-down');
    this._items = this._getElements('items-down');
    this._button = this._getElement('toggle');
    this._hamburger = this._getElement('toggle-line');
    this._nav = this._getElement('menu-wrapper');
    this._tip = this._getElements('tip');

    this._links = new Map();
    for (let i = 0; i < this._linksDown.length; i += 1) {
      const link = this._linksDown[i];
      if (link instanceof HTMLElement) {
        this._links.set(link, i);
      }
    }
  }

  _getIndex(element) {
    if (!this._links) {
      return null;
    }
    return this._links.get(element);
  }

  _getModifier() {
    return `${this.className}__items-down_visible`.replace(/^\.js-/, '');
  }

  static _isButtonVisible(element) {
    return window.getComputedStyle(element, null)
      .getPropertyValue('visibility') !== 'hidden';
  }

  _rotateTip(element, isRotate = false) {
    const nameModifier = (`${this.className}__tip_is-rotated`).replace(/^\.js-/, '');
    if (!isRotate) {
      element.classList.remove(nameModifier);
    } else {
      element.classList.add(nameModifier);
      if (Array.isArray(this._showTip)) {
        this._showTip.push(element);
      }
    }
  }

  _showList(index) {
    if (this._button && HeaderMenu._isButtonVisible(this._button)) {
      return false;
    }

    this.closeAll();

    if (!Array.isArray(this._items)) {
      return false;
    }

    const element = this._items[index];

    if (Array.isArray(this._tip)) {
      this._rotateTip(this._tip[index], true);
    }
    element.classList.add(this._getModifier());

    if (element instanceof HTMLElement) {
      this._trackMouse(element);
    }

    if (Array.isArray(this._showElement)) {
      this._showElement.push(element);
    }

    return true;
  }

  _closeTip() {
    if (!Array.isArray(this._showTip)) {
      return false;
    }

    if (this._showTip.length) {
      this._showTip.forEach((elem) => {
        this._rotateTip(elem);
      });
    }
    this._showTip = [];

    return true;
  }

  _handleTrackMouseOut(event) {
    const domElement = event.relatedTarget;
    const isElement = domElement.closest(`.${this._getModifier()}`) ?? false;
    if (!isElement) {
      this._closeList(event.currentTarget);
      this._closeTip();
    }
  }

  _trackMouse(element) { // следим за курсором когда он попадает на список
    element.addEventListener('mouseout', this._handleTrackMouseOut);
  }

  _closeList(element) {
    element.classList.remove(this._getModifier());
  }

  static _getVisible(element) {
    return window.getComputedStyle(element, null)
      .getPropertyValue('display') !== 'none';
  }

  _setModifier(element, modifier, isVisible = false) {
    const classNameWithModifier = `${this.className.replace(/^\.js-/, '')}${`__${modifier}_visible`}`;
    const { classList } = element;

    if (!isVisible) {
      classList.add(classNameWithModifier);
    } else {
      classList.remove(classNameWithModifier);
    }
  }

  _toggle() {
    if (this._nav && this._hamburger) {
      const navVisible = HeaderMenu._getVisible(this._nav);
      this._setModifier(this._nav, 'menu-wrapper', navVisible);
      this._setModifier(this._hamburger, 'toggle-line', navVisible);
    }
  }

  _handleToggleClick(event) {
    const element = event.currentTarget;

    let expanded = element.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    element.setAttribute('aria-expanded', expanded);
    this._toggle();
  }

  _handleToggleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleMenuMouseover(event) {
    const element = event.currentTarget;

    const index = this._getIndex(element);
    if (index != null) {
      this._showList(index);
    }
  }

  _handleMenuKeyDown(event) {
    if (event.key === 'Escape') {
      this.closeAll();
      return true;
    }

    if (event.key !== ' ') {
      return false;
    }

    event.preventDefault();
    const currentElement = event.currentTarget;

    let index = this._getIndex(currentElement);

    if (index == null) {
      return false;
    }

    let element = null;
    if (Array.isArray(this._items)) {
      element = this._items[index];
    }

    if (element && element.classList.contains(this._getModifier())) {
      this.closeAll();
      return true;
    }
    index = this._getIndex(currentElement);
    if (index != null) this._showList(index);

    return true;
  }

  _handleDocumentMouse(event) {
    const { target } = event;

    const isElement = target.closest(`.${this._getModifier()}`) ?? false;
    if (!isElement) {
      this.closeAll();
    }
  }

  _handleDocumentFocus(event) {
    const { target } = event;

    const isLinkElement = target.closest(`${this.className}__link-down`) ?? false;
    const isListElement = target.closest(`.${this._getModifier()}`) ?? false;
    if (!isLinkElement && !isListElement) {
      this.closeAll();
    }
  }

  _bindEvent() {
    if (!this._button || !this._nav) {
      return false;
    }

    this._button.addEventListener('click', this._handleToggleClick);
    this._button.addEventListener('keydown', this._handleToggleKeyDown);
    this._nav.addEventListener('keydown', this._handleToggleKeyDown);

    if (Array.isArray(this._linksDown)) {
      this._linksDown.forEach((item) => {
        item.addEventListener('mouseover', this._handleMenuMouseover);
        item.addEventListener('keydown', this._handleMenuKeyDown);
      });
    }

    document.addEventListener('click', this._handleDocumentMouse);
    document.addEventListener('focusin', this._handleDocumentFocus);

    return true;
  }
}

export default HeaderMenu;
