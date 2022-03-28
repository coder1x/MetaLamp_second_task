import './sign-in.scss';

class signIn {

  className: string;
  private emailInputs: HTMLInputElement | null = null;
  private passInput: HTMLInputElement | null = null;
  private buttonEl: HTMLInputElement | null = null;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.setDom(elem);
    this.setAction();
  }

  private setDom(elem: Element) {
    const email = this.className + '__email-wrap input';
    const pass = this.className + '__pass-wrap input';
    const submit = this.className + '__button-wrap button';

    this.emailInputs = elem.querySelector(email);
    this.passInput = elem.querySelector(pass);
    this.buttonEl = elem.querySelector(submit);
  }

  private validation() {

    if (this.emailInputs instanceof HTMLInputElement)
      if (!this.emailInputs.value) {
        alert('Введите Email');
        return false;
      }

    if (this.passInput instanceof HTMLInputElement)
      if (!this.passInput.value) {
        alert('Введите пароль');
        return false;
      }
    return true;
  }

  private setAction() {
    if (this.buttonEl)
      this.buttonEl.addEventListener('click', (e: Event) => {
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

renderSignIn('.js-sign-in');