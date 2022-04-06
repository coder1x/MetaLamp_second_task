import autoBind from 'auto-bind';
import './subscrip-textfield.scss';

import { ValidationEmail } from '../validation-email/validation-email';

class SubscriptionTextField {
  input: HTMLInputElement | null = null;

  link: Element | null = null;

  private valid: ValidationEmail | null = null;

  constructor(className: string, wrapper: Element) {
    autoBind(this);
    const input = wrapper.querySelector('input') as HTMLInputElement;
    this.input = input;

    this.link = wrapper.querySelector(`${className}__link`);
    this.valid = new ValidationEmail({
      elem: this.input,
    });

    this.setActions();
  }

  private validEmail() {
    if (this.valid) {
      if (this.valid.validation()) {
        // eslint-disable-next-line no-alert
        alert('Вы оформили подписку.');
      } else {
        // eslint-disable-next-line no-alert
        alert('Вы ввели неверный Email.');
      }
    }
  }

  private handleDomKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') { this.validEmail(); }
  }

  private handleLinkClick() {
    this.validEmail();
  }

  private setActions() {
    if (!this.input || !this.link) return false;

    this.input.addEventListener('keydown', this.handleDomKeydown);
    this.link.addEventListener('click', this.handleLinkClick);

    return true;
  }
}

function renderSubscrip(className: string) {
  const components = document.querySelectorAll(className);

  const objMas: SubscriptionTextField[] = [];
  components.forEach((elem) => {
    objMas.push(new SubscriptionTextField(className, elem));
  });
  return objMas;
}

renderSubscrip('.js-subscrip-textfield');
