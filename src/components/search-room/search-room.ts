import autoBind from 'auto-bind';
import './search-room.scss';

class SearchRoom {
  className: string;

  private dateInputs: Element[] | null = null;

  private guestsInput: HTMLInputElement | null = null;

  private buttonEl: Element | null = null;

  constructor(className: string, elem: Element) {
    autoBind(this);
    this.className = className;
    this.setDom(elem);
    this.setAction();
  }

  private setDom(elem: Element) {
    const date = `${this.className}__date-wrap input`;
    const guests = `${this.className}__dropdown-wrap input`;
    const submit = `${this.className}__button-wrap button`;

    this.dateInputs = [...elem.querySelectorAll(date)];
    this.guestsInput = elem.querySelector(guests);
    this.buttonEl = elem.querySelector(submit);
  }

  private validDate() {
    let input1: Element | null = null;
    let input2: Element | null = null;

    if (this.dateInputs) { [input1] = this.dateInputs; }

    if (this.dateInputs) { [, input2] = this.dateInputs; }

    let valInput1: number = 0; let
      valInput2: number = 0;
    if (input1 instanceof HTMLInputElement) { valInput1 = input1.value.length; }

    if (input2 instanceof HTMLInputElement) { valInput2 = input2.value.length; }

    const filled = valInput1 === 10 && valInput2 === 10;

    if (filled) {
      return true;
    }
    return false;
  }

  private validGuests() {
    let value: string = '';

    if (this.guestsInput instanceof HTMLInputElement) {
      value = this.guestsInput.value;
    }
    const filled = value && value !== 'Сколько гостей';

    if (filled) {
      return true;
    }
    return false;
  }

  private messageErr() {
    if (!this.validDate()) {
      // eslint-disable-next-line no-alert
      alert('Выберите дату.');
      return false;
    }

    if (!this.validGuests()) {
      // eslint-disable-next-line no-alert
      alert('Сколько гостей ?');
      return false;
    }
    return true;
  }

  private handleButtonClick(event: Event) {
    if (!this.messageErr()) {
      event.preventDefault();
    }
  }

  private setAction() {
    if (this.buttonEl) {
      this.buttonEl.addEventListener('click', this.handleButtonClick);
    }
  }
}

function renderSearchRoom(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: SearchRoom[] = [];
  components.forEach((elem) => {
    objMas.push(new SearchRoom(className, elem));
  });
  return objMas;
}

renderSearchRoom('.js-search-room');
renderSearchRoom('.js-booking');
