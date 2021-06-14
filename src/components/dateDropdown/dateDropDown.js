

class dateDropDown {

	constructor(dateDrop, dateDrop2, datepicker) {

		this.flag = false;
		this.flTog = false;

		this.input1 = document.querySelector(dateDrop);
		this.input2 = document.querySelector(dateDrop2);
		this.calendar = document.querySelector(datepicker);

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

		const clearB = 'datepicker-buttons__clear';
		const applyB = 'datepicker-buttons__apply';
		let elem = this.$calendarObj.$el[0];
		let datepicker = elem.querySelector('.datepicker');


		let divBut = document.createElement('div');
		divBut.classList.add('datepicker-buttons');

		let spanClr = document.createElement('span');
		spanClr.classList.add(clearB);
		//spanClr.style.visibility = 'hidden';
		spanClr.innerText = 'очистить';
		divBut.appendChild(spanClr);

		let spanAс = document.createElement('span');
		spanAс.classList.add(applyB);
		spanAс.innerText = 'применить';
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
			const day = mas[0];
			const month = mas[1];
			const year = mas[2];

			return month + '.' + day + '.' + year;
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

		if (this.flTog == fl && this.calendar.style.display == 'flex') {
			this.calendar.style.display = 'none';
		}
		else {
			this.calendar.style.display = 'flex';
		}

		this.flTog = fl;
	}


	setActions() {
		this.input1.addEventListener('change', () => this.setRange());
		this.input2.addEventListener('change', () => this.setRange());

		this.input1.addEventListener('click', () => this.toggleCal(true));
		this.input2.addEventListener('click', () => this.toggleCal(false));


		this.clearButton.addEventListener('click',
			() => {
				this.$calendarObj.clear();
				this.clearButton.style.visibility = 'hidden';
			});


		this.acceptButton.addEventListener('click',
			() => {
				let date1 = this.input1.value;
				let date2 = this.input2.value;

				if (date1 && date2) {
					this.calendar.style.display = 'none';
				}
				else {
					alert('Выберите диапазон');
				}
			});


	}
}




new dateDropDown('#form-dateDrop', '#form-dateDrop2', '#range-datepicker');


