import autoBind from 'auto-bind';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

import message from '@com/message/message';

import TextField from '@com/text-field/TextField';

class DateDropDown {
  constructor(element) {
    autoBind(this);
    this.isClicked = false;
    this.defaultText = 'ДД.ММ.ГГГГ';
    this.className = '.js-date-dropdown';
    this.element = element;
    this._setElement();
    this.init();
  }

  init() {
    this._months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    this._createCalendar();
    this._bindEvent();

    if (!this.isRange) {
      this.setRange();
    }
  }

  static getDate(date, flag = false) {
    const dates = date.split('.');
    const dateText = `${dates[1]}/${dates[0]}/${dates[2]}`;
    return !flag ? new Date(dateText) : dateText;
  }

  static trimDate(dateText) {
    return dateText.trim().split(' ')[0];
  }

  setRange() {
    if (this.isRange) {
      const dateFrom = this.inputFrom.value;
      const REGEXP = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      if (!REGEXP.test(dateFrom)) {
        return false;
      }

      const dateTo = this.inputTo.value;
      this.calendar.clear();

      this.calendar.selectDate(
        dateTo === '' ? DateDropDown.getDate(dateFrom)
          : [DateDropDown.getDate(dateFrom), DateDropDown.getDate(dateTo)],
      );
    } else {
      this.calendar.clear();
      const dates = this.inputHidden.value.split('-');

      const NUMBER_OF_DATES = 2;
      if (dates.length < NUMBER_OF_DATES) {
        return false;
      }

      const dateFrom = DateDropDown.getDate(
        DateDropDown.trimDate(dates[0]),
        true,
      );
      let dateTo = DateDropDown.getDate(
        DateDropDown.trimDate(dates[1]),
        true,
      );

      const MILLISECONDS = 1000;
      const SECONDS = 60;
      const timestampFrom = Date.parse(dateFrom) / MILLISECONDS / SECONDS;
      const timestampTo = Date.parse(dateTo) / MILLISECONDS / SECONDS;

      if (timestampFrom > timestampTo) {
        const datesString = dateTo.split('.');
        dateTo = `${datesString[0]}/${datesString[1]}/${Number(datesString[2]) + 1}`;
      }

      this.calendar.selectDate([
        new Date(dateFrom),
        new Date(dateTo),
      ]);
    }

    return true;
  }

  static getVisible(element) {
    return window.getComputedStyle(element, null)
      .getPropertyValue('display') !== 'none';
  }

  validateRange() {
    let isValidDate = true;
    if (this.isRange) {
      isValidDate = Boolean(this.inputFrom.value && this.inputTo.value);
    } else {
      const dates = this.inputHidden.value.split('-');
      const REGEXP = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      for (let i = 0; i < dates.length; i += 1) {
        if (!REGEXP.test(DateDropDown._trimDate(dates[i]))) {
          isValidDate = false;
          break;
        }
      }
    }
    return isValidDate;
  }

  toggleVisibility(isVisible = false) {
    const modifier = `${this.className.replace(/^\.js-/, '')}_visible`;
    const visible = DateDropDown.getVisible(this.calendarWrapper);
    const { classList } = this.element;

    const isVisibleCalendar = this._isToggle === isVisible;

    if (isVisibleCalendar && visible) {
      classList.remove(modifier);
      this._toggleTip();

      if (!this.isRange) {
        this.inputFrom.value = '';
      }
    } else {
      classList.add(modifier);
      this._toggleTip(true);
    }
    this._isToggle = isVisible;
  }

  handleDocumentClick(event) {
    const isClicked = Boolean(
      [
        this.inputFrom,
        this.inputTo,
      ].find((item) => item === event.target) ?? this._isElementClicked,
    );
    this._isElementClicked = false;
    const visible = DateDropDown.getVisible(this.calendarWrapper);

    if (!isClicked && visible) {
      this.toggleVisibility(this._isToggle);
    }
  }

  handleFilterFocus(event) {
    const element = event.currentTarget;
    element.value = this.inputHidden.value.replace('-', ' - ');
  }

  handleFilterFocusOut(event) {
    const element = event.currentTarget;
    if (!this.isClicked) {
      element.value = '';
    }
    this.isClicked = false;
  }

  handleFilterChange(event) {
    const element = event.currentTarget;
    this.inputHidden.value = element.value;
    this._checkValidity(this.validateRange(), true);
    this.setRange();
  }

  static handleFilterInput(event) {
    const element = event.currentTarget;
    element.value = element.value.replace(/[^.-\d\s]/g, '');
  }

  handleCalendarWrapperClick() {
    this._isElementClicked = true;
  }

  handleInputKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.element.classList.remove(`${this.className.replace(/^\.js-/, '')}_visible`);
      this._toggleTip();
    }
  }

  handleInputFromInput(event) {
    const element = event.currentTarget;
    const MAX_LENGTH_DATE = 10;
    if (element.value.length === MAX_LENGTH_DATE) {
      this.setRange();
    }
  }

  handleInputToInput(event) {
    const element = event.currentTarget;
    const MAX_LENGTH_DATE = 10;
    if (element.value.length === MAX_LENGTH_DATE) {
      this.setRange();
    }
  }

  handleClearButtonClick(event) {
    event.preventDefault();
    this.calendar.clear();

    this.inputFrom.value = '';
    this.inputFrom.placeholder = this.defaultText;

    if (!this.isRange) {
      this.inputHidden.value = '';
    } else {
      this.inputTo.value = '';
      this.inputTo.placeholder = this.defaultText;
    }

    this._toggleClearButton();
  }

  handleAcceptButtonClick(event) {
    event.preventDefault();
    this._checkValidity(this.validateRange(), false);
  }

  handleInputFromClick() {
    this.isClicked = true;
    this.toggleVisibility(true);
  }

  handleInputToClick() {
    this.isClicked = true;
    this.toggleVisibility(false);
  }

  _getElement(nameElement, parentElement) {
    return (parentElement ?? this.element).querySelector(`${this.className}__${nameElement}`);
  }

  _toggleTip(isTop = false) {
    this.TextFieldFrom.toggleTip(isTop);

    if (this.TextFieldTo) {
      this.TextFieldTo.toggleTip(isTop);
    }
  }

  _setElement() {
    this.calendar = this._getElement('datepicker');
    this.calendarWrapper = this._getElement('datepicker-wrapper');

    const textFields = this.element.querySelectorAll('.js-text-field');

    this.inputHidden = null;
    this.isRange = textFields.length > 1;

    this.TextFieldFrom = new TextField({
      element: textFields[0],
    });

    this.inputFrom = this.TextFieldFrom.inputElement;

    this.clearButton = this._getElement('clear');
    this.acceptButton = this._getElement('apply');

    this.inputFrom.placeholder = this.defaultText;

    if (!this.isRange) {
      return false;
    }
    const textField = new TextField({
      element: textFields[1],
    });

    if (textField.isVisible()) {
      this.TextFieldTo = textField;
      this.inputTo = this.TextFieldTo.inputElement;
      this.inputTo.placeholder = this.defaultText;

      this.TextFieldFrom.selectionChecks('date');
      this.TextFieldTo.selectionChecks('date');
    } else {
      this.inputHidden = textField.inputElement;
      this.isRange = false;
    }

    return true;
  }

  _getDateFilter(dateFilter) {
    if (!dateFilter) {
      return '';
    }

    const dates = dateFilter.split('.');
    return `${dates[0]} ${this._months[Number(dates[1]) - 1]}`;
  }

  _inputDate(date) {
    if (!date) {
      this.inputFrom.value = '';
      if (this.isRange) {
        this.inputTo.value = '';
      }
      return false;
    }

    const dates = date.formattedDate;

    if (dates.length !== 2) {
      return false;
    }

    if (this.isRange) {
      [this.inputFrom.value] = dates;
      [, this.inputTo.value] = dates;
    } else {
      const dateFrom = this._getDateFilter(dates[0]);
      const dateTo = this._getDateFilter(dates[1]);

      this.inputFrom.placeholder = `${dateFrom} - ${dateTo}`;
      this.inputHidden.value = `${dates[0]}-${dates[1]}`;

      if (DateDropDown.getVisible(this.calendarWrapper)) {
        this.inputFrom.value = `${dates[0]} - ${dates[1]}`;
      }
    }

    return true;
  }

  _toggleClearButton(isVisible = false) {
    const nameModifier = `${`${this.className}__clear`.replace(/^\.js-/, '')}_visible`;
    const { classList } = this.clearButton;
    if (isVisible) {
      classList.add(nameModifier);
    } else {
      classList.remove(nameModifier);
    }
  }

  _createCalendar() {
    this.calendar = new AirDatepicker(this.calendar, {
      range: true,
      multipleDates: true,
      disableNavWhenOutOfRange: false,
      minDate: new Date(),
      prevHtml: '<span class="date-dropdown__back">arrow_back</span>',
      nextHtml: '<span class="date-dropdown__forward">arrow_forward</span>',
      navTitles: {
        days: 'MMMM yyyy',
      },
      onSelect: (formattedDate) => {
        this._inputDate(formattedDate);
        this._toggleClearButton(true);
      },
    });
  }

  static _trimDate(dateText) {
    return dateText.trim().split(' ')[0];
  }

  _checkValidity(isValid, isShown) {
    if (!isValid) {
      message('Выберите диапазон');
      return false;
    }

    if (!isShown) {
      this.toggleVisibility(this._isToggle);
    }
    return true;
  }

  _bindEventFilter() {
    this.inputFrom.addEventListener('focus', this.handleFilterFocus);
    this.inputFrom.addEventListener('focusout', this.handleFilterFocusOut);
    this.inputFrom.addEventListener('change', this.handleFilterChange);
    this.inputFrom.addEventListener('input', DateDropDown.handleFilterInput);
  }

  _bindEvent() {
    this.calendarWrapper.addEventListener('click', this.handleCalendarWrapperClick);
    this.inputFrom.addEventListener('click', this.handleInputFromClick);
    this.inputFrom.addEventListener('keydown', this.handleInputKeyDown);

    if (this.isRange) {
      this.inputFrom.addEventListener('input', this.handleInputFromInput);
      this.inputTo.addEventListener('keydown', this.handleInputKeyDown);
      this.inputTo.addEventListener('input', this.handleInputToInput);
      this.inputTo.addEventListener('click', this.handleInputToClick);
    } else {
      this._bindEventFilter();
    }

    this.clearButton.addEventListener('click', this.handleClearButtonClick);
    this.acceptButton.addEventListener('click', this.handleAcceptButtonClick);
    document.addEventListener('click', this.handleDocumentClick);
  }
}

export default DateDropDown;
