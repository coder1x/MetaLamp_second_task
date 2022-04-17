import autoBind from 'auto-bind';
import './search-room.scss';

class Sidebar {
  constructor(options) {
    autoBind(this);
    this.blockClass = options.block;
    this.buttonClass = options.button;
    this._click = false;
    this._setDom();
    this._setActions();
  }

  _setDom() {
    this.button = document.querySelector(this.buttonClass);
    this.block = document.querySelector(this.blockClass);
    this.classVisible = `${this.blockClass.replace(/^\./, '')}_visible`;
  }

  _getVisible() {
    if (!this.block) return false;

    const display = window.getComputedStyle(this.block, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  _toggle(flag = this._getVisible()) {
    if (!this.block) return false;

    const objClass = this.block.classList;

    if (!flag) {
      objClass.add(this.classVisible);
      const elem = this.block.querySelector('input');
      if (elem) { elem.focus(); }
    } else {
      objClass.remove(this.classVisible);
    }
    return true;
  }

  _handleButtonClick(event) {
    this._click = true;
    this._toggle();

    const dom = event.currentTarget;
    let expanded = dom.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    dom.setAttribute('aria-expanded', expanded);
  }

  _handleBlockClick() {
    this._click = true;
  }

  _handleBlockKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleDocumentFocusin(event) {
    const { target } = event;
    const linkEl = target.closest(this.blockClass);

    if (!linkEl && this._getVisible() && this.button) {
      const elem = this.button.querySelector('button');
      const path = (event.composedPath && event.composedPath());

      if (!path.includes(elem, 0)) {
        this._toggle();
        elem.focus();
      }
    }
  }

  _handleDocumentClick() {
    const flag = this._getVisible() && !this._click;

    if (flag) { this._toggle(true); }
    this._click = false;
  }

  _setActions() {
    if (!this.block || !this.button) return false;

    this.button.addEventListener('click', this._handleButtonClick);
    this.block.addEventListener('click', this._handleBlockClick);
    this.block.addEventListener('keydown', this._handleBlockKeydown);
    document.addEventListener('focusin', this._handleDocumentFocusin);
    document.addEventListener('click', this._handleDocumentClick);

    return true;
  }
}

const obj = new Sidebar({
  block: '.search-room-filter',
  button: '.search-room-content__button-wrap',
});

export default obj;
