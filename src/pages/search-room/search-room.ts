import './search-room.scss';

interface PT {
	block: string,
	button: string
}

class sidebar {
	blockClass: string;
	buttonClass: string;
	button: Element;
	block: Element;
	classVisible: string;
	private click: boolean;

	constructor(options: PT) {
		this.blockClass = options.block;
		this.buttonClass = options.button;
		this.click = false;
		this.setDom();
		this.setActions();
	}

	private setDom() {
		this.button = document.querySelector(this.buttonClass);
		this.block = document.querySelector(this.blockClass);
		this.classVisible = this.blockClass.replace(/^\./, '') + '_visible';
	}

	private getVisible() {
		let display = window.getComputedStyle(this.block, null)
			.getPropertyValue('display');
		return display === 'none' ? false : true;
	}

	private toggle(fl = this.getVisible()) {
		let objClass = this.block.classList;
		!fl ?
			objClass.add(this.classVisible) :
			objClass.remove(this.classVisible);
	}

	private setActions() {
		this.button.addEventListener('click', () => {
			this.click = true;
			this.toggle();
		});

		this.block.addEventListener('click', () => {
			this.click = true;
		});

		document.addEventListener('click', () => {
			const flag = this.getVisible() && !this.click;
			if (flag)
				this.toggle(true);
			this.click = false;
		});
	}
}

new sidebar({
	block: '.search-room-filter',
	button: '.search-room-content__button-wrap'
});




