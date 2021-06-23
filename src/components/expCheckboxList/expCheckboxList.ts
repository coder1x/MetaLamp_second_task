

class expCheckboxList {

	elem: HTMLElement;
	headerEl: HTMLElement;
	imgEl: HTMLElement;

	// eslint-disable-next-line no-unused-vars
	constructor(public className: string) {
		this.elem =
			document.querySelector(this.className + '__items');
		this.headerEl = document.querySelector(this.className + '__header');
		this.imgEl = document.querySelector(this.className + '__tip');

		if (this.imgEl)
			this.setActions();
	}

	private setActions() {

		let toggleEl = () => {
			if (this.elem.style.height === "0px") {
				this.elem.style.height = `${this.elem.scrollHeight}px`;
			} else {
				this.elem.style.height = `${this.elem.scrollHeight}px`;
				window.getComputedStyle(this.elem, null)
					.getPropertyValue("height");
				this.elem.style.height = "0";
			}
		};


		this.headerEl.addEventListener('click', toggleEl);


		this.elem.addEventListener("transitionend", () => {
			if (this.elem.style.height !== "0px") {
				this.elem.style.height = "auto";
			}
		});

		this.imgEl.addEventListener('click', toggleEl);
	}

}



new expCheckboxList('.expCheckboxList');


