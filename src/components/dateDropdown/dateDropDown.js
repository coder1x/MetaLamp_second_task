

class dateDropDown {

	constructor(dateDrop, dateDrop2, datepicker) {

		this.flag = false;
		this.flTog = false;

		this.input1 = document.querySelector(dateDrop);
		this.input2 = document.querySelector(dateDrop2);
		this.calendar = document.querySelector(datepicker);

		this.imgLeft = this.input1.nextSibling;
		this.imgRight = this.input2.nextSibling;

		this.createCalendar();
		this.addButtons();
		this.setActions();
	}


	inputDate(date) {
		if (this.flag) return;

		this.input1.value = '';
		this.input2.value = '';

		let masDate = date.split(",");

		if (masDate.length == 2) {
			this.input2.value = masDate[1];
		}

		this.input1.value = masDate[0];
	}

	addButtons() {

		let elem = this.$calendarObj.$el[0];
		let datepicker = elem.querySelector('.datepicker');

		let createElem = (teg, clasL, text = '') => {
			let elem = document.createElement(teg);
			elem.classList.add(clasL);
			if (text)
				elem.innerText = text;
			return elem;
		};

		let divBut = createElem('div', 'datepicker-buttons');

		let spanClr = createElem('span',
			'datepicker-buttons__clear', 'очистить');
		divBut.appendChild(spanClr);

		let spanAс = createElem('span',
			'datepicker-buttons__apply', 'применить');
		divBut.appendChild(spanAс);

		datepicker.appendChild(divBut);

		this.clearButton = spanClr;
		this.acceptButton = spanAс;
	}


	createCalendar() {

		this.$calendarObj = $(this.calendar).datepicker({
			range: true,
			prevHtml: '<img src="assets/img/inetrface/arrow_back.svg">',
			nextHtml: '<img src="assets/img/inetrface/arrow_forward.svg">',
			navTitles: {
				days: 'MM yyyy'
			},
			onSelect: (formattedDate) => {
				this.inputDate(formattedDate);
				this.flag = false;
				this.clearButton.style.visibility = 'unset';
			}
		}).data('datepicker');
	}



	setRange() {
		this.flag = true;

		let regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
		let date1 = this.input1.value;
		let date2 = this.input2.value;

		if (!regexp.test(date1)) return;

		function getDate(date) {
			let mas = date.split(".");
			return mas[1] + '.' + mas[0] + '.' + mas[2];
		}

		this.$calendarObj.clear();

		if (date2 == '') {
			this.$calendarObj.selectDate(
				new Date(getDate(date1)));
		} else {
			this.$calendarObj.selectDate(
				[new Date(getDate(date1)),
				new Date(getDate(date2))]);
		}
	}


	toggleCal(fl = false) {

		let setStyle = (display, rotate) => {
			this.calendar.style.display = display;
			this.imgLeft.style.transform = rotate;
			this.imgRight.style.transform = rotate;
		};

		if (this.flTog == fl && this.calendar.style.display == 'flex') {
			setStyle('none', 'rotate(0deg)');
		}
		else {
			setStyle('flex', 'rotate(180deg)');
		}

		this.flTog = fl;
	}


	setActions() {
		let actionClick = (elem, fl) => {
			elem.addEventListener('click', () => this.toggleCal(fl));
		};

		this.input1.addEventListener('change', () => this.setRange());
		this.input2.addEventListener('change', () => this.setRange());

		actionClick(this.input1, true);
		actionClick(this.input2, false);

		if (this.imgLeft)
			actionClick(this.imgLeft, true);

		if (this.imgRight)
			actionClick(this.imgRight, false);

		this.clearButton.addEventListener('click',
			() => {
				this.$calendarObj.clear();
				this.clearButton.style.visibility = 'hidden';
			});


		document.addEventListener("mouseup", (e) => {

			let elemFlag = false;

			for (let item of e.path) {
				if (this.calendar == item) {
					elemFlag = true;
					break;
				}
			}

			let inStock = Boolean(
				[this.input1,
				this.imgLeft,
				this.imgRight,
				this.input2].find(item => item == e.target) || elemFlag);


			if (!inStock && this.calendar.style.display == 'flex') {
				this.toggleCal(this.flTog);
			}

		});

		this.acceptButton.addEventListener('click',
			() => {
				if (this.input1.value && this.input2.value) {
					this.calendar.style.display = 'none';
				}
				else {
					alert('Выберите диапазон');
				}
			});
	}
}




new dateDropDown('#form-dateDrop', '#form-dateDrop2', '#range-datepicker');


