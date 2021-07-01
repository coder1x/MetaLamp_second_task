



class сheckboxList {

	wrap: HTMLElement;
	headerEl: HTMLElement;
	imgEl: HTMLElement;
	before: any;
	input: any;


	// eslint-disable-next-line no-unused-vars
	constructor(public className: string, public elem: Element) {

		this.setDomElem();
		this.setActions();
	}

	private setDomElem() {
		this.wrap = this.elem.querySelector(this.className + '__wrap');
		this.headerEl = this.elem.querySelector(this.className + '__header');
		this.imgEl = this.elem.querySelector(this.className + '__tip');
		this.before = this.elem.querySelectorAll(this.className + '__bef');
		this.input = this.elem.querySelectorAll(this.className + '__input');
	}


	toggleVis() {
		let display = window.getComputedStyle(this.wrap, null)
			.getPropertyValue('display');
		const flag = display == 'block' ? false : true;

		this.toggleModif(this.elem, '_visible', flag);
	}

	private toggleModif(elem: Element, modif: string, flag = false) {
		let clearName = this.className.replace(/^\./, '') + modif;
		let objClass = elem.classList;
		flag ? objClass.add(clearName) : objClass.remove(clearName);
	}

	private toggleChecked(elem: HTMLInputElement) {
		elem.checked = elem.checked ? false : true;
	}


	private setActions() {

		if (this.imgEl) {
			this.headerEl.addEventListener('click', () => {
				this.toggleVis();
			});
			this.imgEl.addEventListener('click', () => { this.toggleVis(); });
			this.headerEl.addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter')
					this.toggleVis();
			});
		}


		for (let i = 0; i < this.before.length; i++) { // focus
			this.before[i].addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter')
					this.toggleChecked(this.input[i]);
			});
		}
	}
}



function renderCheckboxList(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new сheckboxList(className, elem));
	}
	return objMas;
}


renderCheckboxList('.checkbox-list');



