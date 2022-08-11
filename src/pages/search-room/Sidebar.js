import autoBind from 'auto-bind';

import DateDropDown from '@com/date-dropdown/DateDropDown.js';
import DropDown from '@com/dropdown/DropDown.js';

class Sidebar {
  constructor(options) {
    autoBind(this);
    this.className = '.js-search-room-filter';
    this.blockClass = options.block;
    this.buttonClass = options.button;
    this._init();
  }

  _init() {
    this._isClicked = false;
    if (this._setDomElement()) {
      this._bindEvent();
    }
  }

  _setDomElement() {
    const element = document.querySelector(this.className);

    if (!element) {
      return false;
    }

    const dateDropdownElement = element.querySelector(`${this.className}__date-wrapper`);
    const guestsElement = element.querySelector(`${this.className}__guests-wrapper`);
    const facilitiesElement = element.querySelector(`${this.className}__facilities-wrapper`);

    this._dropdown = new DropDown(
      guestsElement.firstElementChild,
    );

    this._dropdown = new DropDown(
      facilitiesElement.firstElementChild,
    );

    this._dateDropdown = new DateDropDown(
      dateDropdownElement.firstElementChild,
    );

    this.button = document.querySelector(this.buttonClass);
    this.block = document.querySelector(this.blockClass);
    this.classNameWithModifier = `${this.blockClass.replace(/^\.js-/, '')}_visible`;

    return true;
  }

  _getVisibility() {
    if (!this.block) {
      return false;
    }

    return window.getComputedStyle(this.block, null)
      .getPropertyValue('display') !== 'none';
  }

  _toggle(isVisible = this._getVisibility()) {
    if (!this.block) {
      return false;
    }

    const { classList } = this.block;

    if (!isVisible) {
      classList.add(this.classNameWithModifier);
      const element = this.block.querySelector('input');
      if (element) {
        element.focus();
      }
    } else {
      classList.remove(this.classNameWithModifier);
    }
    return true;
  }

  _handleButtonWrapperClick(event) {
    this._isClicked = true;
    this._toggle();

    const domElement = event.currentTarget;
    let expanded = domElement.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    domElement.setAttribute('aria-expanded', expanded);
  }

  _handleSearchRoomFilterClick() {
    this._isClicked = true;
  }

  _handleSearchRoomFilterKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleDocumentFocusin(event) {
    const { target } = event;
    const linkElement = target.closest(this.blockClass);
    const isVisible = this._getVisibility() && this.button;
    const isFocusDocument = (!linkElement && isVisible);

    if (!isFocusDocument) {
      return false;
    }

    const element = this.button.querySelector('button');
    const path = (event.composedPath && event.composedPath());

    if (!path.includes(element, 0)) {
      this._toggle();
      element.focus();
    }
    return false;
  }

  _handleDocumentClick() {
    if (this._getVisibility() && !this._isClicked) {
      this._toggle(true);
    }
    this._isClicked = false;
  }

  _bindEvent() {
    if (!this.block || !this.button) {
      return false;
    }

    this.button.addEventListener('click', this._handleButtonWrapperClick);
    this.block.addEventListener('click', this._handleSearchRoomFilterClick);
    this.block.addEventListener('keydown', this._handleSearchRoomFilterKeyDown);
    document.addEventListener('focusin', this._handleDocumentFocusin);
    document.addEventListener('click', this._handleDocumentClick);

    return true;
  }
}

export default Sidebar;
