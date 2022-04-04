import autoBind from 'auto-bind';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

import './datepicker.scss';
import './date-dropdown.scss';

const imgPrev = require(
  // eslint-disable-next-line import/no-unresolved
  '@com/date-dropdown/img/arrow_back.svg',
).default;
const imgNext = require(
  // eslint-disable-next-line import/no-unresolved
  '@com/date-dropdown/img/arrow_forward.svg',
).default;

class DateDropDown {
  #clickElemFl = false;

  #classClear = '';

  #flag = false;

  #flTog = false;

  #flInFilter = false;

  #masMonth = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  constructor(className, elem) {
    autoBind(this);
    this.flClick = false;
    this.defaultText = 'ДД.ММ.ГГГГ';
    this.#setDomElem(className, elem);
    this.init();
  }

  init() {
    this.#createCalendar();
    this.#setActions();

    if (!this.flRange) { this.setRange(); }
  }

  setRange() {
    this.#flag = true;

    function getDate(date, flag = false) {
      const masDate = date.split('.');
      const dateText = `${masDate[1]}/${masDate[0]}/${masDate[2]}`;
      return !flag ? new Date(dateText) : dateText;
    }

    function trimDate(dateText) {
      return dateText.trim().split(' ')[0];
    }

    if (this.flRange) {
      const date1 = this.input1.value;
      const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      if (!regexp.test(date1)) return false;

      const date2 = this.input2.value;
      this.calendarObj.clear();

      const date = date2 === '' ? getDate(date1)
        : [getDate(date1), getDate(date2)];

      this.calendarObj.selectDate(date);
    } else {
      const dateInput = this.inputHidden.value;
      this.calendarObj.clear();
      const masDate = dateInput.split('-');

      if (masDate.length < 2) return false;

      const leftValue = trimDate(masDate[0]);
      const rightValue = trimDate(masDate[1]);

      const dateOne = getDate(leftValue, true);
      let dateTwo = getDate(rightValue, true);

      const minOne = Date.parse(dateOne) / 1000 / 60;
      const minTwo = Date.parse(dateTwo) / 1000 / 60;

      if (minOne > minTwo) {
        const dateForm = dateTwo.split('.');
        const number = Number(dateForm[2]) + 1;
        dateTwo = `${dateForm[0]}/${dateForm[1]}/${number}`;
      }

      this.#flInFilter = true;
      this.calendarObj.selectDate([
        new Date(dateOne),
        new Date(dateTwo),
      ]);
      this.#flInFilter = false;
    }

    return true;
  }

  static getVisible(elem) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  toggleCal(flag = false) {
    const nameModify = `${this.className.replace(/^\.js-/, '')}_visible`;
    const visible = DateDropDown.getVisible(this.calendarWrap);
    const objElem = this.elem.classList;
    if (this.#flTog === flag && visible) {
      objElem.remove(nameModify);

      if (!this.flRange) {
        this.input1.value = '';
      }
    } else {
      objElem.add(nameModify);
    }
    this.#flTog = flag;
  }

  elementIsClicked(event) {
    const inStock = Boolean(
      [
        this.input1,
        this.imgLeft,
        this.imgRight,
        this.input2,
      ].find((item) => item === event.target) ?? this.#clickElemFl,
    );
    this.#clickElemFl = false;
    const visible = DateDropDown.getVisible(this.calendarWrap);

    if (!inStock && visible) {
      this.toggleCal(this.#flTog);
    }
  }

  handleFilterFocus(event) {
    const elem = event.currentTarget;
    const value = this.inputHidden.value.replace('-', ' - ');
    elem.value = value;
  }

  handleFilterFocusout(event) {
    const elem = event.currentTarget;
    if (!this.flClick) { elem.value = ''; }
    this.flClick = false;
  }

  handleFilterChange(event) {
    const elem = event.currentTarget;
    this.inputHidden.value = elem.value;
    this.#validationRange(true);
    this.setRange();
  }

  static handleFilterInput(event) {
    const elem = event.currentTarget;
    const value = elem.value.replace(/[^.-\d\s]/g, '');
    elem.value = value;
  }

  handleCalendarWrapClick() {
    this.#clickElemFl = true;
  }

  handleKeydownX(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      const nameModify = `${this.className.replace(/^\.js-/, '')}_visible`;
      this.elem.classList.remove(nameModify);
    }
  }

  handleInput1(event) {
    const elem = event.currentTarget;
    const validVal = elem.value.length === 10;
    if (validVal) { this.setRange(); }
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

    this.#visibleClear();
  }

  handleAcceptButton(event) {
    event.preventDefault();
    this.#validationRange();
  }

  handleInput1Click() {
    this.flClick = true;
    this.toggleCal(true);
  }

  handleInput2Click() {
    this.flClick = true;
    this.toggleCal(false);
  }

  #setDomElem(className, elem) {
    this.#classClear = `${className}__clear`;

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

  #inputDate(date) {
    if (!date) {
      this.input1.value = '';
      if (this.flRange) { this.input2.value = ''; }
      return false;
    }

    const getDateFilter = (dateFilter) => {
      if (!dateFilter) return '';

      const masDate = dateFilter.split('.');
      const month = Number(masDate[1]);
      return `${masDate[0]} ${this.#masMonth[month - 1]}`;
    };

    const masDate = date.formattedDate;

    if (masDate.length === 2) {
      if (this.flRange) {
        [this.input1.value] = masDate;
        [, this.input2.value] = masDate;
      } else {
        const date1 = getDateFilter(masDate[0]);
        const date2 = getDateFilter(masDate[1]);

        this.input1.placeholder = `${date1} - ${date2}`;
        this.inputHidden.value = `${masDate[0]}-${masDate[1]}`;

        if (DateDropDown.getVisible(this.calendarWrap)) {
          this.input1.value = `${masDate[0]} - ${masDate[1]}`;
        }
      }
    }
    return true;
  }

  #visibleClear(flag = false) {
    const nameSelector = `${this.#classClear.replace(/^\.js-/, '')}_visible`;
    const objClear = this.clearButton.classList;
    if (flag) {
      objClear.add(nameSelector);
    } else {
      objClear.remove(nameSelector);
    }
  }

  #createCalendar() {
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
        this.#inputDate(formattedDate);
        if (!this.#flInFilter) { this.#flag = false; }
        this.#visibleClear(true);
      },
    });
  }

  #validationRange(flShow = false) {
    function trimDate(dateText) {
      return dateText.trim().split(' ')[0];
    }

    const validCheck = (flag) => {
      if (flag) {
        if (!flShow) { this.toggleCal(this.#flTog); }
      } else {
        // eslint-disable-next-line no-alert
        alert('Выберите диапазон');
      }
    };

    if (this.flRange) {
      let twoMeanings = false;
      twoMeanings = Boolean(
        this.input1.value
        && this.input2.value,
      );

      validCheck(twoMeanings);
    } else {
      let oneMeaning = true;
      const date = this.inputHidden.value;
      const masDate = date.split('-');
      const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      for (let i = 0; i < masDate.length; i += 1) {
        const value = trimDate(masDate[i]);
        if (!regexp.test(value)) {
          oneMeaning = false;
          break;
        }
      }

      validCheck(oneMeaning);
    }
  }

  #setActionsFilter() {
    this.input1.addEventListener('focus', this.handleFilterFocus);
    this.input1.addEventListener('focusout', this.handleFilterFocusout);
    this.input1.addEventListener('change', this.handleFilterChange);
    this.input1.addEventListener('input', DateDropDown.handleFilterInput);
  }

  #setActions() {
    this.calendarWrap.addEventListener('click', this.handleCalendarWrapClick);
    this.input1.addEventListener('click', this.handleInput1Click);
    this.input1.addEventListener('keydown', this.handleKeydownX);

    if (this.flRange) {
      this.input1.addEventListener('input', this.handleInput1);
      this.input2.addEventListener('keydown', this.handleKeydownX);
      this.input2.addEventListener('input', this.handleInput2);
      this.input2.addEventListener('click', this.handleInput2Click);
    } else {
      this.#setActionsFilter();
    }

    this.clearButton.addEventListener('click', this.handleClearButton);
    this.acceptButton.addEventListener('click', this.handleAcceptButton);
    document.addEventListener('click', this.elementIsClicked);
  }
}

//= =============================================================================

function renderComponent(className) {
  const components = document.querySelectorAll(className);
  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new DateDropDown(className, elem));
  });
  return objMas;
}

renderComponent('.js-date-dropdown');
