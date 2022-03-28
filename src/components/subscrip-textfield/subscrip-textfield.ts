import './subscrip-textfield.scss';
import { ValidationEmail } from '../validation-email/validation-email';

class SubscriptionTextField {

  input: HTMLInputElement | null = null;
  link: Element | null = null;
  private valid: ValidationEmail | null = null;

  constructor(className: string, wrapper: Element) {
    const input = wrapper.querySelector('input');
    if (input instanceof HTMLInputElement) {
      this.input = input;

      this.link = wrapper.querySelector(className + '__link');
      this.valid = new ValidationEmail({
        elem: this.input
      });
    }

    this.setActions();
  }

  private validEmail() {
    if (this.valid)
      if (this.valid.validation()) { alert('Вы оформили подписку.'); }
      else {
        alert('Вы ввели неверный Email.');
      }
  }

  private setActions() {
    const action = (e: Event | KeyboardEvent, fl = false) => {
      const eventK = e;
      if (fl) {
        this.validEmail();
      }
      else {
        if (eventK instanceof KeyboardEvent)
          if (eventK.key == 'Enter')
            this.validEmail();
      }
    };

    if (this.input)
      this.input.addEventListener(
        'keydown',
        (e: KeyboardEvent) => { action(e); });

    if (this.link) {
      this.link.addEventListener('click', (e: Event) => { action(e); });
      this.link.addEventListener('click', (e: Event) => { action(e, true); });
    }
  }
}

function renderSubscrip(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new SubscriptionTextField(className, elem));
  }
  return objMas;
}

renderSubscrip('.js-subscrip-textfield');