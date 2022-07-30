import autoBind from 'auto-bind';

import DateDropDown from '@com/date-dropdown/DateDropDown.js';
import DropDown from '@com/dropdown/DropDown.js';
import message from '@com/message/message';

class SearchRoom {
  constructor(element) {
    autoBind(this);
    this.className = '.js-search-room';
    this.element = element;

    this._init();
  }

  _init() {
    const dateDropdownElement = this.element.querySelector(`${this.className}__date-wrapper`);
    const dropdownElement = this.element.querySelector(`${this.className}__dropdown-wrapper`);
    this._buttonElement = this.element.querySelector(`${this.className}__button-wrapper`);

    this._dropdown = new DropDown(
      dropdownElement.firstElementChild,
    );

    this._dateDropdown = new DateDropDown(
      dateDropdownElement.firstElementChild,
    );

    this._bindEvent();
  }

  _handleButtonClick(event) {
    console.log(this._dropdown.validateData());

    if (!this._dateDropdown.validateRange()) {
      message('Выберите дату.');
      event.preventDefault();
      return false;
    }

    if (!this._dropdown.validateData()) {
      message('Сколько гостей ?');
      event.preventDefault();
      return false;
    }

    return true;
  }

  _bindEvent() {
    this._buttonElement.addEventListener('click', this._handleButtonClick);
  }
}

export default SearchRoom;
