

class dropDown {

	inputEl: HTMLInputElement;
	imgClass: string;
	selectEl: Element;
	clearBut: HTMLElement;
	applyClass: HTMLElement;
	elem: Element;
	items: any;
	defoultText: string;
	valMas: HTMLElement[];
	declensions: string[][];
	className: string;
	flClick: boolean;

	constructor(className: string, component: Element) {

		this.declensions = [];
		this.className = className;
		this.elem = component;

		this.flClick = false;

		this.setDomElem();
		this.setAction();
		this.setActionSelect();
	}


	private setDomElem() {
		const inputClass = this.className + '__input';
		const itemsClass = this.className + '__select-item';
		const selectClass = this.className + '__select';
		const valueClass = this.className + '__value';

		this.applyClass = this.elem.querySelector(
			this.className + "__button-apply"
		);

		this.clearBut = this.elem.querySelector(
			this.className + "__button-clear"
		);

		this.items = this.elem.querySelectorAll(itemsClass);

		this.valMas = [];
		for (let item of this.items) {
			this.valMas.push(item.querySelector(valueClass));
			this.readingAttributes(item);
		}

		this.inputEl = this.elem.querySelector(inputClass);
		this.defoultText = this.inputEl.placeholder;
		this.selectEl = this.elem.querySelector(selectClass);

	}


	private readingAttributes(elem: Element) {
		this.declensions.push(elem.getAttribute('data-type').split(','));
	}



	private setAction() {


		this.inputEl.addEventListener("click", (e) => {

			if (e.isTrusted) {
				if (!this.flClick) {
					this.styleWidget();
				}
				this.flClick = false;
			}
			else {
				this.flClick = true;
				this.styleWidget();
			}
		});

		this.inputEl.addEventListener("focus", () => {
			//if (!this.getVisible(this.selectEl))
			this.inputEl.click();
		});

		if (this.applyClass)
			this.applyClass.addEventListener("click", () => {

				if (this.inputEl.value == this.defoultText) {
					alert('Выберите количество гостей.');
				}
				else {
					this.styleWidget();
				}
			});

		if (this.clearBut)
			this.clearBut.addEventListener('click', () => this.resetValue());

		document.addEventListener("mouseup", (e: any) => {
			if (!e.target.closest(this.className)) {
				this.styleWidget(true);
			}
		});

	}

	private getVisible(elem: Element) {
		let display = window.getComputedStyle(elem, null)
			.getPropertyValue("display");
		return display === "none" ? false : true;
	}


	private styleWidget(flag = false) {
		const UlVisible: boolean = this.getVisible(this.selectEl);
		let flagVis = !UlVisible && !flag;
		this.toggleModif(this.elem, '_visible', flagVis);
	}


	toggleModif(elem: Element, modif: string, flag = false) {
		let clearName = this.className.replace(/^\./, '') + modif;
		let objClass = elem.classList;
		flag ? objClass.add(clearName) : objClass.remove(clearName);
	}


	resetValue() {
		this.valMas.map((item: HTMLElement) => item.innerText = '0');
		this.inputEl.value = this.defoultText;

		if (this.clearBut)
			this.toggleModif(this.clearBut, '__button-clear_visible');

	}

	declOfNum(number: number, words: string[]) {
		return words[(number % 100 > 4 &&
			number % 100 < 20) ? 2 :
			[2, 0, 1, 1, 1, 2][(number % 10 < 5) ?
				number % 10 : 5]];
	}


	private setActionSelect() {

		const funAct = (e: any) => {
			let liEl = e.currentTarget;
			let target = e.target;

			const valueEl = liEl.querySelector(this.className + '__value');
			const minusEl = target.closest(this.className + '__minus');
			const plusEl = target.closest(this.className + '__plus');

			let num = Number(valueEl.innerText);
			if (minusEl && num) {
				--num;
			}
			else if (plusEl) {
				++num;
			}

			valueEl.innerText = num;
			this.setInput();
		};

		for (let item of this.items) {
			item.addEventListener("click", funAct);
		}
	}


	getMapValue() {
		let fields = new Map();
		for (let i = 0; i < this.valMas.length; i++) {
			let typeText = this.declensions[i].join(',');
			let value = Number(this.valMas[i].innerText);
			if (fields.has(typeText)) {
				let oldValue = fields.get(typeText);
				let newValue = oldValue + value;
				fields.set(typeText, newValue);
			}
			else {
				fields.set(typeText, value);
			}
		}
		return fields;
	}

	private setInput() {
		let text = '';
		let mergeText = (
			num: number,
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


		let kl = false;
		for (let item of this.getMapValue()) {
			mergeText(item[1], item[0].split(','), Boolean(kl));
			kl = true;
		}


		let setData = (visibility: boolean,
			value: string,
			placeholder: string) => {

			if (this.clearBut) {
				this.toggleModif(
					this.clearBut,
					'__button-clear_visible',
					visibility);
			}

			this.inputEl.value = value;
			this.inputEl.placeholder = placeholder;
		};


		if (text) {
			setData(true, text, text);
		} else {
			setData(false, '', this.defoultText);
		}
	}
}


//==========================================================================

function renderComponent(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new dropDown(className, elem));
	}
	return objMas;
}

renderComponent('.drop-down');


