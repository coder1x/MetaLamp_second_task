import autoBind from 'auto-bind';
import './registration.scss';

class Registration {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this._setDom();
    this._setAction();
  }

  getElement(str) {
    const selector = `${this.className}__${str}-wrap input`;
    return this.elem.querySelector(selector);
  }

  _setDom() {
    const buttonS = `${this.className}__submit-wrap button`;
    this._buttonEl = this.elem.querySelector(buttonS);
  }

  _validation() {
    const messageErr = (str, len) => {
      function check(result, mess) {
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

  _handleButton(event) {
    if (!this._validation()) { event.preventDefault(); }
  }

  _setAction() {
    if (this._buttonEl) {
      this._buttonEl.addEventListener('click', this._handleButton);
    }
  }
}

function renderRegistration(className) {
  const components = document.querySelectorAll(className);

  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new Registration(className, elem));
  });
  return objMas;
}

renderRegistration('.js-registration');
