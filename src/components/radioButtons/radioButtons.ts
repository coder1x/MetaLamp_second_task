
class radioButtons {

	elem: HTMLElement;
	buttons: any;
	inputs: any;


	constructor(public className: string) {
		this.elem = document.querySelector(className);
		this.buttons = this.elem.querySelectorAll(className + '__bef');
		this.inputs = this.elem.querySelectorAll(className + '__input');

		this.setActions();
	}


	setActions() {

		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener('click', (e: any) => {
				e.preventDefault();

				this.inputs[i].checked = true;

			});
		}


	}

}


new radioButtons('.radioButtons');
