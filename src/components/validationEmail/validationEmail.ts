

class validationEmail {

	constructor(input: string, event: string) {
		this.inputElem = document.querySelector(input);
		// eslint-disable-next-line no-control-regex
		this.regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/u;

		this.inputElem.addEventListener(event, () => {
			this.validation(this.inputElem.value);
		});

	}

	private inputElem: HTMLInputElement;
	private regExpEmail: RegExp;

	private validation(text: string) {

		if (!this.regExpEmail.test(text)) {
			alert('Введите правильный Email');
		}
	}

}


new validationEmail('#form-subscription', 'change');
new validationEmail('#form-email', 'change');

