

class validationEmail {

	constructor(input: string, message: string, event?: string) {

		this.inputElem = document.querySelectorAll(input);

		// eslint-disable-next-line no-control-regex
		this.regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

		if (event)
			this.setEvent(event, message);

	}

	private inputElem: any;
	private regExpEmail: RegExp;

	private setEvent(event: string, message: string) {
		for (let item of this.inputElem)
			item.addEventListener(event, (e: any) => {
				if (!this.validation(e.target))
					alert(message);
			});
	}

	public validation(elem: HTMLInputElement) {
		if (this.regExpEmail.test(elem.value)) {
			return true;
		}
		return false;
	}

}



new validationEmail('.textField__input[name="email"]',
	'Вы ввели неверный Email.', 'change');


//export { validationEmail };
