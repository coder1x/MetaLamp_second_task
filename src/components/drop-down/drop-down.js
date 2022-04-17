import autoBind from 'auto-bind';
import './drop-down.scss';

class DropDown {
  constructor(className, component) {
    autoBind(this);
    this.className = className;
    this.elem = component;
    this._init();
  }

  getCheckVal(item) {
    const minus = this._getElement('__minus', item);
    const value = this._getElement('__value', item);
    const plus = this._getElement('__plus', item);

    const getModify = (str, str2) => this.className.replace(/^\.js-/, '') + str + str2;

    const classM = getModify('__minus', '_disable');
    const val = Number(value.innerText);

    if (!val) {
      minus.classList.add(classM);
      minus.disabled = true;
    } else {
      minus.classList.remove(classM);
      minus.disabled = false;
    }

    const maxVal = Number(plus.getAttribute('data-max'));
    const classP = getModify('__plus', '_disable');
    if (val >= maxVal) {
      plus.classList.add(classP);
      this._disPlus = true;
      plus.disabled = true;
    } else {
      plus.classList.remove(classP);
      this._disPlus = false;
      plus.disabled = false;
    }
  }

  resetValue() {
    if (!this._valueMas || !this._inputEl) return false;

    this._valueMas.forEach((item) => {
      const span = item;
      span.innerText = '0';
    });

    this._inputEl.value = this.defaultText;

    if (!this._items || !this._clearBut) return false;

    this._items.map((item) => this.getCheckVal(item));
    this._toggleModify(this._clearBut, '__button-clear_visible');

    return true;
  }

  static declOfNum(number, words) {
    return words[(number % 100 > 4
      && number % 100 < 20) ? 2
      : [2, 0, 1, 1, 1, 2][(number % 10 < 5)
        ? number % 10 : 5]];
  }

  getMapValue() {
    const fields = new Map();
    if (Array.isArray(this._valueMas)) {
      for (let i = 0; i < this._valueMas.length; i += 1) {
        const typeText = this._declensions[i].join(',');
        const value = Number(this._valueMas[i].innerText);

        if (fields.has(typeText)) {
          const oldValue = fields.get(typeText);
          const newValue = oldValue + value;
          fields.set(typeText, newValue);
        } else {
          fields.set(typeText, value);
        }
      }
    }
    return fields;
  }

  _init() {
    this._declensions = [];
    this._setDomElem();
    this._setActions();
    this._setActionSelect();
  }

  _getElements(str, domBase) {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    const doms = [...dom.querySelectorAll(selector)];
    return doms;
  }

  _getElement(str, domBase) {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    return dom.querySelector(selector);
  }

  _setDomElem() {
    this._applyClass = this._getElement('__button-apply');
    this._clearBut = this._getElement('__button-clear');
    this._items = this._getElements('__select-item');

    this._valueMas = [];

    this._items.forEach((item) => {
      this.getCheckVal(item);
      const dom = this._getElement('__value', item);
      if (this._valueMas) { this._valueMas.push(dom); }
      this._readingAttributes(item);
    });

    this._inputEl = this._getElement('__input');

    this.defaultText = this._inputEl.placeholder;
    this._selectEl = this._getElement('__select');
    this._tipImg = this._getElement('__tip');
  }

  _readingAttributes(elem) {
    if (elem) {
      const type = elem.getAttribute('data-type') ?? '';
      this._declensions.push(type.split(','));
    }
  }

  _handleInputMouseup() {
    this._toggle();
    this._flClick = false;
  }

  _handleInputMousedown() {
    this._flClick = true;
  }

  _handleInputFocus() {
    if (!this._flClick) { this._toggle(); }
  }

  _handleInputKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle(true);
    } else if (event.key === ' ') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleTipClick() {
    this._toggle();
  }

  _handleSelectKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle(true);
    }
  }

  _handleApplyClick(event) {
    event.preventDefault();

    if (this._inputEl instanceof HTMLInputElement) {
      const defaultText = this._inputEl.value === this.defaultText;
      const inputClear = defaultText || !this._inputEl.value;

      if (inputClear) {
        // eslint-disable-next-line no-alert
        alert('Выберите количество гостей.');
      } else {
        this._toggle();
      }
    }
  }

  _handleClearClick(event) {
    event.preventDefault();
    this.resetValue();
  }

  _handleDocumentEvent(event) {
    const { target } = event;
    const domElement = target.closest(this.className);
    if (domElement !== this.elem) { this._toggle(true); }
  }

  _setActions() {
    if (!this._inputEl || !this._tipImg) return false;

    this._inputEl.addEventListener('mouseup', this._handleInputMouseup);
    this._inputEl.addEventListener('mousedown', this._handleInputMousedown);
    this._inputEl.addEventListener('focus', this._handleInputFocus);
    this._inputEl.addEventListener('keydown', this._handleInputKeydown);
    this._tipImg.addEventListener('click', this._handleTipClick);

    if (this._selectEl) {
      this._selectEl.addEventListener('keydown', this._handleSelectKeydown);
    }

    if (this._applyClass) {
      this._applyClass.addEventListener('click', this._handleApplyClick);
    }

    if (this._clearBut) {
      this._clearBut.addEventListener('click', this._handleClearClick);
    }

    const eventDoc = (event) => {
      document.addEventListener(event, this._handleDocumentEvent);
    };

    eventDoc('click');
    eventDoc('focusin');

    return true;
  }

  static _getVisible(elem) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  _toggle(flag = false) {
    if (!this._selectEl) return;
    const UlVisible = DropDown._getVisible(this._selectEl);
    const flagVis = !UlVisible && !flag;
    this._toggleModify(this.elem, '_visible', flagVis);
  }

  _toggleModify(elem, modify, flag = false) {
    const clearName = this.className.replace(/^\.js-/, '') + modify;
    const objClass = elem.classList;

    if (flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  _handleItemClick(event) {
    event.preventDefault();

    const { target } = event;
    const liEl = event.currentTarget;

    const valueEl = this._getElement('__value', liEl);
    const minusEl = target.closest(`${this.className}__minus`);
    const plusEl = target.closest(`${this.className}__plus`);

    let number = Number(valueEl.innerText);
    if (minusEl && number) {
      number -= 1;
    } else if (plusEl && !this._disPlus) {
      number += 1;
    }

    valueEl.innerText = String(number);
    this.getCheckVal(liEl);
    this._setInput();
  }

  _setActionSelect() {
    if (Array.isArray(this._items)) {
      this._items.forEach((item) => {
        item.addEventListener('click', this._handleItemClick);
      });
    }
  }

  _setInput() {
    let text = '';
    const mergeText = (
      num,
      strMas,
      flag = false,
    ) => {
      const number = Number(num);
      if (!number) return;

      if (!flag) {
        text += `${number} ${DropDown.declOfNum(number, strMas)}`;
      } else {
        const comma = text ? ', ' : '';
        text += `${comma + number} ${DropDown.declOfNum(number, strMas)}`;
      }
    };

    let lock = false;

    this.getMapValue().forEach((value, key) => {
      mergeText(value, key.split(','), Boolean(lock));
      lock = true;
    });

    const setData = (
      visibility,
      value,
      placeholder,
    ) => {
      if (this._clearBut) {
        this._toggleModify(
          this._clearBut,
          '__button-clear_visible',
          visibility,
        );
      }

      if (this._inputEl instanceof HTMLInputElement) {
        this._inputEl.value = value;
        this._inputEl.placeholder = placeholder;
      }
    };

    if (text) {
      setData(true, text, text);
    } else {
      setData(false, '', this.defaultText);
    }
  }
}

//= =========================================================================

function renderDropDown(className) {
  const components = document.querySelectorAll(className);
  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new DropDown(className, elem));
  });
  return objMas;
}

renderDropDown('.js-drop-down');
