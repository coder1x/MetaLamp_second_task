class toggleButtons {
	buttons: any;
	input: any;

	constructor(className: string, elem: Element) {
		this.buttons = elem.querySelectorAll(className + '__bef');
		this.input = elem.querySelector(className + '__input');

		if (this.buttons)
			this.setActions();
	}

	setActions() {
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter')
					this.input.checked = this.input.checked ? false : true;
			});
		}
	}
}


function renderToggleButtons(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new toggleButtons(className, elem));
	}
	return objMas;
}


renderToggleButtons('.toggle-buttons');

