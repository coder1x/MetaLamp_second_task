class toggleButtons {

	elem: HTMLElement;
	buttons: any;
	input: any;


	constructor(public className: string) {
		this.elem = document.querySelector(className);
		this.buttons = this.elem.querySelectorAll(className + '__bef');
		this.input = this.elem.querySelector(className + '__input');

		this.setActions();
	}


	setActions() {

		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener('click', () => {
				this.input.checked = this.input.checked ? false : true;
			});
			this.buttons[i].addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter')
					this.input.checked = this.input.checked ? false : true;
			});
		}


	}

}


new toggleButtons('.toggleButtons');