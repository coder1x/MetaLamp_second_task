import $ from "jquery";


class dropDownGuest {

	inputEl: any;
	imgClass: string;
	selectEl: Element;
	$clearBut: any;
	applyClass: string;
	elem: Element;
	items: any;
	defoultText: string;
	adultsEl: any;
	childrenEl: any;
	babiesEl: any;


	// eslint-disable-next-line no-unused-vars
	constructor(public className: string) {
		this.setDomElem();
		this.setAction();
		this.setActionSelect();

		this.defoultText = 'Сколько гостей';
	}


	declOfNum(number: number, words: string[]) {
		return words[(number % 100 > 4 &&
			number % 100 < 20) ? 2 :
			[2, 0, 1, 1, 1, 2][(number % 10 < 5) ?
				number % 10 : 5]];
	}

	setInput() {

		let masGuest: string[] = ['гость', 'гостя', 'гостей'];
		let masBabies: string[] = ['младенец', 'младенца', 'младенцев'];

		let numGuest = Number(this.adultsEl.innerText) +
			Number(this.childrenEl.innerText);
		let numBabies = Number(this.babiesEl.innerText);

		let text = '';

		if (numGuest) {
			text += numGuest + ' ' + this.declOfNum(numGuest, masGuest);
		}

		if (numBabies) {
			let comma = text ? ', ' : '';
			text += comma + numBabies + ' ' +
				this.declOfNum(numBabies, masBabies);
		}

		if (text) {
			this.$clearBut.css('visibility', 'unset');
			this.inputEl.value = text;
		} else {
			this.$clearBut.css('visibility', 'hidden');
			this.inputEl.value = this.defoultText;
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
		const dropClass = '.' + this.className;
		const inputClass = dropClass + '__input';
		const itemsClass = dropClass + "__select-item";
		const selectClass = dropClass + '__select';
		const valueClass = dropClass + '__value';
		this.imgClass = dropClass + '__tip';
		this.applyClass = dropClass + "__button-apply";


		this.$clearBut = $(dropClass + "__button-clear");

		this.elem = document.querySelector(dropClass);

		const adults = this.elem.querySelector('[data-type="adults"]');
		const children = this.elem.querySelector('[data-type="children"]');
		const babies = this.elem.querySelector('[data-type="babies"]');
		this.adultsEl = adults.querySelector(valueClass);
		this.childrenEl = children.querySelector(valueClass);
		this.babiesEl = babies.querySelector(valueClass);

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
		}
		else {
			border = '4px';
			color = '0.25)';
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
		$(this.imgClass).on("click", funAct);
		$(this.applyClass).on("click", funAct);
		this.$clearBut.on("click", () => this.resetValue());


		$(document).on("mouseup", (e: any) => {

			if ($(this.elem).has(e.target).length === 0) {

				this.styleWidget(true);
				$(this.selectEl).hide();
			}

		});


	}



}




new dropDownGuest('dropDownGuest');

