import autoBind from 'auto-bind';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

import message from '@shared/helpers/message/message';
import MaskedTextField from '@shared/helpers/maskedTextField/maskedTextField';

class DateDropDown {
  constructor(className, element) {
    autoBind(this);
    this.isClicked = false;
    this.defaultText = 'ДД.ММ.ГГГГ';
    this._setElement(className, element);
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

  toggleVisibility(isVisible = false) {
    const modifier = `${this.className.replace(/^\.js-/, '')}_visible`;
    const visible = DateDropDown.getVisible(this.calendarWrapper);
    const { classList } = this.element;

    const isVisibleCalendar = this._isToggle === isVisible;

    if (isVisibleCalendar && visible) {
      classList.remove(modifier);

      if (!this.isRange) {
        this.inputFrom.value = '';
      }
    } else {
      classList.add(modifier);
    }
    this._isToggle = isVisible;
  }

  handleDocumentClick(event) {
    const isClicked = Boolean(
      [
        this.inputFrom,
        this.imageLeft,
        this.imageRight,
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
    this._validateRange(true);
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
    if (!this.imageRight) {
      this.inputFrom.value = '';
      this.inputFrom.placeholder = '';
    }

    if (!this.isRange) {
      this.inputHidden.value = '';
    }

    this._toggleClearButton();
  }

  handleAcceptButtonClick(event) {
    event.preventDefault();
    this._validateRange();
  }

  handleInputFromClick() {
    this.isClicked = true;
    this.toggleVisibility(true);
  }

  handleInputToClick() {
    this.isClicked = true;
    this.toggleVisibility(false);
  }

  _setElement(className, element) {
    this._selectorClear = `${className}__clear`;

    const getElement = (name) => element.querySelector(`${className}__${name}`);

    this.className = className;
    this.element = element;
    this.calendar = getElement('datepicker');
    this.calendarWrapper = getElement('datepicker-wrapper');
    this.inputHidden = getElement('input-hidden');
    this.inputs = element.querySelectorAll(`${className}__input`);
    this.isRange = this.inputs.length > 1;

    [this.inputFrom] = this.inputs;
    this.imageLeft = this.inputFrom.nextSibling;

    this.clearButton = getElement('clear');
    this.acceptButton = getElement('apply');

    if (this.isRange) {
      [, this.inputTo] = this.inputs;
      this.imageRight = this.inputTo.nextSibling;

      this.inputFrom.placeholder = this.defaultText;
      this.inputTo.placeholder = this.defaultText;

      new MaskedTextField({
        element: this.inputFrom,
      });
      new MaskedTextField({
        element: this.inputTo,
      });
    }
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
    const selector = `${this._selectorClear.replace(/^\.js-/, '')}_visible`;
    const { classList } = this.clearButton;
    if (isVisible) {
      classList.add(selector);
    } else {
      classList.remove(selector);
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

  _validateRange(isShown = false) {
    if (this.isRange) {
      this._checkValidity(Boolean(this.inputFrom.value && this.inputTo.value), isShown);
    } else {
      let isValidDate = true;
      const dates = this.inputHidden.value.split('-');
      const REGEXP = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      for (let i = 0; i < dates.length; i += 1) {
        if (!REGEXP.test(this._trimDate(dates[i]))) {
          isValidDate = false;
          break;
        }
      }

      this._checkValidity(isValidDate, isShown);
    }
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
