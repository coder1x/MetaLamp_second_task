import './registration.scss';

class registration {

  className: string;
  elem: Element;
  private buttonEl: Element | null = null;

  constructor(className: string, elem: Element) {
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
          flag = check(len != 10, 'дату рождения');
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

    for (let item of fields) {
      const dom = this.getElement(item);

      if (dom) {
        const len = dom.value.length;
        if (!messageErr(item, len))
          return false;
      }
    }
    return true;
  }

  private handleButton = (event: Event) => {
    if (!this.validation())
      event.preventDefault();
  }

  private setAction() {
    if (this.buttonEl)
      this.buttonEl.addEventListener('click', this.handleButton);
  }
}

function renderRegistration(className: string) {
  const components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new registration(className, elem));
  }
  return objMas;
}

renderRegistration('.js-registration');