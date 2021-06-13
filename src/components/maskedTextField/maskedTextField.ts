


class maskedTextField {

	maskedDate: Element;
	temp: string;

	constructor(public className: string) {
		this.maskedDate = document.querySelector(className);

		this.temp = '';

		this.setActions();
	}


	// inputByMask(){

	// }


	setActions() {

		let _this = this;

		// eslint-disable-next-line no-unused-vars
		this.maskedDate.addEventListener('change', function (this: any, e) {

			let regexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19\d\d|20\d\d)$/;
			let dateD = this.value;

			if (!regexp.test(dateD)) return;

			let masD = dateD.split(".").map((item: string) => Number(item.replace(/^0/, '')));

			masD[1] = masD[1] - 1;

			let d = new Date(masD[2], masD[1], masD[0]);

			let day = d.getDate() == masD[0];
			let month = d.getMonth() == masD[1];
			let year = d.getFullYear() == masD[2];


			if (year && month && day) {
				return true;
			} else {
				alert("Введена некорректная дата!");
				return false;
			}
		});




		// eslint-disable-next-line no-unused-vars
		this.maskedDate.addEventListener('input', function (this: any, e) {


			let v = this.value.replace(/[^.\d]/g, '');

			let strLen = v.length;
			if (strLen == 1) {
				if (Number(v) > 3) {
					v = '0' + v;
				}
			} else if (strLen == 4) {
				if (Number(v[strLen - 1]) > 1) {
					v = v.substr(0, strLen - 1) + '0' + v[strLen - 1];
				}
			}


			let day = `^(0|[1-9]|0[1-9]|[12][0-9]|3[01])`;
			let month = day + `\\.(0|[1-9]|0[1-9]|1[012])`;
			let year = month +
				`\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

			let point = v + '.';
			let last = point != _this.temp;

			if (v.match(new RegExp(day + "\\.?$"))) {
				this.value = v.length == 2 && last ? point : v;
			}
			else if (v.match(new RegExp(month + "\\.?$"))) {
				this.value = v.length == 5 && last ? point : v;

			} else if (v.match(new RegExp(year))) {
				this.value = v;
			}
			else {
				if (_this.temp.length == 1) {
					this.value = v.substr(0, v.length - 1);
				}
				else if (_this.temp.length > v.length) {
					this.value = v;
				}
				else {
					this.value = _this.temp;
				}

			}

			_this.temp = this.value;

		});

	}


}

new maskedTextField('#form-maskedDate');







