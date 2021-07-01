import { validationEmail } from '../validation-email/validation-email';


class subscriptionTextField {

	constructor(className: string, wraper: Element) {

		this.input = wraper.querySelector('input');
		this.link = wraper.querySelector(className + '__link');

		this.valid = new validationEmail({
			elem: this.input
		});

		this.setActions();
	}

	input: Element;
	link: Element;
	valid: validationEmail;

	validEmail() {
		if (this.valid.validation()) { alert('Вы оформили подписку.'); }
		else {
			alert('Вы ввели неверный Email.');
		}
	}

	private setActions() {

		let action = (e: any, fl = false) => {
			if (fl) {
				this.validEmail();
			}
			else {
				if (e.key == 'Enter')
					this.validEmail();
			}
		};

		this.input.addEventListener('keydown', (e: any) => { action(e); });
		this.link.addEventListener('click', (e: any) => { action(e); });
		this.link.addEventListener('click', (e: any) => { action(e, true); });
	}
}


function renderSubscrip(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new subscriptionTextField(className, elem));
	}
	return objMas;
}

renderSubscrip('.subscrip-textfield');


