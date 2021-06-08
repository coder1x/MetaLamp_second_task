import $ from "jquery";


class dropDownGuest {

	adults: Element;
	children: Element;
	babies: Element;
	inputEl: Element;
	imgEl: Element;
	selectEl: Element;

	// eslint-disable-next-line no-unused-vars
	constructor(public className: string) {
		this.setDomElem();
		this.setActionInput();

	}

	setDomElem() {
		const dropClass = '.' + this.className;
		const inputClass = dropClass + '__input';
		const imgClass = dropClass + '__tip';
		const selectClass = dropClass + '__select';

		const elem = document.querySelector('.' + this.className);

		this.adults = elem.querySelector('[data-type="adults"]');
		this.children = elem.querySelector('[data-type="children"]');
		this.babies = elem.querySelector('[data-type="babies"]');

		this.inputEl = elem.querySelector(inputClass);
		this.imgEl = elem.querySelector(imgClass);
		this.selectEl = elem.querySelector(selectClass);
	}



	setActionInput() {
		let flag = false;
		let funAct = () => {

			if (!flag) {
				$(this.inputEl).css({
					"border-bottom-left-radius": "0px",
					"border-bottom-right-radius": "0px",
					"border": "1px solid rgba(31, 32, 65, 0.5)"
				});
				flag = true;
			}
			else {
				$(this.inputEl).css({
					"border-bottom-left-radius": "4px",
					"border-bottom-right-radius": "4px",
					"border": "1px solid rgba(31, 32, 65, 0.25)"
				});
				flag = false;
			}

			$(this.selectEl).toggle();
		};

		$(this.inputEl).on("click", funAct);
		$(this.imgEl).on("click", funAct);
	}



}




new dropDownGuest('dropDownGuest');


// клик по инпуту - показать селектор или скрыть (изменить стили)

// кнопки minus и plus - увеличивают или уменьшают значение ()

// Кнопка Очистить появляеться лишь когда значения отличны от нуля. 

// Очистить - сброс всех велью, очистка инпута и возврат стандартной надписи "Сколько гостей"

// Применить - формируем список гостей в инпуте - с правильным склонением 