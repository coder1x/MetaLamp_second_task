import "./checkbox-list.scss";

interface optE {
	str: string,
	fl?: boolean,
	dom?: Element
}

class сheckboxList {

	wrap: HTMLElement;
	headerEl: HTMLElement;
	imgEl: HTMLElement;
	keyF: boolean;


	// eslint-disable-next-line no-unused-vars
	constructor(public className: string, public elem: Element) {

		this.keyF = false;

		this.setDomElem();
		this.setActions();
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
		this.wrap = this.getElem({ str: '__wrap' });
		this.headerEl = this.getElem({ str: '__header' });
		this.imgEl = this.getElem({ str: '__tip' });
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

	private setActions() {

		if (this.imgEl) {
			this.headerEl.addEventListener('click', () => {
				this.toggleVis();
			});


			this.imgEl.addEventListener('click', () => { this.toggleVis(); });
			this.headerEl.addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter' || e.key == ' ') {
					e.preventDefault();
					this.toggleVis();
				} else if (e.key == 'Escape') {
					e.preventDefault();
					this.toggleModif(this.elem, '_visible', false);
				}
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



