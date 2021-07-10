
class headerMenu {

	className: string;
	elem: Element;
	constructor(className: string, elem: Element) {
		this.className = className;
		this.elem = elem;
		this.setDom();
	}


	getElement(str: string): Element {
		const selector = this.className + '__' + str + '-wrap';
		return this.elem.querySelector(selector);
	}

	setDom() {

		// __items-down - показать или скрыть
		// 

		const linkC = this.className + '__link-down';



		let links = this.elem.querySelectorAll(linkC);

		console.log(links);


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