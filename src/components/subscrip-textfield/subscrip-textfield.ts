import { validationEmail } from '../validation-email/validation-email';


class subscriptionTextField {

	constructor(public className: string) {

		this.wraper = document.querySelector(className);
		this.input = this.wraper.querySelector('input');
		this.link = this.wraper.querySelector(className + '__link');

		let objValid = new validationEmail({
			message: 'Вы ввели неверный Email.',
			elem: this.input
		});

		console.log(objValid);


		this.setActions();
	}

	wraper: Element;
	input: Element;
	link: Element;


	validEmail() {
		// if (this.valid.validation()) { alert('Вы оформили подписку.'); }
		// else {
		// 	alert('Вы ввели неверный Email.');
		// }
	}


	private setActions() {

		this.input.addEventListener('keydown', (e: any) => {
			if (e.key == 'Enter')
				this.validEmail();
		});


		this.link.addEventListener('click', (e: any) => {
			if (e.key == 'Enter')
				this.validEmail();
		});


		this.link.addEventListener('click', (e) => {
			e.preventDefault();
			this.validEmail();
		});
	}

}


new subscriptionTextField('.subscrip-textfield');