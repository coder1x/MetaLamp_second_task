import './search-room.scss';

interface PT {
  block: string,
  button: string
}

class sidebar {
  blockClass: string;
  buttonClass: string;
  button: HTMLButtonElement;
  block: HTMLElement;
  classVisible: string;
  private click: boolean;

  constructor(options: PT) {
    this.blockClass = options.block;
    this.buttonClass = options.button;
    this.click = false;
    this.setDom();
    this.setActions();
  }

  private setDom() {
    this.button = document.querySelector(this.buttonClass);
    this.block = document.querySelector(this.blockClass);
    this.classVisible = this.blockClass.replace(/^\./, '') + '_visible';
  }

  private getVisible() {
    let display = window.getComputedStyle(this.block, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }

  private toggle(fl = this.getVisible()) {

    let objClass = this.block.classList;

    //	console.log(fl);

    if (!fl) {
      objClass.add(this.classVisible);
      let elem = this.block.querySelector('input');
      elem.focus();
    }
    else {
      objClass.remove(this.classVisible);
    }
  }

  private setActions() {

    if (!this.block) return;

    this.button.addEventListener('click', (e: any) => {
      this.click = true;
      this.toggle();

      const elem = e.target;
      let expanded = elem.getAttribute('aria-expanded');
      expanded = expanded == 'true' ? 'false' : 'true';
      elem.setAttribute('aria-expanded', expanded);
    });

    this.block.addEventListener('click', () => {
      this.click = true;
    });


    this.block.addEventListener('keydown', (e: any) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle();
      }
    });

    document.addEventListener('focusin', (e: any) => {
      const linkEl = e.target.closest(this.blockClass) ?? false;
      if (!linkEl && this.getVisible()) {
        const elem = this.button.querySelector('button');

        if (!e.path.includes(elem, 0)) {
          this.toggle();
          elem.focus();
        }
      }
    });

    document.addEventListener('click', () => {
      const flag = this.getVisible() && !this.click;

      if (flag)
        this.toggle(true);
      this.click = false;
    });
  }
}

new sidebar({
  block: '.search-room-filter',
  button: '.search-room-content__button-wrap'
});




