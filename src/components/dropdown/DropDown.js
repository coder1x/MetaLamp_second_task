import autoBind from 'auto-bind';

import message from '@com/message/message';

class DropDown {
  constructor(element) {
    autoBind(this);
    this.className = '.js-dropdown';
    this.element = element;

    this._init();
  }

  checkValue(item) {
    const buttonMinus = this._getElement('minus', item);
    const buttonPlus = this._getElement('plus', item);

    const classModifierMinus = this._getModifier('__minus', '_disable');
    const value = Number(this._getElement('value', item).innerText);

    if (!value) {
      buttonMinus.classList.add(classModifierMinus);
      buttonMinus.disabled = true;
    } else {
      buttonMinus.classList.remove(classModifierMinus);
      buttonMinus.disabled = false;
    }

    const maxValue = Number(buttonPlus.getAttribute('data-max'));
    const classModifierPlus = this._getModifier('__plus', '_disable');

    let isDisabled = false;
    const { classList } = buttonPlus;
    if (value >= maxValue) {
      classList.add(classModifierPlus);
      isDisabled = true;
    } else {
      classList.remove(classModifierPlus);
    }

    this._isButtonPlus = isDisabled;
    buttonPlus.disabled = isDisabled;
  }

  resetValue() {
    if (!this._values || !this._inputElement) {
      return false;
    }

    this._values.forEach((item) => {
      const spanElement = item;
      spanElement.innerText = '0';
    });

    this._inputElement.value = this.defaultText;

    if (!this._items || !this._clearButton) {
      return false;
    }

    this._items.map((item) => this.checkValue(item));
    this._toggleModifier(this._clearButton, '__button-clear_visible');

    return true;
  }

  validateData() {
    if (!(this._inputElement instanceof HTMLInputElement)) {
      return false;
    }
    const defaultText = this._inputElement.value !== this.defaultText;
    return !defaultText || this._inputElement.value;
  }

  static declineWords(number, words) {
    const numbersUpToFive = number % 10 < 5 ? number % 10 : 5;
    const isPlural = number % 100 > 4 && number % 100 < 20;

    return words[isPlural ? 2 : [2, 0, 1, 1, 1, 2][numbersUpToFive]];
  }

  getCategories() {
    const fields = new Map();
    if (!Array.isArray(this._values)) {
      return false;
    }

    for (let i = 0; i < this._values.length; i += 1) {
      const typeText = this._declensions[i].join(',');
      const value = Number(this._values[i].innerText);

      if (fields.has(typeText)) {
        const oldValue = fields.get(typeText);
        const newValue = oldValue + value;
        fields.set(typeText, newValue);
      } else {
        fields.set(typeText, value);
      }
    }

    return fields;
  }

  _init() {
    this._declensions = [];
    this._setDomElement();
    this._bindEvent();
    this._bindEventSelect();
  }

  _getModifier(nameElement, modifier) {
    return `${this.className.replace(/^\.js-/, '')}${nameElement}${modifier}`;
  }

  _getElements(nameElement, parentElement) {
    return [
      ...(parentElement ?? this.element).querySelectorAll(`${this.className}__${nameElement}`),
    ];
  }

  _getElement(nameElement, parentElement) {
    return (parentElement ?? this.element).querySelector(`${this.className}__${nameElement}`);
  }

  _setDomElement() {
    this._applyButton = this._getElement('button-apply');
    this._clearButton = this._getElement('button-clear');
    this._items = this._getElements('select-item');

    this._values = [];

    this._items.forEach((item) => {
      this.checkValue(item);
      this._values.push(this._getElement('value', item));

      this._readingAttributes(item);
    });

    this._inputElement = this._getElement('input');

    this.defaultText = this._inputElement.placeholder;
    this._selectElement = this._getElement('select');
    this._tipElement = this._getElement('tip');
  }

  _readingAttributes(element) {
    if (element) {
      this._declensions.push(
        (element.getAttribute('data-type') ?? '').split(','),
      );
    }
  }

  _handleInputMouseUp() {
    this._toggleVisibility();
    this._isClicked = false;
  }

  _handleInputMouseDown() {
    this._isClicked = true;
  }

  _handleInputFocus() {
    if (!this._isClicked) {
      this._toggleVisibility();
    }
  }

  _handleInputKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggleVisibility(true);
    } else if (event.key === ' ') {
      event.preventDefault();
      this._toggleVisibility();
    }
  }

  _handleTipClick() {
    this._toggleVisibility();
  }

  _handleSelectKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggleVisibility(true);
    }
  }

  _handleButtonApplyClick(event) {
    event.preventDefault();

    if (!this.validateData()) {
      message('Выберите количество гостей.');
    } else {
      this._toggleVisibility();
    }
    return true;
  }

  _handleButtonClearClick(event) {
    event.preventDefault();
    this.resetValue();
  }

  _handleDocumentEvent(event) {
    const { target } = event;

    if (target.closest(this.className) !== this.element) {
      this._toggleVisibility(true);
    }
  }

  _bindEvent() {
    if (!this._inputElement || !this._tipElement) {
      return false;
    }

    this._inputElement.addEventListener('mouseup', this._handleInputMouseUp);
    this._inputElement.addEventListener('mousedown', this._handleInputMouseDown);
    this._inputElement.addEventListener('focus', this._handleInputFocus);
    this._inputElement.addEventListener('keydown', this._handleInputKeyDown);
    this._tipElement.addEventListener('click', this._handleTipClick);

    if (this._selectElement) {
      this._selectElement.addEventListener(
        'keydown',
        this._handleSelectKeyDown,
      );
    }

    if (this._applyButton) {
      this._applyButton.addEventListener('click', this._handleButtonApplyClick);
    }

    if (this._clearButton) {
      this._clearButton.addEventListener('click', this._handleButtonClearClick);
    }

    document.addEventListener('click', this._handleDocumentEvent);
    document.addEventListener('focusin', this._handleDocumentEvent);

    return true;
  }

  static _getVisibility(element) {
    return window.getComputedStyle(element, null)
      .getPropertyValue('display') !== 'none';
  }

  _toggleVisibility(isVisible = false) {
    if (!this._selectElement) {
      return;
    }

    this._toggleModifier(
      this.element,
      '_visible',
      !DropDown._getVisibility(this._selectElement) && !isVisible,
    );
  }

  _toggleModifier(element, modifier, isVisible = false) {
    const clearName = this.className.replace(/^\.js-/, '') + modifier;
    const { classList } = element;

    if (isVisible) {
      classList.add(clearName);
    } else {
      classList.remove(clearName);
    }
  }

  _handleItemClick(event) {
    event.preventDefault();

    const { target } = event;
    const spanElement = event.currentTarget;

    const value = this._getElement('value', spanElement);
    const isButtonMinus = target.closest(`${this.className}__minus`);
    const isButtonPlus = target.closest(`${this.className}__plus`);

    let number = Number(value.innerText);
    if (isButtonMinus && number) {
      number -= 1;
    } else if (isButtonPlus && !this._isButtonPlus) {
      number += 1;
    }

    value.innerText = String(number);
    this.checkValue(spanElement);
    this._createInputText();
  }

  _bindEventSelect() {
    if (Array.isArray(this._items)) {
      this._items.forEach((item) => {
        item.addEventListener('click', this._handleItemClick);
      });
    }
  }

  _setInputData(visibility, value, placeholder) {
    if (this._clearButton) {
      this._toggleModifier(
        this._clearButton,
        '__button-clear_visible',
        visibility,
      );
    }

    if (this._inputElement instanceof HTMLInputElement) {
      this._inputElement.value = value;
      this._inputElement.placeholder = placeholder;
    }
  }

  static _mergeText(
    value,
    words,
    text,
    isMultiString = false,
  ) {
    const number = Number(value);
    if (!number) {
      return text;
    }

    if (!isMultiString) {
      return `${text}${number} ${DropDown.declineWords(number, words)}`;
    }
    const comma = text ? ', ' : '';
    return `${text}${comma + number} ${DropDown.declineWords(number, words)}`;
  }

  _createInputText() {
    let text = '';
    let isMultiStringLock = false;

    this.getCategories().forEach((value, key) => {
      text = DropDown._mergeText(value, key.split(','), text, Boolean(isMultiStringLock));
      isMultiStringLock = true;
    });

    if (text) {
      this._setInputData(true, text, text);
    } else {
      this._setInputData(false, '', this.defaultText);
    }
  }
}

export default DropDown;
