import './search-room.scss';


class searchRoom {

  className: string;
  dateInputs: any;
  guestsInput: HTMLInputElement;
  buttonEl: Element;

  constructor(className: string, elem: Element) {

    this.className = className;
    this.setDom(elem);
    this.setAction();
  }

  setDom(elem: Element) {
    const date = this.className + '__date-wrap input';
    const guests = this.className + '__dropdown-wrap input';
    const submit = this.className + '__button-wrap button';

    this.dateInputs = elem.querySelectorAll(date);
    this.guestsInput = elem.querySelector(guests);
    this.buttonEl = elem.querySelector(submit);
  }

  validDate() {
    let input1 = this.dateInputs[0].value.length;
    let input2 = this.dateInputs[1].value.length;

    const filled = input1 == 10 && input2 == 10;

    if (filled) {
      return true;
    }
    return false;
  }

  validGuests() {
    const value = this.guestsInput.value;
    const filled = value && value != 'Сколько гостей';

    if (filled) {
      return true;
    }
    return false;
  }

  messageErr() {
    if (!this.validDate()) {
      alert('Выберите дату.');
      return false;
    }

    if (!this.validGuests()) {
      alert('Сколько гостей ?');
      return false;
    }
    return true;
  }

  setAction() {
    this.buttonEl.addEventListener('click', (e: any) => {
      if (!this.messageErr()) {
        e.preventDefault();
      }
    });
  }
}



function renderSearchRoom(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new searchRoom(className, elem));
  }
  return objMas;
}


renderSearchRoom('.search-room');

renderSearchRoom('.booking');
