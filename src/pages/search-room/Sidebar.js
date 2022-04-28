import autoBind from 'auto-bind';

class Sidebar {
  constructor(options) {
    autoBind(this);
    this.blockClass = options.block;
    this.buttonClass = options.button;
    this._isClicked = false;
    this._setDomElement();
    this._bindEvent();
  }

  _setDomElement() {
    this.button = document.querySelector(this.buttonClass);
    this.block = document.querySelector(this.blockClass);
    this.classVisible = `${this.blockClass.replace(/^\./, '')}_visible`;
  }

  _getVisibility() {
    if (!this.block) return false;

    return window.getComputedStyle(this.block, null)
      .getPropertyValue('display') !== 'none';
  }

  _toggle(isVisible = this._getVisibility()) {
    if (!this.block) return false;

    const { classList } = this.block;

    if (!isVisible) {
      classList.add(this.classVisible);
      const element = this.block.querySelector('input');
      if (element) { element.focus(); }
    } else {
      classList.remove(this.classVisible);
    }
    return true;
  }

  _handleButtonClick(event) {
    this._isClicked = true;
    this._toggle();

    const domElement = event.currentTarget;
    let expanded = domElement.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    domElement.setAttribute('aria-expanded', expanded);
  }

  _handleBlockClick() {
    this._isClicked = true;
  }

  _handleBlockKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._toggle();
    }
  }

  _handleDocumentFocusin(event) {
    const { target } = event;
    const linkElement = target.closest(this.blockClass);

    if (!linkElement && this._getVisibility() && this.button) {
      const element = this.button.querySelector('button');
      const path = (event.composedPath && event.composedPath());

      if (!path.includes(element, 0)) {
        this._toggle();
        element.focus();
      }
    }
  }

  _handleDocumentClick() {
    if (this._getVisibility() && !this._isClicked) { this._toggle(true); }
    this._isClicked = false;
  }

  _bindEvent() {
    if (!this.block || !this.button) return false;

    this.button.addEventListener('click', this._handleButtonClick);
    this.block.addEventListener('click', this._handleBlockClick);
    this.block.addEventListener('keydown', this._handleBlockKeydown);
    document.addEventListener('focusin', this._handleDocumentFocusin);
    document.addEventListener('click', this._handleDocumentClick);

    return true;
  }
}

export default Sidebar;
