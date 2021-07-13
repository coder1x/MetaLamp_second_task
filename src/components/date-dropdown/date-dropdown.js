import "./datepicker.scss";
import "./date-dropdown.scss";
/*
Компонент dateDropDown использует плагин jQuery air-datepicker
который позволяет осуществлять ввод Даты через календарь, а так же
указывать диапазон Даты.
	Описание в readme.md
*/


class dateDropDown {

	constructor(className, elem) {

		this.#setDomElem(className, elem);
		this.#createCalendar();
		this.#setActions();

		if (!this.flRange)
			this.setRange();
	}

	#clickElemFl = false;
	#classClear = '';
	#flag = false;
	#flTog = false;
	#flInFilter = false;
	#masMonth = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
		'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];


	#setDomElem(className, elem) {

		this.#classClear = className.replace(/^\./, '') + '__clear';

		this.className = className;
		this.elem = elem;
		this.calendar = elem.querySelector(className + '__datepicker');
		this.calendarWrap = elem.querySelector(className + '__datepicker-wrap');

		this.inputs = elem.querySelectorAll('input');
		this.flRange = this.inputs.length > 1 ? true : false;

		this.input1 = this.inputs[0];
		this.imgLeft = this.input1.nextSibling;

		this.clearButton = elem.querySelector(className + '__clear');
		this.acceptButton = elem.querySelector(className + '__apply');

		if (this.flRange) {
			this.input2 = this.inputs[1];
			this.imgRight = this.input2.nextSibling;
		}
	}


	#inputDate(date) {
		if (this.#flag) return;

		if (!date) {
			this.input1.value = '';
			if (this.flRange)
				this.input2.value = '';
			return;
		}

		let getDateFilter = (date) => {
			if (!date) return '';
			let mas = date.split(".");
			return mas[0] + ' ' + this.#masMonth[mas[1] - 1];
		};

		let masDate = date.split(",");

		this.input1.value = this.flRange ?
			masDate[0] : getDateFilter(masDate[0]);

		if (masDate.length == 2) {
			if (this.flRange) {
				this.input2.value = masDate[1];
			} else {
				this.input1.value += ' - ' + getDateFilter(masDate[1]);
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

		this.$calendarObj = $(this.calendar).datepicker({
			range: true,
			minDate: new Date(),
			prevHtml:
				'<img src="assets/images/date-dropdown/img/arrow_back.svg">',
			nextHtml:
				'<img src="assets/images/date-dropdown/img/arrow_forward.svg">',
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


	dateConversion(dateText) {
		let date = dateText.trim().split(" ");
		let index = this.#masMonth.indexOf(date[1], 0);
		let month = 0;
		if (index != -1) {
			month = ++index;
		}
		let currentDate = new Date();
		return month + '.' + date[0] + '.' + currentDate.getFullYear();
	}



	setRange() {
		this.#flag = true;

		function getDate(date) {
			let mas = date.split(".");
			return new Date(mas[1] + '.' + mas[0] + '.' + mas[2]);
		}

		let regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
		let regexp2 =
			`(0[1-9]|[12][0-9]|3[01])\\s\\p{sc=Cyrillic}{3}`;
		let date1 = this.input1.value;


		let oneMeaning = new RegExp('^' + regexp2 + '\\s-\\s' +
			regexp2 + '$', 'ui').test(date1);

		if (!regexp.test(date1))
			if (!oneMeaning) return;


		if (this.flRange) {
			let date2 = this.input2.value;
			this.$calendarObj.clear();
			if (date2 == '') {
				this.$calendarObj.selectDate(getDate(date1));
			} else {
				this.$calendarObj.selectDate([getDate(date1), getDate(date2)]);
			}
		} else {

			this.$calendarObj.clear();

			let mas = date1.split("-");
			let dateOne = this.dateConversion(mas[0]);
			let dateTwo = this.dateConversion(mas[1]);

			let minOne = Date.parse(dateOne) / 1000 / 60;
			let minTwo = Date.parse(dateTwo) / 1000 / 60;

			if (minOne > minTwo) {
				let mas = dateTwo.split('.');
				let num = Number(mas[2]) + 1;
				dateTwo = mas[0] + '.' + mas[1] + '.' + num;
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
		return display === "none" ? false : true;
	}

	toggleCal(fl = false) {
		const nameModif = this.className.replace(/^\./, '') + '_visible';
		const visible = this.getVisible(this.calendarWrap);
		const objElem = this.elem.classList;
		if (this.#flTog == fl && visible) {
			objElem.remove(nameModif);
		}
		else {
			objElem.add(nameModif);
		}
		this.#flTog = fl;
	}

	#validationRange() {
		let twoMeanings = false, oneMeaning = false;

		if (this.flRange) {
			twoMeanings = Boolean(this.input1.value &&
				this.input2.value);
		}
		else {
			let regexp =
				`(0[1-9]|[12][0-9]|3[01])\\s\\p{sc=Cyrillic}{3}`;

			oneMeaning = new RegExp('^' + regexp + '\\s-\\s' +
				regexp + '$', 'ui').test(this.input1.value);
		}


		if (twoMeanings || oneMeaning) {
			this.toggleCal(this.#flTog);
		}
		else {
			alert('Выберите диапазон');
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


	#setActions() {

		this.calendarWrap.addEventListener('click', () => {
			this.#clickElemFl = true;
		});

		let actionClick = (elem, fl) => {
			elem.addEventListener('click', () => this.toggleCal(fl));
		};

		actionClick(this.input1, true);

		this.input1.addEventListener('input', () => {
			let len = this.flRange ? 10 : 15;
			if (this.input1.value.length == len)
				this.setRange();
		});

		if (this.flRange) {
			this.input2.addEventListener('input', () => {
				if (this.input2.value.length == 10)
					this.setRange();
			});
			actionClick(this.input2, false);
		}

		this.clearButton.addEventListener('click',
			(e) => {
				e.preventDefault();
				this.$calendarObj.clear();
				if (!this.imgRight) {
					this.input1.value = '';
					this.input1.placeholder = '';
				}
				this.#visibleClear();
			});

		document.addEventListener('click', (e) => this.#elementIsClicked(e));

		this.acceptButton.addEventListener('click',
			(e) => {
				e.preventDefault();
				this.#validationRange();
			});
	}
}




function renderComponent(className) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new dateDropDown(className, elem));
	}
	return objMas;
}

renderComponent('.date-dropdown');