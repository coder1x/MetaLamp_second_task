import autoBind from 'auto-bind';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

import './datepicker.scss';
import './date-dropdown.scss';

const imgPrev = require(
  // eslint-disable-next-line import/no-unresolved
  '@com/date-dropdown/img/arrow-back.svg',
).default;
const imgNext = require(
  // eslint-disable-next-line import/no-unresolved
  '@com/date-dropdown/img/arrow-forward.svg',
).default;

class DateDropDown {
  constructor(className, elem) {
    autoBind(this);
    this.flClick = false;
    this.defaultText = 'ДД.ММ.ГГГГ';
    this._setDomElem(className, elem);
    this.init();
  }

  init() {
    this._masMonth = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    this._createCalendar();
    this._setActions();

    if (!this.flRange) { this.setRange(); }
  }

  static getDate(date, flag = false) {
    const masDate = date.split('.');
    const dateText = `${masDate[1]}/${masDate[0]}/${masDate[2]}`;
    return !flag ? new Date(dateText) : dateText;
  }

  static trimDate(dateText) {
    return dateText.trim().split(' ')[0];
  }

  setRange() {
    this._flag = true;

    if (this.flRange) {
      const date1 = this.input1.value;
      const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      if (!regexp.test(date1)) return false;

      const date2 = this.input2.value;
      this.calendarObj.clear();

      this.calendarObj.selectDate(
        date2 === '' ? DateDropDown.getDate(date1)
          : [DateDropDown.getDate(date1), DateDropDown.getDate(date2)],
      );
    } else {
      this.calendarObj.clear();
      const masDate = this.inputHidden.value.split('-');

      if (masDate.length < 2) return false;

      const dateOne = DateDropDown.getDate(
        DateDropDown.trimDate(masDate[0]),
        true,
      );
      let dateTwo = DateDropDown.getDate(
        DateDropDown.trimDate(masDate[1]),
        true,
      );

      const minOne = Date.parse(dateOne) / 1000 / 60;
      const minTwo = Date.parse(dateTwo) / 1000 / 60;

      if (minOne > minTwo) {
        const dateForm = dateTwo.split('.');
        dateTwo = `${dateForm[0]}/${dateForm[1]}/${Number(dateForm[2]) + 1}`;
      }

      this._flInFilter = true;
      this.calendarObj.selectDate([
        new Date(dateOne),
        new Date(dateTwo),
      ]);
      this._flInFilter = false;
    }

    return true;
  }

  static getVisible(elem) {
    return window.getComputedStyle(elem, null)
      .getPropertyValue('display') !== 'none';
  }

  toggleCal(flag = false) {
    const nameModify = `${this.className.replace(/^\.js-/, '')}_visible`;
    const visible = DateDropDown.getVisible(this.calendarWrap);
    const { classList } = this.elem;
    if (this._flTog === flag && visible) {
      classList.remove(nameModify);

      if (!this.flRange) {
        this.input1.value = '';
      }
    } else {
      classList.add(nameModify);
    }
    this._flTog = flag;
  }

  elementIsClicked(event) {
    const inStock = Boolean(
      [
        this.input1,
        this.imgLeft,
        this.imgRight,
        this.input2,
      ].find((item) => item === event.target) ?? this._clickElemFl,
    );
    this._clickElemFl = false;
    const visible = DateDropDown.getVisible(this.calendarWrap);

    if (!inStock && visible) {
      this.toggleCal(this._flTog);
    }
  }

  handleFilterFocus(event) {
    const elem = event.currentTarget;
    elem.value = this.inputHidden.value.replace('-', ' - ');
  }

  handleFilterFocusout(event) {
    const elem = event.currentTarget;
    if (!this.flClick) { elem.value = ''; }
    this.flClick = false;
  }

  handleFilterChange(event) {
    const elem = event.currentTarget;
    this.inputHidden.value = elem.value;
    this._validationRange(true);
    this.setRange();
  }

  static handleFilterInput(event) {
    const elem = event.currentTarget;
    elem.value = elem.value.replace(/[^.-\d\s]/g, '');
  }

  handleCalendarWrapClick() {
    this._clickElemFl = true;
  }

  handleKeydownX(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.elem.classList.remove(`${this.className.replace(/^\.js-/, '')}_visible`);
    }
  }

  handleInput1(event) {
    const elem = event.currentTarget;
    if (elem.value.length === 10) { this.setRange(); }
  }

  handleInput2(event) {
    const elem = event.currentTarget;
    if (elem.value.length === 10) { this.setRange(); }
  }

  handleClearButton(event) {
    event.preventDefault();
    this.calendarObj.clear();
    if (!this.imgRight) {
      this.input1.value = '';
      this.input1.placeholder = '';
    }

    if (!this.flRange) {
      this.inputHidden.value = '';
    }

    this._visibleClear();
  }

  handleAcceptButton(event) {
    event.preventDefault();
    this._validationRange();
  }

  handleInput1Click() {
    this.flClick = true;
    this.toggleCal(true);
  }

  handleInput2Click() {
    this.flClick = true;
    this.toggleCal(false);
  }

  _setDomElem(className, elem) {
    this._classClear = `${className}__clear`;

    const getElem = (name) => elem.querySelector(`${className}__${name}`);

    this.className = className;
    this.elem = elem;
    this.calendar = getElem('datepicker');
    this.calendarWrap = getElem('datepicker-wrap');
    this.inputHidden = getElem('input-hidden');
    this.inputs = elem.querySelectorAll(`${className}__input`);
    this.flRange = this.inputs.length > 1;

    [this.input1] = this.inputs;
    this.imgLeft = this.input1.nextSibling;

    this.clearButton = getElem('clear');
    this.acceptButton = getElem('apply');

    if (this.flRange) {
      [, this.input2] = this.inputs;
      this.imgRight = this.input2.nextSibling;

      this.input1.placeholder = this.defaultText;
      this.input2.placeholder = this.defaultText;
    }
  }

  _getDateFilter(dateFilter) {
    if (!dateFilter) return '';

    const masDate = dateFilter.split('.');
    return `${masDate[0]} ${this._masMonth[Number(masDate[1]) - 1]}`;
  }

  _inputDate(date) {
    if (!date) {
      this.input1.value = '';
      if (this.flRange) { this.input2.value = ''; }
      return false;
    }

    const masDate = date.formattedDate;

    if (masDate.length === 2) {
      if (this.flRange) {
        [this.input1.value] = masDate;
        [, this.input2.value] = masDate;
      } else {
        const date1 = this._getDateFilter(masDate[0]);
        const date2 = this._getDateFilter(masDate[1]);

        this.input1.placeholder = `${date1} - ${date2}`;
        this.inputHidden.value = `${masDate[0]}-${masDate[1]}`;

        if (DateDropDown.getVisible(this.calendarWrap)) {
          this.input1.value = `${masDate[0]} - ${masDate[1]}`;
        }
      }
    }
    return true;
  }

  _visibleClear(flag = false) {
    const nameSelector = `${this._classClear.replace(/^\.js-/, '')}_visible`;
    const { classList } = this.clearButton;
    if (flag) {
      classList.add(nameSelector);
    } else {
      classList.remove(nameSelector);
    }
  }

  _createCalendar() {
    this.calendarObj = new AirDatepicker(this.calendar, {
      range: true,
      multipleDates: true,
      disableNavWhenOutOfRange: false,
      minDate: new Date(),
      prevHtml: `<img src="${imgPrev}">`,
      nextHtml: `<img src="${imgNext}">`,
      navTitles: {
        days: 'MMMM yyyy',
      },
      onSelect: (formattedDate) => {
        this._inputDate(formattedDate);
        if (!this._flInFilter) { this._flag = false; }
        this._visibleClear(true);
      },
    });
  }

  _validationRange(flShow = false) {
    function trimDate(dateText) {
      return dateText.trim().split(' ')[0];
    }

    const validCheck = (flag) => {
      if (flag) {
        if (!flShow) { this.toggleCal(this._flTog); }
      } else {
        // eslint-disable-next-line no-alert
        alert('Выберите диапазон');
      }
    };

    if (this.flRange) {
      validCheck(Boolean(
        this.input1.value
        && this.input2.value,
      ));
    } else {
      let oneMeaning = true;
      const masDate = this.inputHidden.value.split('-');
      const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      for (let i = 0; i < masDate.length; i += 1) {
        if (!regexp.test(trimDate(masDate[i]))) {
          oneMeaning = false;
          break;
        }
      }

      validCheck(oneMeaning);
    }
  }

  _setActionsFilter() {
    this.input1.addEventListener('focus', this.handleFilterFocus);
    this.input1.addEventListener('focusout', this.handleFilterFocusout);
    this.input1.addEventListener('change', this.handleFilterChange);
    this.input1.addEventListener('input', DateDropDown.handleFilterInput);
  }

  _setActions() {
    this.calendarWrap.addEventListener('click', this.handleCalendarWrapClick);
    this.input1.addEventListener('click', this.handleInput1Click);
    this.input1.addEventListener('keydown', this.handleKeydownX);

    if (this.flRange) {
      this.input1.addEventListener('input', this.handleInput1);
      this.input2.addEventListener('keydown', this.handleKeydownX);
      this.input2.addEventListener('input', this.handleInput2);
      this.input2.addEventListener('click', this.handleInput2Click);
    } else {
      this._setActionsFilter();
    }

    this.clearButton.addEventListener('click', this.handleClearButton);
    this.acceptButton.addEventListener('click', this.handleAcceptButton);
    document.addEventListener('click', this.elementIsClicked);
  }
}

export default DateDropDown;
