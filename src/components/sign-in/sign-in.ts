import './sign-in.scss';

class signIn {

	emailInputs: HTMLInputElement;
	passInput: HTMLInputElement;
	buttonEl: HTMLInputElement;
	className: string;

	constructor(className: string, elem: Element) {
		this.className = className;
		this.setDom(elem);
		this.setAction();
	}

	setDom(elem: Element) {
		const email = this.className + '__email-wrap input';
		const pass = this.className + '__pass-wrap input';
		const submit = this.className + '__button-wrap button';

		this.emailInputs = elem.querySelector(email);
		this.passInput = elem.querySelector(pass);
		this.buttonEl = elem.querySelector(submit);
	}

	validation() {
		if (!this.emailInputs.value) {
			alert('Введите Email');
			return false;
		}

		if (!this.passInput.value) {
			alert('Введите пароль');
			return false;
		}
		return true;
	}

	setAction() {
		this.buttonEl.addEventListener('click', (e: any) => {
			if (!this.validation())
				e.preventDefault();
		});
	}
}

function renderSignIn(className: string) {
	let components = document.querySelectorAll(className);
	let objMas = [];
	for (let elem of components) {
		objMas.push(new signIn(className, elem));
	}
	return objMas;
}


renderSignIn('.sign-in');