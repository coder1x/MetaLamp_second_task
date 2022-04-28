import autoBind from 'auto-bind';

class HeaderMenu {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this.element = element;

    this._startMenu();
  }

  _getElements(string, parentElement) {
    return [
      ...(parentElement ?? this.element)
        .querySelectorAll(`${this.className}${string}`),
    ];
  }

  _getElement(string, parentElement) {
    return (parentElement ?? this.element)
      .querySelector(`${this.className}${string}`);
  }

  closeAll() {
    if (this._showElement) {
      if (this._showElement.length) {
        this._showElement.forEach((element) => {
          this._closeList(element);
        });
      }
    }
    this._showElement = [];

    this._closeTip();
  }

  _startMenu() {
    this._showElement = [];
    this._showTip = [];
    this._setDomElement();
    this._bindEvent();
  }

  _setDomElement() {
    this._linksDown = this._getElements('__link-down');
    this._items = this._getElements('__items-down');
    this._button = this._getElement('__toggle');
    this._hamburger = this._getElement('__toggle-line');
    this._nav = this._getElement('__menu-wrap');
    this._tip = this._getElements('__tip');

    this._links = new Map();
    for (let i = 0; i < this._linksDown.length; i += 1) {
      const link = this._linksDown[i];
      if (link instanceof HTMLElement) { this._links.set(link, i); }
    }
  }

  _getIndex(element) {
    if (!this._links) return null;
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
    const selector = (`${this.className}__tip_rotate`).replace(/^\.js-/, '');
    if (!isRotate) {
      element.classList.remove(selector);
    } else {
      element.classList.add(selector);
      if (Array.isArray(this._showTip)) { this._showTip.push(element); }
    }
  }

  _showList(index) {
    if (this._button) {
      if (HeaderMenu._isButtonVisible(this._button)) return false;
    }

    this.closeAll();

    if (Array.isArray(this._items)) {
      const element = this._items[index];

      if (Array.isArray(this._tip)) { this._rotateTip(this._tip[index], true); }
      element.classList.add(this._getModifier());

      if (element instanceof HTMLElement) { this._trackMouse(element); }

      if (Array.isArray(this._showElement)) { this._showElement.push(element); }
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
    const isElement = domElement.closest(`.${this._getModifier()}`) ?? false;
    if (!isElement) {
      this._closeList(event.currentTarget);
      this._closeTip();
    }
  }

  _trackMouse(element) { // следим за курсором когда он попадает на список
    element.addEventListener('mouseout', this._handleTrackMouse);
  }

  _closeList(element) {
    element.classList.remove(this._getModifier());
  }

  static _getVisible(element) {
    return window.getComputedStyle(element, null)
      .getPropertyValue('display') !== 'none';
  }

  _setModifier(element, modifier, isVisible = false) {
    const selector = `${this.className.replace(/^\.js-/, '')}${`__${modifier}_visible`}`;
    const { classList } = element;

    if (!isVisible) {
      classList.add(selector);
    } else {
      classList.remove(selector);
    }
  }

  _toggle() {
    if (this._nav && this._hamburger) {
      const navVisible = HeaderMenu._getVisible(this._nav);
      this._setModifier(this._nav, 'menu-wrap', navVisible);
      this._setModifier(this._hamburger, 'toggle-line', navVisible);
    }
  }

  _handleButtonClick(event) {
    const element = event.currentTarget;

    let expanded = element.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    element.setAttribute('aria-expanded', expanded);
    this._toggle();
  }

  _handleButtonKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleMenuMouseover(event) {
    const element = event.currentTarget;

    const index = this._getIndex(element);
    if (index != null) { this._showList(index); }
  }

  _handleMenuKeydown(event) {
    if (event.key === ' ') {
      event.preventDefault();
      const currentElement = event.currentTarget;

      let index = this._getIndex(currentElement);

      if (index == null) return false;

      let element = null;
      if (Array.isArray(this._items)) { element = this._items[index]; }

      if (element) {
        if (element.classList.contains(this._getModifier())) {
          this.closeAll();
        } else {
          index = this._getIndex(currentElement);
          if (index != null) this._showList(index);
        }
      }
    } else if (event.key === 'Escape') {
      this.closeAll();
    }

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

    const isLinkElement = target.closest(
      `${this.className}__link-down`,
    ) ?? false;
    const isListElement = target.closest(`.${this._getModifier()}`) ?? false;
    if (!isLinkElement && !isListElement) { this.closeAll(); }
  }

  _bindEvent() {
    if (!this._button || !this._nav) return false;

    this._button.addEventListener('click', this._handleButtonClick);
    this._button.addEventListener('keydown', this._handleButtonKeydown);
    this._nav.addEventListener('keydown', this._handleButtonKeydown);

    if (Array.isArray(this._linksDown)) {
      this._linksDown.forEach((item) => {
        item.addEventListener('mouseover', this._handleMenuMouseover);
        item.addEventListener('keydown', this._handleMenuKeydown);
      });
    }

    document.addEventListener('click', this._handleDocumentMouse);
    document.addEventListener('focusin', this._handleDocumentFocus);

    return true;
  }
}

export default HeaderMenu;
