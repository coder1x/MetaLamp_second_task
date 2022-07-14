import autoBind from 'auto-bind';

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

  handleHeaderClick() {
    this._toggleModifier(this.element, '_visible');
  }

  _getElement(string, parentElement) {
    const selector = `${this.className}${string}`;
    return (parentElement ?? this.element).querySelector(selector);
  }

  _setDomElement() {
    this._wrapper = this._getElement('__wrapper');
    this._headerElement = this._getElement('__header');
    this._imageElement = this._getElement('__tip');
  }

  _toggleModifier(element, modifier, isVisible = false) {
    const classWithModifier = `${this.className.replace(/^\.js-/, '')}${modifier}`;
    const { classList } = element;

    if (isVisible && !classList.contains(classWithModifier)) return false;

    classList.toggle(classWithModifier);

    return true;
  }

  _handleHeaderKeyDown(event) {
    const { key } = event;

    const isEnter = key === 'Enter';
    const isSpace = key === ' ';

    if (isEnter || isSpace) {
      event.preventDefault();
      this.handleHeaderClick();
    } else if (key === 'Escape') {
      event.preventDefault();
      this._toggleModifier(this.element, '_visible', true);
    }
  }

  _bindEvent() {
    if (this._imageElement && this._headerElement) {
      this._headerElement.addEventListener('click', this.handleHeaderClick);
      this._headerElement.addEventListener('keydown', this._handleHeaderKeyDown);
    }
  }
}

export default CheckBoxList;
