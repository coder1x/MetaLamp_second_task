import autoBind from 'auto-bind';
import './checkbox-list.scss';

class CheckBoxList {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this.element = element;
    this.init();
  }

  init() {
    this._setDomElement();
    this._bindEvent();
  }

  toggleVisible() {
    let display = '';

    if (this._wrapper) {
      display = window.getComputedStyle(this._wrapper, null)
        .getPropertyValue('display');
    }

    this._toggleModifier(this.element, '_visible', display !== 'block');
  }

  _getElement(string, parentElement) {
    const selector = `${this.className}${string}`;
    return (parentElement ?? this.element).querySelector(selector);
  }

  _setDomElement() {
    this._wrapper = this._getElement('__wrap');
    this._headerElem = this._getElement('__header');
    this._imgElem = this._getElement('__tip');
  }

  _toggleModifier(element, modifier, isVisible = false) {
    const classWithModif = `${this.className.replace(/^\.js-/, '')}${modifier}`;
    const { classList } = element;

    if (isVisible) {
      classList.add(classWithModif);
    } else {
      classList.remove(classWithModif);
    }
  }

  _handleKeydown(event) {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.toggleVisible();
    } else if (key === 'Escape') {
      event.preventDefault();
      this._toggleModifier(this.element, '_visible', false);
    }
  }

  _bindEvent() {
    if (this._imgElem && this._headerElem) {
      this._headerElem.addEventListener('click', this.toggleVisible);
      this._headerElem.addEventListener('keydown', this._handleKeydown);
    }
  }
}

export default CheckBoxList;
