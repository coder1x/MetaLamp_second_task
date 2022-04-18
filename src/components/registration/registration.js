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
    return this.elem.querySelector(`${this.className}__${str}-wrap input`);
  }

  _setDom() {
    this._buttonEl = this.elem.querySelector(
      `${this.className}__submit-wrap button`,
    );
  }

  static _checkLen(result, mess) {
    if (result) {
      // eslint-disable-next-line no-alert
      alert(`Введите ${mess}`);
      return false;
    }
    return true;
  }

  static _messageErr(str, len) {
    let flag = true;
    switch (str) {
      case 'name':
        flag = Registration._checkLen(len < 3, 'Имя');
        break;
      case 'surname':
        flag = Registration._checkLen(len < 3, 'Фамилию');
        break;
      case 'date':
        flag = Registration._checkLen(len !== 10, 'дату рождения');
        break;
      case 'email':
        flag = Registration._checkLen(len < 5, 'Email');
        break;
      case 'pass':
        flag = Registration._checkLen(len < 6, 'Пароль');
        break;
      default:
        break;
    }
    return flag;
  }

  _validation() {
    const fields = ['name', 'surname', 'date', 'email', 'pass'];

    for (let i = 0; i < fields.length; i += 1) {
      const item = fields[i];
      const domElement = this.getElement(item);

      if (domElement) {
        if (!Registration._messageErr(item, domElement.value.length)) {
          return false;
        }
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

export default Registration;
