import './subscrip-textfield.scss';
import { validationEmail } from '../validation-email/validation-email';


class subscriptionTextField {

  constructor(className: string, wraper: Element) {

    this.input = wraper.querySelector('input') as HTMLInputElement;
    this.link = wraper.querySelector(className + '__link');

    this.valid = new validationEmail({
      elem: this.input
    });

    this.setActions();
  }

  input: HTMLInputElement;
  link: Element;
  valid: validationEmail;

  validEmail() {
    if (this.valid.validation()) { alert('Вы оформили подписку.'); }
    else {
      alert('Вы ввели неверный Email.');
    }
  }

  private setActions() {

    const action = (e: Event | KeyboardEvent, fl = false) => {
      const eventK = e as KeyboardEvent;
      if (fl) {
        this.validEmail();
      }
      else {
        if (eventK.key == 'Enter')
          this.validEmail();
      }
    };

    this.input.addEventListener(
      'keydown',
      (e: KeyboardEvent) => { action(e); });
    this.link.addEventListener('click', (e: Event) => { action(e); });
    this.link.addEventListener('click', (e: Event) => { action(e, true); });
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


