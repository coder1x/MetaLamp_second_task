
class headerMenu {

	className: string;
	elem: Element;
	links: any;
	items: any;
	mapLinks: any;
	showElem: Element[];
	button: Element;
	nav: Element;

	constructor(className: string, elem: Element) {
		this.className = className;
		this.elem = elem;
		this.startMenu();
	}


	startMenu() {
		this.showElem = [];
		this.setDom();
		this.setActions();
	}


	getElements(str: string): any {
		const selector = this.className + '__' + str + '-down';
		return this.elem.querySelectorAll(selector);
	}

	getElement(str: string): any {
		const selector = this.className + '__' + str;
		return this.elem.querySelector(selector);
	}

	setDom() {
		this.links = this.getElements('link');
		this.items = this.getElements('items');
		this.button = this.getElement('toggle');
		this.nav = this.getElement('menu-wrap');

		this.mapLinks = new Map();
		for (let i = 0; i < this.links.length; i++) {
			this.mapLinks.set(this.links[i], i);
		}
	}

	getIndex(elem: Element) {
		return this.mapLinks.get(elem);
	}

	getModif() {
		const selector = this.className + '__items-down_visible';
		return selector.replace(/^\./, '');
	}

	private getVisButton(elem: Element) {
		let display = window.getComputedStyle(elem, null)
			.getPropertyValue('visibility');
		return display === 'hidden' ? false : true;
	}

	showUl(index: number) {
		if (this.getVisButton(this.button)) return;

		this.closeAll();
		const elem = this.items[index];
		elem.classList.add(this.getModif());
		this.trackMouse(elem);
		this.showElem.push(elem);
	}

	trackMouse(elem: Element) {  // следим за курсором когда он попадает на список
		elem.addEventListener('mouseout', (e: any) => {
			const rel = e.relatedTarget;
			let domEl = rel.closest('.' + this.getModif()) ?? false;

			if (!domEl) {
				this.closeUl(e.currentTarget);
			}
		});
	}

	closeUl(elem: Element) {
		elem.classList.remove(this.getModif());
	}

	closeAll() {
		if (this.showElem.length) { // закрываем предидущие 
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

	setModif(elem: Element, mod: string, fl = false) {
		const select = '__' + mod + '_visible';
		const clearName = this.className.replace(/^\./, '') + select;
		let objClass = elem.classList;
		!fl ? objClass.add(clearName) : objClass.remove(clearName);
	}

	private toggle() {
		const navVisible: boolean = this.getVisible(this.nav);

		this.setModif(this.nav, 'menu-wrap', navVisible);
		this.setModif(this.button, 'toggle', navVisible);
	}




	setActions() {

		this.button.addEventListener('click', () => {

			this.toggle();
			// вешаем модификатор на кнопку. 
			// вешаем модификатор на меню. что бы оно появилось.
			// при повторном нажатии закрываем. 
		});

		for (let item of this.links) {
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