import { validationEmail } from '../validationEmail/validationEmail';


class subscriptionTextField {

	constructor(public className: string) {

		this.wraper = document.querySelector(className);
		this.input = this.wraper.querySelector('input');
		this.img = this.wraper.querySelector('img');
		this.valid = new validationEmail('#form-subscription');

		this.setActions();
	}

	wraper: Element;
	input: Element;
	img: Element;
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


		this.img.addEventListener('click', () => {
			this.validEmail();
		});
	}

}


new subscriptionTextField('.subscriptionTextField');