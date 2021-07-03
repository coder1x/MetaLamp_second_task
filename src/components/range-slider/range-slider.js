
class rangeSlider {

	constructor(className, elem) {

		this.className = className;
		this.elem = elem;

		this.setDomElem();
		this.createRangeSlider();
	}


	setDomElem() {
		const classVal = this.className + '__value';
		this.valueEl = this.elem.querySelector(classVal);
	}

	createRangeSlider() {

		let setRange = ({ from, to }) => {
			const numFrom = from.toLocaleString();
			const numTo = to.toLocaleString();
			const range = numFrom + '₽ - ' + numTo + '₽';
			this.valueEl.innerText = range;
		};

		this.$myRange = $(".range-slider__input").ionRangeSlider({
			type: "double",
			min: 0,
			step: 1,
			// eslint-disable-next-line camelcase
			hide_min_max: true,
			// eslint-disable-next-line camelcase
			hide_from_to: true,

			onStart: (data) => {
				setRange(data);
			},

			onChange: (data) => {
				setRange(data);
			}
		}).data('ionRangeSlider');
	}
}

function renderRangeSlider(className) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new rangeSlider(className, elem));
	}
	return objMas;
}

renderRangeSlider('.range-slider');



