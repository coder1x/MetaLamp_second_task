import './datepicker.scss';
import './date-dropdown.scss';
/*
Компонент dateDropDown использует плагин jQuery air-datepicker
который позволяет осуществлять ввод Даты через календарь, а так же
указывать диапазон Даты.
  Описание в readme.md
*/
// "10/26/2020" - формат даты.


class DateDropDown {

  #clickElemFl = false;
  #classClear = '';
  #flag = false;
  #flTog = false;
  #flInFilter = false;
  #masMonth = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  constructor(className, elem) {

    this.flClick = false;
    this.defaultText = 'ДД.ММ.ГГГГ';
    this.#setDomElem(className, elem);
    this.#createCalendar();
    this.#setActions();

    if (!this.flRange)
      this.setRange();
  }



  setRange() {
    this.#flag = true;

    function getDate(date, fl = false) {
      let mas = date.split('.');
      const dateText = mas[1] + '/' + mas[0] + '/' + mas[2];
      return !fl ? new Date(dateText) : dateText;
    }

    function trimDate(dateText) {
      return dateText.trim().split(' ')[0];
    }

    if (this.flRange) {
      const date1 = this.input1.value;
      const regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
      if (!regexp.test(date1)) return;
      let date2 = this.input2.value;
      this.$calendarObj.clear();
      if (date2 == '') {
        this.$calendarObj.selectDate(getDate(date1));
      } else {
        this.$calendarObj.selectDate([getDate(date1), getDate(date2)]);
      }
    } else {
      const date = this.inputHidden.value;
      this.$calendarObj.clear();
      let mas = date.split('-');

      if (mas.length < 2) return;
      const leftValue = trimDate(mas[0]);
      const rightValue = trimDate(mas[1]);

      let dateOne = getDate(leftValue, true);
      let dateTwo = getDate(rightValue, true);

      let minOne = Date.parse(dateOne) / 1000 / 60;
      let minTwo = Date.parse(dateTwo) / 1000 / 60;

      if (minOne > minTwo) {
        let mas = dateTwo.split('.');
        let num = Number(mas[2]) + 1;
        dateTwo = mas[0] + '/' + mas[1] + '/' + num;
      }

      this.#flInFilter = true;
      this.$calendarObj.selectDate([new Date(dateOne),
      new Date(dateTwo)]);
      this.#flInFilter = false;
    }
  }

  getVisible(elem) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }

  toggleCal(fl = false) {
    const nameModify = this.className.replace(/^\./, '') + '_visible';
    const visible = this.getVisible(this.calendarWrap);
    const objElem = this.elem.classList;
    if (this.#flTog == fl && visible) {
      objElem.remove(nameModify);

      if (!this.flRange) {
        this.input1.value = '';
      }
    }
    else {
      objElem.add(nameModify);
    }
    this.#flTog = fl;
  }

  #setDomElem(className, elem) {

    this.#classClear = className.replace(/^\./, '') + '__clear';

    const getElem = (name) => {
      return elem.querySelector(className + '__' + name);
    };

    this.className = className;
    this.elem = elem;
    this.calendar = getElem('datepicker');
    this.calendarWrap = getElem('datepicker-wrap');

    this.inputHidden = getElem('input-hidden');

    this.inputs = elem.querySelectorAll(className + '__input');
    this.flRange = this.inputs.length > 1 ? true : false;

    this.input1 = this.inputs[0];
    this.imgLeft = this.input1.nextSibling;

    this.clearButton = getElem('clear');
    this.acceptButton = getElem('apply');

    if (this.flRange) {
      this.input2 = this.inputs[1];
      this.imgRight = this.input2.nextSibling;

      this.input1.placeholder = this.defaultText;
      this.input2.placeholder = this.defaultText;
    }
  }


  #inputDate(date) {
    if (!date) {
      this.input1.value = '';
      if (this.flRange)
        this.input2.value = '';
      return;
    }

    const getDateFilter = (date) => {
      if (!date) return '';
      let mas = date.split('.');
      const month = Number(mas[1]);
      return mas[0] + ' ' + this.#masMonth[month - 1];
    };


    let masDate = date.split(',');

    if (masDate.length == 2) {
      if (this.flRange) {
        this.input1.value = masDate[0];
        this.input2.value = masDate[1];
      } else {
        this.input1.placeholder =
          getDateFilter(masDate[0]) +
          ' - ' +
          getDateFilter(masDate[1]);

        this.inputHidden.value = masDate[0] + '-' + masDate[1];

        if (this.getVisible(this.calendarWrap)) {
          this.input1.value = masDate[0] + ' - ' + masDate[1];
        }

      }
    }

  }

  #visibleClear(fl = false) {
    const nameSelector = this.#classClear + '_visible';
    const objClear = this.clearButton.classList;
    if (fl) {
      objClear.add(nameSelector);
    }
    else {
      objClear.remove(nameSelector);
    }
  }


  #createCalendar() {
    const imgPrev = require(
      '@com/date-dropdown/img/arrow_back.svg'
    ).default;
    const imgNext = require(
      '@com/date-dropdown/img/arrow_forward.svg'
    ).default;
    this.$calendarObj = $(this.calendar).datepicker({
      range: true,
      minDate: new Date(),
      prevHtml:
        '<img src="' + imgPrev + '">',
      nextHtml:
        '<img src="' + imgNext + '">',
      navTitles: {
        days: 'MM yyyy'
      },
      onSelect: (formattedDate) => {
        this.#inputDate(formattedDate);
        if (!this.#flInFilter)
          this.#flag = false;
        this.#visibleClear(true);
      }
    }).data('datepicker');

  }

  #validationRange(flShow = false) {

    function trimDate(dateText) {
      return dateText.trim().split(' ')[0];
    }

    const validСheck = (fl) => {
      if (fl) {
        if (!flShow)
          this.toggleCal(this.#flTog);
      }
      else {
        alert('Выберите диапазон');
      }
    };


    if (this.flRange) {
      let twoMeanings = false;
      twoMeanings = Boolean(
        this.input1.value &&
        this.input2.value
      );

      validСheck(twoMeanings);
    }
    else {
      let oneMeaning = true;
      const date = this.inputHidden.value;
      let mas = date.split('-');
      let regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;

      for (let i = 0; i < mas.length; i++) {
        const val = trimDate(mas[i]);
        if (!regexp.test(val)) {
          oneMeaning = false;
          break;
        }
      }

      validСheck(oneMeaning);
    }
  }

  #elementIsClicked(e) {

    let inStock = Boolean(
      [this.input1,
      this.imgLeft,
      this.imgRight,
      this.input2].find(item => item == e.target) ?? this.#clickElemFl);
    this.#clickElemFl = false;
    const visible = this.getVisible(this.calendarWrap);

    if (!inStock && visible) {
      this.toggleCal(this.#flTog);
    }
  }

  #setActionsFilter() {
    this.input1.addEventListener('focus', () => {
      const val = this.inputHidden.value.replace('-', ' - ');
      this.input1.value = val;
    });

    this.input1.addEventListener('focusout', () => {
      if (!this.flClick)
        this.input1.value = '';
      this.flClick = false;
    });

    this.input1.addEventListener('change', () => {
      this.inputHidden.value = this.input1.value;
      this.#validationRange(true);
      this.setRange();
    });

    this.input1.addEventListener('input', (e) => {
      let elem = e.target;
      let val = elem.value.replace(/[^.-\d\s]/g, '');
      elem.value = val;
    });
  }

  #setActions() {

    this.calendarWrap.addEventListener('click', () => {
      this.#clickElemFl = true;
    });

    const actionClick = (elem, fl) => {
      elem.addEventListener('click', () => {
        this.flClick = true;
        this.toggleCal(fl);
      });
    };

    actionClick(this.input1, true);


    const keydownX = (e) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        const nameModify = this.className.replace(/^\./, '') + '_visible';
        this.elem.classList.remove(nameModify);
      }
    };

    this.input1.addEventListener('keydown', keydownX);

    if (this.flRange) {
      this.input1.addEventListener('input', () => {
        const validVal = this.input1.value.length == 10;
        if (validVal)
          this.setRange();
      });

      this.input2.addEventListener('keydown', keydownX);

      this.input2.addEventListener('input', () => {
        if (this.input2.value.length == 10)
          this.setRange();
      });
      actionClick(this.input2, false);
    } else {
      this.#setActionsFilter();
    }


    this.clearButton.addEventListener('click',
      (e) => {
        e.preventDefault();
        this.$calendarObj.clear();
        if (!this.imgRight) {
          this.input1.value = '';
          this.input1.placeholder = '';
        }

        if (!this.flRange) {
          this.inputHidden.value = '';
        }

        this.#visibleClear();
      });

    this.acceptButton.addEventListener('click',
      (e) => {
        e.preventDefault();
        this.#validationRange();
      });

    document.addEventListener('click', (e) => this.#elementIsClicked(e));
  }
}


//==============================================================================

function renderComponent(className) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new DateDropDown(className, elem));
  }
  return objMas;
}

renderComponent('.date-dropdown');