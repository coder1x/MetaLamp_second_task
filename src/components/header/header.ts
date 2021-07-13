class headerMenu {

	className: string;
	elem: Element;
	items: any;
	mapLinks: any;
	showElem: Element[];
	button: Element;
	nav: Element;
	spanBut: Element;
	linksDown: any;

	constructor(className: string, elem: Element) {
		this.className = className;
		this.elem = elem;
		this.startMenu();
	}

	private startMenu() {
		this.showElem = [];
		this.setDom();
		this.setActions();
	}


	getElements(str: string): any {
		const selector = this.className + '__' + str + '-down';
		return this.elem.querySelectorAll(selector);
	}

	getElement(str: string): Element {
		const selector = this.className + '__' + str;
		return this.elem.querySelector(selector);
	}

	private setDom() {
		this.linksDown = this.getElements('link');
		this.items = this.getElements('items');
		this.button = this.getElement('toggle');
		this.spanBut = this.getElement('toggle-line');
		this.nav = this.getElement('menu-wrap');

		this.mapLinks = new Map();
		for (let i = 0; i < this.linksDown.length; i++) {
			this.mapLinks.set(this.linksDown[i], i);
		}
	}

	private getIndex(elem: Element) {
		return this.mapLinks.get(elem);
	}

	private getModif() {
		const selector = this.className + '__items-down_visible';
		return selector.replace(/^\./, '');
	}

	private getVisButton(elem: Element) {
		let display = window.getComputedStyle(elem, null)
			.getPropertyValue('visibility');
		return display === 'hidden' ? false : true;
	}

	private showUl(index: number) {
		if (this.getVisButton(this.button)) return;

		this.closeAll();
		const elem = this.items[index];
		elem.classList.add(this.getModif());
		this.trackMouse(elem);
		this.showElem.push(elem);
	}

	private trackMouse(elem: Element) {  // следим за курсором когда он попадает на список
		elem.addEventListener('mouseout', (e: any) => {
			const rel = e.relatedTarget;
			let domEl = rel.closest('.' + this.getModif()) ?? false;

			if (!domEl) {
				this.closeUl(e.currentTarget);
			}
		});
	}

	private closeUl(elem: Element) {
		elem.classList.remove(this.getModif());
	}

	closeAll() {
		if (this.showElem.length) {
			this.showElem.map((elem) => {
				this.closeUl(elem);
			});
		}
	}

	private getVisible(elem: Element) {
		let display = window.getComputedStyle(elem, null)
			.getPropertyValue('display');
		return display === 'none' ? false : true;
	}

	private setModif(elem: Element, mod: string, fl = false) {
		const select = '__' + mod + '_visible';
		const clearName = this.className.replace(/^\./, '') + select;
		let objClass = elem.classList;
		!fl ? objClass.add(clearName) : objClass.remove(clearName);
	}

	private toggle() {
		const navVisible: boolean = this.getVisible(this.nav);
		this.setModif(this.nav, 'menu-wrap', navVisible);
		this.setModif(this.spanBut, 'toggle-line', navVisible);
	}

	private setActions() {

		this.button.addEventListener('click', () => {
			this.toggle();
		});

		for (let item of this.linksDown) {
			item.addEventListener('mouseover', (e: any) => {
				this.showUl(this.getIndex(e.currentTarget));
			});

			item.addEventListener('focus', (e: any) => {
				this.showUl(this.getIndex(e.currentTarget));
			});
		}

		document.addEventListener('click', (e: any) => {
			const domEl = e.target.closest('.' + this.getModif()) ?? false;
			if (!domEl)
				this.closeAll();
		});


		document.addEventListener('focusin', (e: any) => {
			const linkEl = e.target.closest(
				this.className + '__link-down'
			) ?? false;
			const ulEl = e.target.closest('.' + this.getModif()) ?? false;
			if (!linkEl && !ulEl)
				this.closeAll();
		});
	}
}


function renderHeaderMenu(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new headerMenu(className, elem));
	}
	return objMas;
}


renderHeaderMenu('.header');