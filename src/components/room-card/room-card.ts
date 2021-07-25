import './room-card.scss';


class slider {

	className: string;
	elem: Element;
	slidesEl: any;
	dotEl: Element;
	prevEl: any;
	nextEl: any;
	indexS: number;
	indexDot: number;
	sliderWrap: Element;
	flagSwipe: boolean;
	linkSlide: Element;

	constructor(className: string, elem: Element) {
		this.className = className;
		this.elem = elem;
		this.indexS = 0;
		this.indexDot = 0;
		this.startSlider();
	}

	getElement(str: string): Element {
		const selector = this.className + '__' + str + '-wrap';
		return this.elem.querySelector(selector);
	}

	startSlider() {
		this.setDom();
		this.createDot();
		this.paintDot();
		this.setAction();
		this.setActionSwipe();
	}

	setDom() {
		const slide = this.className + '__slide';
		this.slidesEl = this.elem.querySelectorAll(slide);

		this.dotEl = this.getElement('dot');
		this.prevEl = this.getElement('prev');
		this.nextEl = this.getElement('next');
		this.sliderWrap = this.getElement('slider');
		this.linkSlide = this.elem.querySelector(this.className + '__link');

	}

	private getVisible(elem: Element) {
		let opacity = window.getComputedStyle(elem, null)
			.getPropertyValue('opacity');
		return opacity === '0' ? false : true;
	}

	private toggle(slide: Element) {
		const fl: boolean = this.getVisible(slide);
		const prefics = '__slide' + '_visible';
		const clearName = this.className.replace(/^\./, '') + prefics;

		let objClass = slide.classList;
		!fl ? objClass.add(clearName) : objClass.remove(clearName);
	}

	paintDot() {
		const dotCl = this.className + '__dot';
		let modif = dotCl + '_paint';
		modif = modif.replace(/^\./, '');
		let dots = this.elem.querySelectorAll(dotCl);
		this.indexDot;

		let objClass = dots[this.indexDot].classList;
		objClass.remove(modif); // удаляем модификатор с текущей точки

		objClass = dots[this.indexS].classList;
		objClass.add(modif); // ставим модификатор
		this.indexDot = this.indexS;
	}

	setVisible(index: number) {
		this.toggle(this.slidesEl[this.indexS]); // удаляем класс с пред идущего слайда
		this.indexS = index;
		this.toggle(this.slidesEl[this.indexS]); // показываем новый

		this.paintDot();
	}

	createDot() {
		const classN = this.className.replace(/^\./, '') + '__dot';

		for (let i = 0; i < this.slidesEl.length; i++) {
			const dot = document.createElement('span');
			dot.classList.add(classN);
			dot.setAttribute('data-index', String(i));
			this.dotEl.appendChild(dot);
		}
	}


	setAction() {

		this.prevEl.addEventListener('click', () => {
			if (this.indexS > 0) {
				this.setVisible(this.indexS - 1);
			}
			else {
				this.setVisible(this.slidesEl.length - 1);
			}
		});

		this.nextEl.addEventListener('click', () => {
			const len = this.slidesEl.length - 1;
			if (this.indexS < len) {
				this.setVisible(this.indexS + 1);
			}
			else {
				this.setVisible(0);
			}
		});

		this.linkSlide.addEventListener('click', (e: any) => {

			if (this.flagSwipe) {
				e.preventDefault();
			}
			this.flagSwipe = false;
		});

		this.dotEl.addEventListener('click', (e: any) => {
			const index = Number(e.target.getAttribute('data-index'));

			if (this.indexS != index && !isNaN(index))
				this.setVisible(index);
		});
	}


	setActionSwipe() {

		let xyDown: number[] = [];

		function handleSwipeStart(ev: any) {
			xyDown = getCoordinatesXY(ev);
		}

		function getCoordinatesXY(ev: any): number[] {
			if (ev.type == 'touchstart' || ev.type == 'touchmove')
				return [ev.touches[0].clientX, ev.touches[0].clientY];

			if (ev.type == 'mousedown' || ev.type == 'mousemove')
				return [ev.clientX, ev.clientY];

			return [];
		}

		const swipe = (xyDiff: any) => {
			if (xyDiff[0] > 0) {
				this.nextEl.click();
			} else {
				this.prevEl.click();
			}
			this.flagSwipe = true;
		};

		function handleSwipeMove(ev: any) {
			if (!xyDown) {
				return;
			}

			const touchmove = ev.type == 'touchmove';
			const mousemove = ev.type == 'mousemove';
			const event = touchmove || mousemove && ev.buttons == 1;

			if (event) {
				let xyUp: number[] = getCoordinatesXY(ev);

				if (Math.abs((xyUp[0] - xyDown[0])) > 10) {
					let xyDiff = [xyDown[0] - xyUp[0], xyDown[1] - xyUp[1]];
					swipe(xyDiff);
					xyDown = [];
				}
			}
		}

		this.sliderWrap.addEventListener('touchstart', handleSwipeStart);
		this.sliderWrap.addEventListener('touchmove', handleSwipeMove);
		this.sliderWrap.addEventListener('mousedown', handleSwipeStart);
		this.sliderWrap.addEventListener('mousemove', handleSwipeMove);
	}


}

function renderSlider(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new slider(className, elem));
	}
	return objMas;
}


renderSlider('.room-card');