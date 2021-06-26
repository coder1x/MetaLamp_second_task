
interface opt {
	className: string,
	selectMas: string[],
	declensions: string[][],
	componentType: string,
	defoultText: string
}

class dropDown {

	inputEl: HTMLInputElement;
	imgClass: string;
	selectEl: Element;
	$clearBut: any;
	applyClass: string;
	elem: Element;
	items: any;
	defoultText: string;
	valMas: HTMLElement[];
	className: string;
	selectMas: string[];
	declensions: string[][];
	componentType: string;

	// eslint-disable-next-line no-unused-vars
	constructor(options: opt) {

		this.className = options.className;
		this.selectMas = options.selectMas;
		this.declensions = options.declensions;
		this.componentType = options.componentType;
		this.defoultText = options.defoultText;

		this.setDomElem();
		this.setAction();
		this.setActionSelect();
	}


	declOfNum(number: number, words: string[]) {
		return words[(number % 100 > 4 &&
			number % 100 < 20) ? 2 :
			[2, 0, 1, 1, 1, 2][(number % 10 < 5) ?
				number % 10 : 5]];
	}


	setInput() {
		let text = '';

		let mergeText = (num: string | number,
			strMas: string[], fl = false) => {
			num = Number(num);
			if (!num) return;

			if (!fl) {
				text += num + ' ' +
					this.declOfNum(num, strMas);
			}
			else {
				let comma = text ? ', ' : '';
				text += comma + num + ' ' +
					this.declOfNum(num, strMas);
			}
		};

		let val1: string | number = '';
		let val2 = '';
		let kl = 0;

		switch (this.componentType) {
			case 'Guests':
				val1 = Number(this.valMas[0].innerText) +
					Number(this.valMas[1].innerText);
				val2 = this.valMas[2].innerText;
				mergeText(val1, this.declensions[0]);
				mergeText(val2, this.declensions[2], true);

				break;
			case 'Rooms':
				for (let item of this.valMas) {
					mergeText(item.innerText,
						this.declensions[kl], Boolean(kl));
					++kl;
				}
				break;
			default:
				break;
		}


		if (text) {
			this.$clearBut.css('visibility', 'unset');
			this.inputEl.value = text;
			this.inputEl.placeholder = text;
		} else {
			this.$clearBut.css('visibility', 'hidden');
			this.inputEl.value = '';
			this.inputEl.placeholder = this.defoultText;
		}

	}


	resetValue() {
		for (let item of this.items) {
			let listEl = $(item)[0].children;
			listEl[2].innerText = '0';
		}

		this.inputEl.value = this.defoultText;
		this.$clearBut.css('visibility', 'hidden');
	}


	setDomElem() {
		const inputClass = this.className + '__input';
		const itemsClass = this.className + "__select-item";
		const selectClass = this.className + '__select';
		const valueClass = this.className + '__value';

		this.imgClass = this.className + '__tip';
		this.applyClass = this.className + "__button-apply";

		this.$clearBut = $(this.className + "__button-clear");

		this.elem = document.querySelector(this.className);

		this.valMas = [];
		for (let i = 0; i < this.selectMas.length; i++) {
			let item = this.elem.querySelector('[data-type="' +
				this.selectMas[i] + '"]');

			this.valMas.push(item.querySelector(valueClass));
		}

		this.inputEl = this.elem.querySelector(inputClass);
		this.selectEl = this.elem.querySelector(selectClass);
		this.items = this.selectEl.querySelectorAll(itemsClass);
	}



	setActionSelect() {
		const funAct = (e: any) => {
			let listEl = $(e.currentTarget)[0].children;
			let minusEl = listEl[1];
			let valueEl = listEl[2];
			let plusEl = listEl[3];

			let num = Number(valueEl.innerText);
			if (e.target == minusEl && num) {
				--num;
			}
			else if (e.target == plusEl) {
				++num;
			}

			valueEl.innerText = num;
			this.setInput();
		};

		for (let item of this.items) {
			$(item).on("click", funAct);
		}
	}


	styleWidget(flag = false) {
		let border = '';
		let color = '';

		if (!$(this.selectEl).is(':visible') && !flag) {
			border = '0px';
			color = '0.5)';
			$(this.imgClass).css('transform', 'rotate(180deg)');
		}
		else {
			border = '4px';
			color = '0.25)';
			$(this.imgClass).css('transform', 'rotate(0deg)');
		}

		$(this.inputEl).css({
			"border-bottom-left-radius": border,
			"border-bottom-right-radius": border,
			"border": "1px solid rgba(31, 32, 65, " + color
		});
	}


	setAction() {
		let funAct = () => {
			this.styleWidget();
			$(this.selectEl).toggle();
		};

		$(this.inputEl).on("click", funAct);

		$(this.applyClass).on("click", () => {

			if (this.inputEl.value == this.defoultText) {
				alert('Выберите количество гостей.');
			}
			else {
				funAct();
			}
		});

		this.$clearBut.on("click", () => this.resetValue());

		$(document).on("mouseup", (e: any) => {

			if ($(this.elem).has(e.target).length === 0) {

				this.styleWidget(true);
				$(this.selectEl).hide();
			}

		});

	}
}


//==========================================================================

let masGuest: string[] = ['гость', 'гостя', 'гостей'];
let masBabies: string[] = ['младенец', 'младенца', 'младенцев'];


new dropDown({
	className: '.dropDown',
	selectMas: ['adults', 'children', 'babies'],
	declensions: [masGuest, masGuest, masBabies],
	componentType: 'Guests',
	defoultText: 'Сколько гостей'
});



let masBedrooms: string[] = ['спальня', 'спальни', 'спален'];
let masBed: string[] = ['кровать', 'кровати', 'кроватей'];
let masBathrooms: string[] =
	['ванная комната', 'ванных комнаты', 'ванных комнат'];

new dropDown({
	className: '.dropDownRooms',
	selectMas: ['bedrooms', 'bed', 'bathrooms'],
	declensions: [masBedrooms, masBed, masBathrooms],
	componentType: 'Rooms',
	defoultText: 'Сколько спален'
});

