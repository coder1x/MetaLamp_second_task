
class radioButtons {

	private buttons: any;
	private inputs: any;

	constructor(className: string, elem: Element) {
		this.buttons = elem.querySelectorAll(className + '__bef');
		this.inputs = elem.querySelectorAll(className + '__input');

		if (this.buttons)
			this.setActions();
	}

	private setActions() {
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter' || e.key == ' ') {
					this.inputs[i].checked = true;
					e.preventDefault();
				}
			});
		}
	}
}


function renderRadioButtons(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new radioButtons(className, elem));
	}
	return objMas;
}


renderRadioButtons('.radio-buttons');
