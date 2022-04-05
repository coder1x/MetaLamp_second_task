import autoBind from 'auto-bind';
import './registration.scss';

class Registration {
  className: string;

  elem: Element;

  private buttonEl: Element | null = null;

  constructor(className: string, elem: Element) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this.setDom();
    this.setAction();
  }

  getElement(str: string): HTMLInputElement | null {
    const selector = `${this.className}__${str}-wrap input`;
    return this.elem.querySelector(selector);
  }

  private setDom() {
    const buttonS = `${this.className}__submit-wrap button`;
    this.buttonEl = this.elem.querySelector(buttonS);
  }

  private validation() {
    const messageErr = (str: string, len: number) => {
      function check(result: boolean, mess: string) {
        if (result) {
          // eslint-disable-next-line no-alert
          alert(`Введите ${mess}`);
          return false;
        }
        return true;
      }

      let flag = true;
      switch (str) {
        case 'name':
          flag = check(len < 3, 'Имя');
          break;
        case 'surname':
          flag = check(len < 3, 'Фамилию');
          break;
        case 'date':
          flag = check(len !== 10, 'дату рождения');
          break;
        case 'email':
          flag = check(len < 5, 'Email');
          break;
        case 'pass':
          flag = check(len < 6, 'Пароль');
          break;
        default:
          break;
      }
      return flag;
    };

    const fields = ['name', 'surname', 'date', 'email', 'pass'];

    for (let i = 0; i < fields.length; i += 1) {
      const item = fields[i];
      const domElement = this.getElement(item);

      if (domElement) {
        const len = domElement.value.length;
        if (!messageErr(item, len)) { return false; }
      }
    }
    return true;
  }

  private handleButton(event: Event) {
    if (!this.validation()) { event.preventDefault(); }
  }

  private setAction() {
    if (this.buttonEl) {
      this.buttonEl.addEventListener('click', this.handleButton);
    }
  }
}

function renderRegistration(className: string) {
  const components = document.querySelectorAll(className);

  const objMas: Registration[] = [];
  components.forEach((elem) => {
    objMas.push(new Registration(className, elem));
  });
  return objMas;
}

renderRegistration('.js-registration');
