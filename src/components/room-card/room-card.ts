import './room-card.scss';


class slider {

  className: string;
  elem: Element;
  slidesEl: HTMLElement[];
  dotEl: Element;
  prevEl: HTMLElement;
  nextEl: HTMLElement;
  indexS: number;
  indexDot: number;
  sliderWrap: HTMLElement;
  flagSwipe: boolean;
  linkSlide: HTMLElement;
  swipe: boolean;
  timeS: number;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.init();
  }

  getElement(str: string): HTMLElement {
    const selector = this.className + '__' + str + '-wrap';
    return this.elem.querySelector(selector);
  }

  setVisible(index: number) {
    const date = Number(new Date());
    if (date - this.timeS > 150) {
      this.toggle(this.slidesEl[this.indexS], true); // удаляем класс с пред идущего слайда
      this.indexS = index;
      this.toggle(this.slidesEl[index]); // показываем новый
      this.paintDot();
    }
  }

  private init() {
    this.indexS = 0;
    this.indexDot = 0;
    this.swipe = false;
    this.timeS = 0;
    this.setDom();
    this.createDot();
    this.paintDot();
    this.setAction();
    this.setActionSwipe();
  }

  private setDom() {
    const slide = this.className + '__slide';
    this.slidesEl = [...this.elem.querySelectorAll<HTMLElement>(slide)];
    this.dotEl = this.getElement('dot');
    this.prevEl = this.getElement('prev');
    this.nextEl = this.getElement('next');
    this.sliderWrap = this.getElement('slider');
    this.linkSlide = this.elem.querySelector(this.className + '__link');
  }

  private getVisible(elem: Element) {
    let opacity = window.getComputedStyle(elem, null)
      .getPropertyValue('opacity');
    return opacity === '0' ? false : true;
  }

  private toggle(slide: Element, fl = false) {
    const prefix = '__slide' + '_visible';
    const clearName = this.className.replace(/^\./, '') + prefix;

    let objClass = slide.classList;
    !fl ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private paintDot() {
    const dotCl = this.className + '__dot';
    let modify = dotCl + '_paint';
    modify = modify.replace(/^\./, '');
    let dots = this.elem.querySelectorAll(dotCl);
    this.indexDot;

    let objClass = dots[this.indexDot].classList;
    objClass.remove(modify); // удаляем модификатор с текущей точки

    objClass = dots[this.indexS].classList;
    objClass.add(modify); // ставим модификатор
    this.indexDot = this.indexS;
  }

  private createDot() {
    const classN = this.className.replace(/^\./, '') + '__dot';

    for (let i = 0; i < this.slidesEl.length; i++) {
      const dot = document.createElement('span');
      dot.classList.add(classN);
      dot.setAttribute('data-index', String(i));
      this.dotEl.appendChild(dot);
    }
  }


  private setAction() {

    this.prevEl.addEventListener('click', () => {
      if (this.indexS > 0) {
        this.setVisible(this.indexS - 1);
      }
      else {
        this.setVisible(this.slidesEl.length - 1);
      }
      this.timeS = Number(new Date());
    });

    this.nextEl.addEventListener('click', () => {
      const len = this.slidesEl.length - 1;
      if (this.indexS < len) {
        this.setVisible(this.indexS + 1);
      }
      else {
        this.setVisible(0);
      }
      this.timeS = Number(new Date());
    });

    this.linkSlide.addEventListener('click', (e: Event) => {
      if (this.flagSwipe) {
        e.preventDefault();
      }
      this.flagSwipe = false;
    });

    this.dotEl.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const index = Number(target.getAttribute('data-index'));
      if (this.indexS != index && !isNaN(index))
        this.setVisible(index);
    });
  }


  private setActionSwipe() {
    let xyDown: number[] = [];
    this.linkSlide.addEventListener('focus', () => {

      if (this.swipe) {
        this.linkSlide.blur();
      }
      this.swipe = false;
    });

    const handleSwipeStart = (ev: MouseEvent | TouchEvent) => {
      this.swipe = true;
      xyDown = getCoordinatesXY(ev);
    };

    function getCoordinatesXY(ev: MouseEvent | TouchEvent): number[] {
      const eventT = ev as TouchEvent;
      const eventM = ev as MouseEvent;
      if (ev.type == 'touchstart' || ev.type == 'touchmove')
        return [eventT.touches[0].clientX, eventT.touches[0].clientY];

      if (ev.type == 'mousedown' || ev.type == 'mousemove')
        return [eventM.clientX, eventM.clientY];

      return [];
    }

    const swipe = (xyDiff: number[]) => {
      if (xyDiff[0] > 0) {
        this.nextEl.click();
      } else {
        this.prevEl.click();
      }
      this.flagSwipe = true;
    };

    const handleSwipeMove = (ev: MouseEvent | TouchEvent) => {
      if (!xyDown) {
        return;
      }

      const eventM = ev as MouseEvent;
      const touchmove = ev.type == 'touchmove';
      const mousemove = ev.type == 'mousemove';

      const event = touchmove || mousemove && eventM.buttons == 1;

      if (event) {
        let xyUp: number[] = getCoordinatesXY(ev);

        if (Math.abs((xyUp[0] - xyDown[0])) > 20) {
          let xyDiff = [xyDown[0] - xyUp[0], xyDown[1] - xyUp[1]];
          const date = Number(new Date());
          if (date - this.timeS > 200)
            swipe(xyDiff);
          xyDown = [];
        }
      }
    };

    this.sliderWrap.addEventListener('touchstart', handleSwipeStart);
    this.sliderWrap.addEventListener('touchmove', handleSwipeMove);
    this.sliderWrap.addEventListener('mousedown', handleSwipeStart);
    this.sliderWrap.addEventListener('mousemove', handleSwipeMove);
  }


}

function renderSlider(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new slider(className, elem));
  }
  return objMas;
}


renderSlider('.room-card');