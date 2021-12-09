import './search-room.scss';


class searchRoom {

  className: string;
  dateInputs: HTMLInputElement[];
  guestsInput: HTMLInputElement;
  buttonEl: Element;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.setDom(elem);
    this.setAction();
  }

  private setDom(elem: Element) {
    const date = this.className + '__date-wrap input';
    const guests = this.className + '__dropdown-wrap input';
    const submit = this.className + '__button-wrap button';

    this.dateInputs = [...elem.querySelectorAll<HTMLInputElement>(date)];
    this.guestsInput = elem.querySelector(guests);
    this.buttonEl = elem.querySelector(submit);
  }

  private validDate() {
    let input1 = this.dateInputs[0].value.length;
    let input2 = this.dateInputs[1].value.length;

    const filled = input1 == 10 && input2 == 10;

    if (filled) {
      return true;
    }
    return false;
  }

  private validGuests() {
    const value = this.guestsInput.value;
    const filled = value && value != 'Сколько гостей';

    if (filled) {
      return true;
    }
    return false;
  }

  private messageErr() {
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

  private setAction() {
    this.buttonEl.addEventListener('click', (e: Event) => {
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
