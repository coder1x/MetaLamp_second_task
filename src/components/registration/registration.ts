import './registration.scss';

class registration {

  className: string;
  elem: Element;
  private buttonEl: Element;


  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.setDom();
    this.setAction();
  }

  getElement(str: string): HTMLInputElement {
    const selector = this.className + '__' + str + '-wrap input';
    return this.elem.querySelector(selector);
  }

  private setDom() {
    const buttonS = this.className + '__submit-wrap button';
    this.buttonEl = this.elem.querySelector(buttonS);
  }

  private validation() {
    const messageErr = (str: string, len: number) => {

      function check(result: boolean, mess: string) {
        if (result) {
          alert('Введите ' + mess);
          return false;
        }
        return true;
      }

      let fl = true;
      switch (str) {
        case 'name':
          fl = check(len < 3, 'Имя');
          break;
        case 'surname':
          fl = check(len < 3, 'Фамилию');
          break;
        case 'date':
          fl = check(len != 10, 'дату рождения');
          break;
        case 'email':
          fl = check(len < 5, 'Email');
          break;
        case 'pass':
          fl = check(len < 6, 'Пароль');
          break;
        default:
          break;
      }
      return fl;
    };

    const fields = ['name', 'surname', 'date', 'email', 'pass'];

    for (let item of fields) {
      const len = this.getElement(item).value.length;
      if (!messageErr(item, len))
        return false;
    }

    return true;
  }

  private setAction() {
    this.buttonEl.addEventListener('click', (e: Event) => {
      if (!this.validation())
        e.preventDefault();
    });
  }
}


function renderRegistration(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new registration(className, elem));
  }
  return objMas;
}


renderRegistration('.js-registration');