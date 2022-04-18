import autoBind from 'auto-bind';
import './checkbox-list.scss';

class CheckBoxList {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this.init();
  }

  init() {
    this._setDomElem();
    this._setActions();
  }

  toggleVis() {
    let display = '';

    if (this._wrap) {
      display = window.getComputedStyle(this._wrap, null)
        .getPropertyValue('display');
    }

    this._toggleModify(this.elem, '_visible', display !== 'block');
  }

  _getElement(str, domBase) {
    const selector = `${this.className}${str}`;
    return (domBase ?? this.elem).querySelector(selector);
  }

  _setDomElem() {
    this._wrap = this._getElement('__wrap');
    this._headerEl = this._getElement('__header');
    this._imgEl = this._getElement('__tip');
  }

  _toggleModify(elem, modify, flag = false) {
    const clearName = `${this.className.replace(/^\.js-/, '')}${modify}`;
    const { classList } = elem.classList;

    if (flag) {
      classList.add(clearName);
    } else {
      classList.remove(clearName);
    }
  }

  _handleKeydown(event) {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.toggleVis();
    } else if (key === 'Escape') {
      event.preventDefault();
      this._toggleModify(this.elem, '_visible', false);
    }
  }

  _setActions() {
    if (this._imgEl && this._headerEl) {
      this._headerEl.addEventListener('click', this.toggleVis);
      this._headerEl.addEventListener('keydown', this._handleKeydown);
    }
  }
}

export default CheckBoxList;
