import autoBind from 'auto-bind';
import './search-room.scss';

interface Options {
  block: string,
  button: string
}

class Sidebar {
  blockClass: string = '';

  buttonClass: string = '';

  button: HTMLButtonElement | null = null;

  block: HTMLElement | null = null;

  classVisible: string = '';

  private click: boolean = false;

  constructor(options: Options) {
    autoBind(this);
    this.blockClass = options.block;
    this.buttonClass = options.button;
    this.click = false;
    this.setDom();
    this.setActions();
  }

  private setDom() {
    this.button = document.querySelector(this.buttonClass);
    this.block = document.querySelector(this.blockClass);
    this.classVisible = `${this.blockClass.replace(/^\./, '')}_visible`;
  }

  private getVisible() {
    if (!this.block) return false;

    const display = window.getComputedStyle(this.block, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  private toggle(flag = this.getVisible()) {
    if (!this.block) return false;

    const objClass = this.block.classList;

    if (!flag) {
      objClass.add(this.classVisible);
      const elem = this.block.querySelector('input');
      if (elem) { elem.focus(); }
    } else {
      objClass.remove(this.classVisible);
    }
    return true;
  }

  private handleButtonClick(event: MouseEvent) {
    this.click = true;
    this.toggle();

    const dom = event.currentTarget as HTMLButtonElement;
    let expanded = dom.getAttribute('aria-expanded');
    expanded = expanded === 'true' ? 'false' : 'true';
    dom.setAttribute('aria-expanded', expanded);
  }

  private handleBlockClick() {
    this.click = true;
  }

  private handleBlockKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggle();
    }
  }

  private handleDocumentFocusin(event: FocusEvent) {
    const target = event.target as Element;
    const linkEl = target.closest(this.blockClass);

    if (!linkEl && this.getVisible() && this.button) {
      const elem = this.button.querySelector('button') as HTMLButtonElement;
      const path = (event.composedPath && event.composedPath());

      if (!path.includes(elem, 0)) {
        this.toggle();
        elem.focus();
      }
    }
  }

  private handleDocumentClick() {
    const flag = this.getVisible() && !this.click;

    if (flag) { this.toggle(true); }
    this.click = false;
  }

  private setActions() {
    if (!this.block || !this.button) return false;

    this.button.addEventListener('click', this.handleButtonClick);
    this.block.addEventListener('click', this.handleBlockClick);
    this.block.addEventListener('keydown', this.handleBlockKeydown);
    document.addEventListener('focusin', this.handleDocumentFocusin);
    document.addEventListener('click', this.handleDocumentClick);

    return true;
  }
}

const obj = new Sidebar({
  block: '.search-room-filter',
  button: '.search-room-content__button-wrap',
});

export default obj;
