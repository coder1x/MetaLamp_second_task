


class dateDropDown {

	constructor(dateDrop, dateDrop2, datepicker) {

		this.flag = false;
		this.input1 = $(dateDrop);
		this.input2 = $(dateDrop2);
		this.calendar = $(datepicker);

		this.createCalendar();
		this.setRange();
	}


	inputDate(date) {
		if (this.flag) return;

		this.input1.val('');
		this.input2.val('');

		let masDate = date.split(",");

		if (masDate.length == 2) {
			this.input2.val(masDate[1]);
		}

		this.input1.val(masDate[0]);
	}


	createCalendar() {
		this.calendarObj = this.calendar.datepicker({
			range: true,
			onSelect: (formattedDate) => {

				this.inputDate(formattedDate);
				this.flag = false;
			}
		}).data('datepicker');

	}

	setRange() {

		this.input1.on('change', () => {

			this.flag = true;

			let dateMas = this.input1.val().split(".");

			let day = dateMas[0];
			let month = dateMas[1];
			let year = dateMas[2];

			let date2 = this.input2.val();

			this.calendarObj.clear();

			if (date2 == '') {
				this.calendarObj.selectDate(
					new Date(month + '.' + day + '.' + year));
			} else {


				let masD2 = date2.split(".");
				let day2 = masD2[0];
				let month2 = masD2[1];
				let year2 = masD2[2];

				this.calendarObj.selectDate(
					[new Date(month + '.' + day + '.' + year),
					new Date(month2 + '.' + day2 + '.' + year2)]);
			}

		});



		this.input2.on('change', () => {

			this.flag = true;

			let dateMas = this.input2.val().split(".");

			let day2 = dateMas[0];
			let month2 = dateMas[1];
			let year2 = dateMas[2];

			let date1 = this.input1.val();

			this.calendarObj.clear();

			if (date1) {

				let masD = date1.split(".");
				let day1 = masD[0];
				let month1 = masD[1];
				let year1 = masD[2];

				this.calendarObj.selectDate(
					[new Date(month1 + '.' + day1 + '.' + year1),
					new Date(month2 + '.' + day2 + '.' + year2)]);
			}

		});
	}



}

// '#form-dateDrop' '#form-dateDrop2' '#range-datepicker'


new dateDropDown('#form-dateDrop', '#form-dateDrop2', '#range-datepicker');








