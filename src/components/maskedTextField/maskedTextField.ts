

let maskedDate = document.querySelector('#form-maskedDate');

let temp = '';



// проверять на корректность даты через DATE .. потому что в 04 месяц - нет 31 день .. и тп. 
// между цифрами удаёться вписывать символы. 

// eslint-disable-next-line no-unused-vars
maskedDate.addEventListener('change', function (this: any, e) {


	// нужно отформатировать дату из инпута убрав точки заменив на пробелы
	// перед годом поставить запятую
	// день поменять местами с месяцем
	// убрать нули
	// всё это лучше сделать через скобочные группы в регулярке. и сформировать нужную строку.
	// получить строку только когда дата полностью написана корректно. 

	let objDate = new Date('2 31, 2021');



	console.log(objDate.getFullYear());
	console.log(objDate.getMonth());
	console.log(objDate.getDate());

	// потом сравниваем полученный день месяц и год 
	// с данными из скобочных групп .. если он дату автоматом перевёл 
	// значит в поле было не правильно введино либо число либо месяц и тп. 
	// подсветить текст в инпуте крассным цветом. 


	//console.log(Date.parse('2 31, 2021'));

	// let timestamp = Date.parse(this.value);
	// if (isNaN(timestamp) == false) {
	// 	console.log("ssss");

	// }
});

// eslint-disable-next-line no-unused-vars
maskedDate.addEventListener('input', function (this: any, e) {


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
	let year = month + `\\.([1-2]|19|20|19\\d|20\\d|19\\d\\d|20\\d\\d)$`;

	let point = v + '.';
	let last = point != temp;

	if (v.match(new RegExp(day + "\\.?$"))) {
		this.value = v.length == 2 && last ? point : v;
	}
	else if (v.match(new RegExp(month + "\\.?$"))) {
		this.value = v.length == 5 && last ? point : v;

	} else if (v.match(new RegExp(year))) {
		this.value = v;
	}
	else {
		temp.length == 1 ? this.value = v.substr(0, v.length - 1) :
			this.value = temp;
	}

	temp = this.value;

});

