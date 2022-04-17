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
    const flag = display !== 'block';

    this._toggleModify(this.elem, '_visible', flag);
  }

  _getElement(str, domBase) {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    return dom.querySelector(selector);
  }

  _setDomElem() {
    this._wrap = this._getElement('__wrap');
    this._headerEl = this._getElement('__header');
    this._imgEl = this._getElement('__tip');
  }

  _toggleModify(elem, modify, flag = false) {
    const clearName = `${this.className.replace(/^\.js-/, '')}${modify}`;
    const objClass = elem.classList;

    if (flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  _handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleVis();
    } else if (event.key === 'Escape') {
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

function renderCheckboxList(className) {
  const components = document.querySelectorAll(className);
  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new CheckBoxList(className, elem));
  });
  return objMas;
}

renderCheckboxList('.js-checkbox-list');
