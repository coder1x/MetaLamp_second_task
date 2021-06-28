

class expCheckboxList {

	elem: HTMLElement;
	headerEl: HTMLElement;
	imgEl: HTMLElement;
	baseEl: HTMLElement;
	before: any;
	input: any;


	constructor(public className: string) {
		this.baseEl = document.querySelector(className);
		this.elem =
			this.baseEl.querySelector(className + '__items');
		this.headerEl = this.baseEl.querySelector(className + '__header');
		this.imgEl = this.baseEl.querySelector(className + '__tip');
		this.before = this.baseEl.querySelectorAll(className + '__bef');
		this.input = this.baseEl.querySelectorAll(className + '__input');


		this.setActions();
	}



	toggleEl() {
		let height = window.getComputedStyle(this.elem, null)
			.getPropertyValue("height");

		if (height === "0px") {
			this.elem.style.height = `${this.elem.scrollHeight}px`;
			this.imgEl.style.transform = 'rotate(180deg)';
		} else {
			this.elem.style.height = `${this.elem.scrollHeight}px`;
			this.imgEl.style.transform = 'rotate(0deg)';
			this.elem.style.height = "0";
		}
	}


	toggleBef(elem: HTMLInputElement) {
		elem.checked = elem.checked ? false : true;
	}


	private setActions() {

		if (this.imgEl) {
			this.headerEl.addEventListener('click', () => { this.toggleEl(); });
			this.imgEl.addEventListener('click', () => { this.toggleEl(); });
			this.elem.addEventListener("transitionend", () => {
				if (this.elem.style.height !== "0px") {
					this.elem.style.height = "auto";
				}
			});
		}


		for (let i = 0; i < this.before.length; i++) {
			this.before[i].addEventListener('click', () => {
				this.toggleBef(this.input[i]);
			});
			this.before[i].addEventListener('keydown', (e: any) => {
				if (e.key == 'Enter')
					this.toggleBef(this.input[i]);
			});
		}
	}
}


new expCheckboxList('.expCheckboxList');
new expCheckboxList('.checkboxButtons');
