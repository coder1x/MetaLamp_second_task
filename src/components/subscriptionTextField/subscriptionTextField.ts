import { validationEmail } from '../validationEmail/validationEmail';


class subscriptionTextField {

	constructor(public className: string) {

		this.wraper = document.querySelector(className);
		this.input = this.wraper.querySelector('input');
		this.link = this.wraper.querySelector(className + '__link');
		this.valid = new validationEmail('.' + this.input.className);

		this.setActions();
	}

	wraper: Element;
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

		this.input.addEventListener('keydown', (e: any) => {
			if (e.key == 'Enter')
				this.validEmail();
		});


		this.link.addEventListener('click', (e) => {
			e.preventDefault();
			this.validEmail();
		});
	}

}


new subscriptionTextField('.subscriptionTextField');