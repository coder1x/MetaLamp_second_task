import './search-room.scss';

interface Options {
  block: string,
  button: string
}

class sidebar {
  blockClass: string = '';
  buttonClass: string = '';
  button: HTMLButtonElement | null = null;
  block: HTMLElement | null = null;
  classVisible: string = '';
  private click: boolean = false;

  constructor(options: Options) {
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
    if (!this.block) return false;
    let display = window.getComputedStyle(this.block, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }

  private toggle(fl = this.getVisible()) {
    if (!this.block) return;
    let objClass = this.block.classList;

    if (!fl) {
      objClass.add(this.classVisible);
      const elem = this.block.querySelector('input');
      if (elem)
        elem.focus();
    }
    else {
      objClass.remove(this.classVisible);
    }
  }

  private setActions() {
    if (!this.block) return;

    if (this.button)
      this.button.addEventListener('click', (e: MouseEvent) => {
        this.click = true;
        this.toggle();

        const dom = e.target;
        if (dom instanceof HTMLButtonElement) {
          let expanded = dom.getAttribute('aria-expanded');
          expanded = expanded == 'true' ? 'false' : 'true';
          dom.setAttribute('aria-expanded', expanded);
        }
      });

    this.block.addEventListener('click', () => {
      this.click = true;
    });


    this.block.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle();
      }
    });

    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target;

      if (target instanceof Element) {
        const linkEl = target.closest(this.blockClass);
        if (!linkEl && this.getVisible() && this.button) {
          const elem = this.button.querySelector('button');
          const path = (e.composedPath && e.composedPath());
          if (elem)
            if (!path.includes(elem, 0)) {
              this.toggle();
              elem.focus();
            }
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




