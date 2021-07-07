
interface optE {
	str: string,
	fl?: boolean,
	dom?: Element
}

class dropDown {

	inputEl: HTMLInputElement;
	private imgClass: string;
	private selectEl: Element;
	clearBut: Element;
	private applyClass: Element;
	elem: Element;
	private items: any;
	defoultText: string;
	valMas: HTMLElement[];
	declensions: string[][];
	className: string;
	private flClick: boolean;
	private disPlus: boolean;

	constructor(className: string, component: Element) {

		this.declensions = [];
		this.className = className;
		this.elem = component;

		this.flClick = false;
		this.disPlus = false;

		this.setDomElem();
		this.setActions();
		this.setActionSelect();
	}

	private getElem(param: optE) {
		let elem: any;
		let dom = param.dom ?? this.elem;
		let name = this.className + param.str;
		if (param.fl) {
			elem = dom.querySelectorAll(name);
		}
		else {
			elem = dom.querySelector(name);
		}
		return elem;
	}

	private setDomElem() {
		const valueClass = this.className + '__value';

		this.applyClass = this.getElem({ str: '__button-apply' });
		this.clearBut = this.getElem({ str: '__button-clear' });
		this.items = this.getElem({ str: '__select-item', fl: true });

		this.valMas = [];
		for (let item of this.items) {
			this.getСheckVal(item);
			this.valMas.push(item.querySelector(valueClass));
			this.readingAttributes(item);
		}

		this.inputEl = this.getElem({ str: '__input' });
		this.defoultText = this.inputEl.placeholder;
		this.selectEl = this.getElem({ str: '__select' });
	}


	getСheckVal(item: Element) {
		let minus = this.getElem({ str: '__minus', dom: item });
		let value = this.getElem({ str: '__value', dom: item });
		let plus = this.getElem({ str: '__plus', dom: item });

		let getModif = (str: string, str2: string) => {
			return this.className.replace(/^\./, '') + str + str2;
		};

		let classM = getModif('__minus', '_disable');
		let val = Number(value.innerText);

		if (!val) {
			minus.classList.add(classM);
			minus.disabled = true;
		} else {
			minus.classList.remove(classM);
			minus.disabled = false;
		}

		let maxVal = Number(plus.getAttribute('data-max'));
		let classP = getModif('__plus', '_disable');
		if (val >= maxVal) {
			plus.classList.add(classP);
			this.disPlus = true;
			plus.disabled = true;
		} else {
			plus.classList.remove(classP);
			this.disPlus = false;
			plus.disabled = false;
		}
	}

	private readingAttributes(elem: Element) {
		this.declensions.push(elem.getAttribute('data-type').split(','));
	}

	private setActions() {

		this.inputEl.addEventListener('mouseup', () => {
			this.toggle();
			this.flClick = false;
		});

		this.inputEl.addEventListener('mousedown', () => {
			this.flClick = true;
		});

		this.inputEl.addEventListener('focus', () => {
			if (!this.flClick)
				this.toggle();
		});

		if (this.applyClass)
			this.applyClass.addEventListener('click', (e: any) => {
				e.preventDefault();
				const defoultText = this.inputEl.value == this.defoultText;
				const inputClear = defoultText || !this.inputEl.value;

				if (inputClear) {
					alert('Выберите количество гостей.');
				}
				else {
					this.toggle();
				}
			});

		if (this.clearBut)
			this.clearBut.addEventListener('click', (e: any) => {
				e.preventDefault();
				this.resetValue();
			});


		let eventDoc = (event: string) => {
			document.addEventListener(event, (e: any) => {
				const domEl = e.target.closest(this.className);
				if (domEl != this.elem)
					this.toggle(true);
			});
		};

		eventDoc('click');
		eventDoc('focusin');
	}

	private getVisible(elem: Element) {
		let display = window.getComputedStyle(elem, null)
			.getPropertyValue('display');
		return display === 'none' ? false : true;
	}


	private toggle(flag = false) {
		const UlVisible: boolean = this.getVisible(this.selectEl);
		let flagVis = !UlVisible && !flag;
		this.toggleModif(this.elem, '_visible', flagVis);
	}


	private toggleModif(elem: Element, modif: string, flag = false) {
		let clearName = this.className.replace(/^\./, '') + modif;
		let objClass = elem.classList;
		flag ? objClass.add(clearName) : objClass.remove(clearName);
	}


	resetValue() {
		this.valMas.map((item: HTMLElement) => item.innerText = '0');
		this.inputEl.value = this.defoultText;

		for (let item of this.items) { this.getСheckVal(item); }

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
			e.preventDefault();
			let liEl = e.currentTarget;
			let target = e.target;

			const valueEl = liEl.querySelector(this.className + '__value');
			const minusEl = target.closest(this.className + '__minus');
			const plusEl = target.closest(this.className + '__plus');

			let num = Number(valueEl.innerText);
			if (minusEl && num) {
				--num;
			}
			else if (plusEl && !this.disPlus) {
				++num;
			}

			valueEl.innerText = num;
			this.getСheckVal(liEl);
			this.setInput();
		};

		for (let item of this.items) {
			item.addEventListener('click', funAct);
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

function renderDropDown(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new dropDown(className, elem));
	}
	return objMas;
}

renderDropDown('.drop-down');



