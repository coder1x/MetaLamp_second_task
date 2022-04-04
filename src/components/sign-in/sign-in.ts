import autoBind from 'auto-bind';
import './sign-in.scss';

class SignIn {
  className: string;

  private emailInputs: HTMLInputElement | null = null;

  private passInput: HTMLInputElement | null = null;

  private buttonEl: HTMLElement | null = null;

  constructor(className: string, elem: Element) {
    autoBind(this);
    this.className = className;
    this.setDom(elem);
    this.setAction();
  }

  private setDom(elem: Element) {
    const email = `${this.className}__email-wrap input`;
    const pass = `${this.className}__pass-wrap input`;
    const submit = `${this.className}__button-wrap button`;

    this.emailInputs = elem.querySelector(email) as HTMLInputElement;
    this.passInput = elem.querySelector(pass) as HTMLInputElement;
    this.buttonEl = elem.querySelector(submit);
  }

  private validation() {
    if (!this.emailInputs || !this.passInput) return false;

    if (!this.emailInputs.value) {
      // eslint-disable-next-line no-alert
      alert('Введите Email');
      return false;
    }

    if (!this.passInput.value) {
      // eslint-disable-next-line no-alert
      alert('Введите пароль');
      return false;
    }
    return true;
  }

  private handleButtonClick(event: Event) {
    if (!this.validation()) { event.preventDefault(); }
  }

  private setAction() {
    if (this.buttonEl) {
      this.buttonEl.addEventListener('click', this.handleButtonClick);
    }
  }
}

function renderSignIn(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: SignIn[] = [];
  components.forEach((elem) => {
    objMas.push(new SignIn(className, elem));
  });
  return objMas;
}

renderSignIn('.js-sign-in');
